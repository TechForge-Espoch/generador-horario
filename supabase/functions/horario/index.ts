import { corsHeaders } from "../_shared/cors.ts";
import { SchemaType } from "npm:@google/generative-ai";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Database, TablesInsert } from "../_shared/database.types.ts";
import { extractDataWithGemini } from "../_shared/gemini.ts";
import { supabaseClient as supabase } from "../_shared/supabaseClient.ts";

const PROMPT = `
Dame todas las materias del horario: (numero dia semana (lunes es 1), materia (solo el nombre no el paralelo), paralelo, hora inicio en formato 24 horas, hora fin en formato 24 horas) solo responde en formato json. Las horas de clase siempre son 2 horas, si 2 materias estan seguidas júntalas en una sola
. Analiza a detalle el horario por dia a dia y verifica que no haya errores
`;

const PROMPT2 = `
Dame el pao y el paralelo y todas las materias (numero dia semana (lunes es 1), materia, hora inicio (solo la hora), hora fin (solo la hora) solo responde en formato json. Las horas de clase siempre son 2 horas, si 2 materias estan seguidas júntalas en una sola

formato JSON: { pao: numero, paralelo: numero, materias: [ { nombre: texto, dia: numero , hora_inicio: numero, hora_fin: numero } ]
`;
interface GeminiHorarioResponse {
  materias: Horario[];
  pao: number;
  paralelo: number;
}

interface Horario {
  dia: number;
  hora_inicio: number;
  hora_fin: number;
  materia: string;
}

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    response: {
      type: SchemaType.BOOLEAN,
    },
    pao: {
      type: SchemaType.NUMBER,
    },
    paralelo: {
      type: SchemaType.NUMBER,
    },
    materias: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          dia: {
            type: SchemaType.INTEGER,
          },
          horaInicio: {
            type: SchemaType.INTEGER,
          },
          horaFin: {
            type: SchemaType.INTEGER,
          },
          materia: {
            type: SchemaType.STRING,
          },
        },
        required: [
          "dia",
          "horaInicio",
          "horaFin",
          "materia",
        ],
      },
    },
  },
  required: [
    "pao",
    "paralelo",
    "materias",
  ],
};

async function handleRequest(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const form = await req.formData();
    console.log("📩 FormData recibida:");
    form.forEach((value, key) => console.log(`${key}:`, value));
    const file = form.get("file") as File;

    const anioInicio_input = form.get("anio_inicio")
      ? Number(form.get("anio_inicio"))
      : null;
    const anioFin_input = form.get("anio_fin")
      ? Number(form.get("anio_fin"))
      : null;

    const pao_input = form.get("pao") ? Number(form.get("pao")) : null;
    let codigoCarrera = form.get("cod_carrera")
      ? Number(form.get("cod_carrera"))
      : null;

    if (!file || file.size === 0) {
      console.log("El archivo de imagen está vacío o no existe");
      return new Response(
        JSON.stringify({
          message: "El archivo de imagen está vacío o no existe",
        }),
        { headers: corsHeaders, status: 400 },
      );
    }

    const creditoMaterias = await supabase.from("materia").select(
      "nombre, numero_credito",
    )
      .eq("cod_carrera", codigoCarrera)
      .eq("pao", pao_input);

    const materiasCredito = creditoMaterias.data || [];

    const horasMateria: { materia: string; horas: number }[] = materiasCredito
      .map((m) => ({
        materia: m.nombre,
        horas: m.numero_credito * 2,
      }));

    // - materia (nombre) tiene X horas
    const text = horasMateria.reduce((acc, curr) => {
      return acc + `- ${curr.materia} tiene ${curr.horas} horas a la semana\n`;
    }, "");

    const resGemini = await extractDataWithGemini(
      file,
      PROMPT +
        "\nAnaliza bien teniendo en cuenta lo siguiente en cuenta lo siguiente: \n" +
        text,
      RESPONSE_SCHEMA,
      file.type,
    );

    console.log("Respuesta de Gemini:", resGemini);

    const {
      carrera,
      materias,
      pao: pao_g,
      paralelo,
    } = resGemini as GeminiHorarioResponse;

    const pao = pao_input || pao_g;
    const anioInicio = anioInicio_input;
    const anioFin = anioFin_input;
    // const pao = pao_g;
    // const anioInicio = anioInicio_g;
    // const anioFin = anioFin_g;
    // let codigoCarrera = null;

    if (!pao || !anioInicio || !anioFin) {
      console.log("Todos los campos son obligatorios");
      return new Response(
        JSON.stringify({
          message: "Todos los campos son obligatorios",
        }),
        { headers: corsHeaders, status: 400 },
      );
    }

    if (materias.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No se encontraron materias",
        }),
        { headers: corsHeaders, status: 400 },
      );
    }

    if (codigoCarrera == null) {
      const buscarCarrera = await supabase.rpc("get_carrera_id", {
        nombre_carrera: carrera,
      }).returns<number>();

      if (buscarCarrera.error) {
        console.log(buscarCarrera.error);
        return new Response(
          JSON.stringify({
            message: "Error al buscar la carrera",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }

      if (!buscarCarrera.data) {
        console.log("No se encontró la carrera");
        return new Response(
          JSON.stringify({
            message: "No se encontró la carrera",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }

      codigoCarrera = buscarCarrera.data;
    }

    const buscarHorario = await supabase.from("horario").select("*").eq(
      "anio_inicio",
      anioInicio,
    ).eq("anio_fin", anioFin)
      .eq("cod_carrera", codigoCarrera)
      .eq("paralelo", paralelo)
      .eq("pao", pao);

    if (buscarHorario.error) {
      console.log(buscarHorario.error);
      return new Response(
        JSON.stringify({
          message: "Error al buscar el horario",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    let id_horario = buscarHorario.data[0]?.id_horario || null;
    if (id_horario) {
      // borrar todos horario_materia que tengan ese id de horario
      await supabase.from("horario_materia")
        .delete().eq("cod_horario", id_horario);
    }

    if (id_horario == null) {
      const nuevoHorario: TablesInsert<"horario"> = {
        anio_fin: anioFin,
        anio_inicio: anioInicio,
        cod_carrera: codigoCarrera,
        pao,
        paralelo,
        cod_periodo: codigoPeriodo,
      };

      const newHorario = await supabase.from("horario").insert(nuevoHorario)
        .select();

      if (newHorario.error) {
        console.log(newHorario.error);

        return new Response(
          JSON.stringify({
            message: "Error al insertar el horario",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }

      id_horario = newHorario.data[0]?.id_horario || null;
    }

    if (id_horario == null) {
      return new Response(
        JSON.stringify({
          message: "No se pudo obtener el id del horario",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // nuevo horario
    // const buscarMateriasCarrera = await supabase.from("materia").select(
    //   "nombre, id_materia",
    // )
    //   .eq("cod_carrera", codigoCarrera);
    // console.log(buscarMateriasCarrera.data, "codcarrera: ", codigoCarrera);

    // if (buscarMateriasCarrera.data == null) {
    //   return new Response(
    //     JSON.stringify({
    //       message: "No se encontraron materias de la carrera",
    //     }),
    //     {
    //       headers: { ...corsHeaders, "Content-Type": "application/json" },
    //       status: 400,
    //     },
    //   );
    // }

    // const materiasCarrera = buscarMateriasCarrera.data || [];

    for (const horario of materias) {
      const { materia, dia, horaFin, horaInicio } = horario;

      const buscarMateria = await supabase.rpc("find_materia", {
        materia_nombre: materia,
        codigo_carrera: codigoCarrera,
      }).returns<number>();

      if (!buscarMateria.data) {
        console.log("No se encontró la materia:", materia);
        continue;
      }

      const idmateria = buscarMateria.data;

      if (!idmateria) {
        console.log("No se encontró la materia:", materia);
        continue;
      }
      const horaInicioConvertida = Math.floor(horaInicio);
      const horaFinConvertida = Math.floor(horaFin);

      await supabase.from("horario_materia").insert({
        numero_dia: dia,
        hora_inicio: horaInicioConvertida,
        hora_fin: horaFinConvertida,
        cod_materia: idmateria,
        cod_horario: id_horario,
        paralelo,
      });
    }

    // anioinicio-aniofin-carrera-pao-paralelo-v2
    const { data: fileData } = await supabase.storage.from("archivos/horarios")
      .upload(
        `${anioInicio}-${anioFin}-${carrera}-${pao}-${paralelo}.png`,
        file,
        { contentType: "image/png", upsert: true },
      );

    if (fileData) {
      await supabase.from("horario").update({ url: fileData.path }).eq(
        "id_horario",
        id_horario,
      );
    }

    // Retornar respuesta al cliente
    return new Response(
      JSON.stringify({
        message: "Horario procesado con éxito",
        id_horario,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Error al procesar la respuesta del modelo: " +
          (error as Error).message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
}

// Iniciar el servidor Deno
Deno.serve(handleRequest);
