// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SchemaType } from "npm:@google/generative-ai";

import { supabaseClient as supabase } from "../_shared/supabaseClient.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { extractDataWithGemini } from "../_shared/gemini.ts";

const PROMPT =
  "Extraer la facultad, la carrera y las materias con su pao, código, nombre, créditos, requisitos (si es igual a matrícula déjalo vacío)";

interface GeminiResponse {
  response: boolean;
  facultad: string;
  carrera: string;
  materias: {
    pao: number;
    codigo: string;
    nombre: string;
    creditos: number;
    requisitos: string[];
  }[];
}

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    response: {
      type: SchemaType.BOOLEAN,
    },
    facultad: {
      type: SchemaType.STRING,
    },
    carrera: {
      type: SchemaType.STRING,
    },
    materias: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          pao: {
            type: SchemaType.INTEGER,
          },
          codigo: {
            type: SchemaType.STRING,
          },
          nombre: {
            type: SchemaType.STRING,
          },
          creditos: {
            type: SchemaType.INTEGER,
          },
          requisitos: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.STRING,
            },
          },
        },
        required: [
          "pao",
          "codigo",
          "nombre",
          "creditos",
        ],
      },
    },
  },
  required: [
    "facultad",
    "carrera",
  ],
};

const findOrCreateFacultad = async (facultad: string) => {
  console.log("Buscando o creando la facultad", facultad);
  const { data: idFacultad, error } = await supabase.rpc(
    "find_or_create_facultad",
    { facultad_nombre: facultad },
  ).returns<number>();

  if (error) {
    console.log(error);
    throw new Error("Error al buscar la facultad");
  }

  return idFacultad;
};

const findOrCreateCarrera = async (carrera: string, cod_facultad: number) => {
  console.log("Buscando o creando la carrera", carrera);
  const { data: idFacultad, error } = await supabase.rpc(
    "find_or_create_carrera",
    { carrera_nombre: carrera, id_facultad: cod_facultad },
  ).returns<number>();

  if (error) {
    console.log(error);
    throw new Error("Error al buscar la carrera");
  }

  return idFacultad;
};

const findOrCreateMateria = async (
  materia: string,
  codigo: string,
  codigo_carrera: number,
  anio_malla: number,
  pao: number,
  numero_creditos: number,
) => {
  console.log("Buscando o creando la materia", materia);
  const { data: idFacultad, error } = await supabase.rpc(
    "find_or_create_materia2",
    {
      materia_nombre: materia,
      codigo_materia: codigo,
      codigo_carrera,
      anio_malla,
      numero_pao: pao,
      cantidad_creditos: numero_creditos,
    },
  ).returns<number>();

  if (error) {
    console.log(error);
    throw new Error("Error al buscar la materia");
  }

  return idFacultad;
};

const createPrerequisitos = async (
  codigo_materia: number,
  codigos_requisito: string[],
) => {
  const { data, error } = await supabase.rpc("create_prerequisitos", {
    p_codigo_materia: codigo_materia,
    codigos_requisito,
  });

  if (error) {
    console.log(error);
    throw new Error("Error al crear los prerequisitos: " + error.message);
  }

  return data; // Devuelve los registros insertados
};

/**
 * Procesar la solicitud HTTP recibida y ejecutar la lógica.
 * @param req Solicitud HTTP
 * @returns Respuesta HTTP
 */
async function handleRequest(req: Request) {
  // Verificar que la solicitud es de tipo POST
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // medir el tiempo
  const start = Date.now();

  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const anio_aprobacion = form.get("anio_aprobacion") as string;

    const resGemini = await extractDataWithGemini(
      file,
      PROMPT,
      RESPONSE_SCHEMA,
    );

    const { facultad, carrera, materias } = resGemini as GeminiResponse;

    if (!facultad || !carrera || !materias || materias.length === 0) {
      throw new Error("No se pudo extraer la información");
    }

    const id_facultad = await findOrCreateFacultad(facultad);
    const id_carrera = await findOrCreateCarrera(carrera, id_facultad);

    for (const materia of materias) {
      const id_materia = await findOrCreateMateria(
        materia.nombre,
        materia.codigo,
        id_carrera,
        2020,
        materia.pao,
        materia.creditos,
      );

      await createPrerequisitos(id_materia, materia.requisitos);
    }

    const originalFilename = `${anio_aprobacion}-${facultad}-${carrera}.pdf`;
    const sanitizedFilename = sanitizeFilename(originalFilename);

    const { data: fileData, error: fileError } = await supabase.storage
      .from("archivos/mallascurriculares")
      .upload(sanitizedFilename, file, {
        contentType: "application/pdf",
        upsert: true,
      });

    // subir la url a la tabla malla_curricular con cod_carrera, anio_aprobacion, url

    const { data: mallaData, error: mallaError } = await supabase
      .from("malla_curricular")
      .insert([
        {
          cod_carrera: id_carrera,
          anio_aprobacion,
          url: fileData?.path,
        },
      ])
      .select(); // Para retornar los datos insertados

    if (fileError) {
      console.log(fileError);
      throw new Error("Error al subir el archivo");
    }

    if (mallaError) {
      console.log(mallaError);
      throw new Error("Error al insertar la malla curricular");
    }

    const responseData = resGemini;
    console.log("Resultado:", responseData);

    return new Response(
      JSON.stringify({
        message: "Archivo procesado con éxito",
        data: responseData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } finally {
    console.log("Tiempo de ejecución:", Date.now() - start, "ms");
  }
}

// Iniciar el servidor Deno
Deno.serve(handleRequest);

/**
 * Sanitiza el nombre de un archivo para cumplir con las reglas de Supabase Storage.
 * Reemplaza espacios por guiones bajos, elimina caracteres especiales y convierte a minúsculas.
 * @param filename Nombre original del archivo.
 * @returns Nombre sanitizado del archivo.
 */
function sanitizeFilename(filename: string): string {
  // Convertir a minúsculas
  let sanitized = filename.toLowerCase();

  // Reemplazar espacios por guiones bajos
  sanitized = sanitized.replace(/\s+/g, "_");

  // Eliminar caracteres especiales excepto guiones bajos y puntos
  sanitized = sanitized.replace(/[^a-z0-9_\-\.]/g, "");

  // Opcional: eliminar acentos y otros diacríticos
  sanitized = sanitized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return sanitized;
}
