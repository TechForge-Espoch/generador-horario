import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase";
import { Tables } from "../../database.types";

// ✅ Función para obtener las materias de un horario
async function getHorarioMaterias(horarioId: number) {
  const response = await supabase
    .from("horario_materia")
    .select("*")
    .eq("cod_horario", horarioId)
    .order("numero_dia, hora_inicio", { ascending: true });

  console.log("📌 Horario Materias obtenidas:", response.data);
  return response;
}

// ✅ Función para obtener la lista de materias con sus nombres
async function getMaterias() {
  const response = await supabase.from("materia").select("id_materia, nombre");
  console.log("📌 Materias obtenidas:", response.data);
  return response;
}

export default function ListarHorarios() {
  const { horarioId } = useParams();
  const [horarioMaterias, setHorarioMaterias] = useState<
    Tables<"horario_materia">[]
  >([]);
  const [materias, setMaterias] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHorarioDetalles() {
      if (!horarioId) return;
      setLoading(true);

      // 🔹 Obtener lista de nombres de materias
      const { data: materiasData, error: materiasError } = await getMaterias();
      if (materiasError) {
        console.error("❌ Error al obtener materias:", materiasError);
        setLoading(false);
        return;
      }

      // 🔹 Mapear id_materia -> nombre
      const materiasMap = new Map<number, string>();
      materiasData?.forEach((m) => materiasMap.set(m.id_materia, m.nombre));
      setMaterias(materiasMap);
      console.log("📌 Materias mapeadas:", materiasMap);

      // 🔹 Obtener materias del horario
      const { data: horarioMateriasData, error } = await getHorarioMaterias(
        Number(horarioId)
      );
      if (error) {
        console.error("❌ Error al obtener horario_materia:", error);
        setLoading(false);
        return;
      }

      setHorarioMaterias(horarioMateriasData || []);
      setLoading(false);
    }
    fetchHorarioDetalles();
  }, [horarioId]);

  function getMateriaNombre(codMateria: number) {
    return materias.get(codMateria) || "—";
  }

  function formatoHora(hora: number) {
    return `${hora.toString().padStart(2, "0")}:00`;
  }

  return (
    <div className="container">
      <h1 className="title">📅 Listado de Horarios</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : horarioMaterias.length > 0 ? (
        <table className="horario-table">
          <thead>
            <tr>
              <th>Horario</th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miércoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
            </tr>
          </thead>
          <tbody>
            {[7, 9, 11, 13, 15, 17].map((hora) => (
              <tr key={hora}>
                <td className="horario-hora">
                  {formatoHora(hora)} - {formatoHora(hora + 2)}
                </td>
                {[1, 2, 3, 4, 5].map((dia) => {
                  // 🔹 Filtrar materias del día y dentro del rango de hora específica
                  const materiasDiaHora = horarioMaterias.filter(
                    (m) =>
                      m.numero_dia === dia &&
                      (m.hora_inicio === hora ||
                        (hora >= m.hora_inicio && hora < m.hora_fin))
                  );

                  console.log(
                    `📌 Materias para dia ${dia}, hora ${hora}:`,
                    materiasDiaHora
                  );

                  return (
                    <td key={dia} className="horario-celda">
                      {materiasDiaHora.length > 0
                        ? materiasDiaHora.map((materia) => (
                            <div key={materia.cod_materia} className="materia">
                              {getMateriaNombre(materia.cod_materia)}
                            </div>
                          ))
                        : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay materias asignadas a este horario.</p>
      )}
    </div>
  );
}
