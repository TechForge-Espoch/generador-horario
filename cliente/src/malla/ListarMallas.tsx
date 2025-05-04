import React, { useEffect } from "react";
import supabase from "../supabase";
import { Tables } from "../../database.types";

async function getMallas() {
  const res = await supabase.from("malla_curricular").select("*");

  return res;
}

function getPublicUrl(url: string) {
  const { data } = supabase.storage
    .from("archivos/mallascurriculares")
    .getPublicUrl(url);

  return data.publicUrl;
}

export default function ListarMallas() {
  const [malla, setMalla] = React.useState<Tables<"malla_curricular">[]>([]);
  const [carreras, setCarreras] = React.useState<Tables<"carrera">[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: malla, error } = await getMallas();
      if (error) console.log("error", error);
      else setMalla(malla);

      if (malla == null) return;
      const codCarreras = malla.map((m) => m.cod_carrera);
      console.log(codCarreras);

      const carreras = await supabase
        .from("carrera")
        .select("*")
        .in("id_carrera", codCarreras);
      if (carreras.error) console.log("error", carreras.error);
      else setCarreras(carreras.data);
    }

    fetchData();
  }, []);

  console.log(carreras);

  return (
    <>
      <div className="container">
        <h1 className="title">Listado de mallas curriculares</h1>
        <nav>
          <ul className="malla-list">
            {malla.map((m) => (
              <li key={m.id_malla_curricular} className="malla-item">
                <span className="carrera-nombre">
                  {carreras.find((c) => c.id_carrera == m.cod_carrera)?.nombre}
                </span>
                <a
                  href={getPublicUrl(m.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="malla-link"
                >
                  Ver malla curricular
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
