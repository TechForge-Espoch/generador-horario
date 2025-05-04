import React, { useEffect, useState } from "react";
import supabase from "../supabase";

// Nuevo tipo personalizado
type CarreraConFacultad = {
  id_carrera: number;
  nombre: string;
  cod_facultad: number | null;
  created_at: string;
  facultad?: {
    id_facultad: number;
    nombre: string;
    nombre_siglas: string | null;
  } | null;
};

// Consulta a Supabase con TODOS los campos requeridos
async function getCarreras(): Promise<CarreraConFacultad[]> {
  const { data, error } = await supabase.from("carrera").select(
    `id_carrera, nombre, cod_facultad, created_at, 
       facultad(id_facultad, nombre, nombre_siglas)`
  );

  if (error) {
    console.error("Error al obtener carreras:", error);
    return [];
  }

  return data;
}

export default function ListarCarreras() {
  const [carrerasPorFacultad, setCarrerasPorFacultad] = useState<
    Record<string, CarreraConFacultad[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      const carreras = await getCarreras();

      // Agrupar carreras por facultad
      const agrupado: Record<string, CarreraConFacultad[]> = {};
      carreras.forEach((carrera) => {
        const facultad = carrera.facultad?.nombre || "Sin Facultad";
        if (!agrupado[facultad]) agrupado[facultad] = [];
        agrupado[facultad].push(carrera);
      });

      setCarrerasPorFacultad(agrupado);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Listado de Carreras</h1>
      <div className="carrera-container">
        {Object.entries(carrerasPorFacultad).map(([facultad, carreras]) => (
          <div key={facultad} className="facultad">
            <h2>{facultad}</h2>
            <ul>
              {carreras.map((c) => (
                <li key={c.id_carrera}>
                  {c.nombre}{" "}
                  <span className="codigo">
                    ({c.facultad?.nombre_siglas || "N/A"})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
