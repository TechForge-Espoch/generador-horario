import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import { Tables } from "../../database.types";

// Consulta a Supabase
async function getFacultades() {
  return supabase
    .from("facultad")
    .select("id_facultad, nombre, nombre_siglas, created_at");
}

export default function ListarFacultades() {
  const [facultades, setFacultades] = useState<Tables<"facultad">[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: facultades, error } = await getFacultades();
      if (error) {
        console.log("Error al obtener facultades:", error);
      } else {
        setFacultades(facultades);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Listado de Facultades</h1>
      <nav>
        <ul className="facultad-list">
          {facultades.map((f) => (
            <li key={f.id_facultad} className="facultad-item">
              {f.nombre} {f.nombre_siglas ? `(${f.nombre_siglas})` : ""}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
