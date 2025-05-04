import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import { Tables } from "../../database.types";

async function getFacultades() {
  const res = await supabase.from("facultad").select("*");

  return res;
}

async function insertCarrera(codigoFacultad: number, nombreCarrera: string) {
  const res = await supabase
    .from("carrera")
    .insert({ cod_facultad: codigoFacultad, nombre: nombreCarrera });

  return res;
}

export default function IngresarCarrera() {
  const [facultades, setFacultades] = useState<Tables<"facultad">[]>([]);
  const [nombre, setNombre] = useState<string>("");
  const [codigoFacultad, setCodigoFacultad] = useState<string>("");

  useEffect(() => {
    const fechData = async () => {
      const res = await getFacultades();
      if (!res.error) setFacultades(res.data);
    };

    fechData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await insertCarrera(+codigoFacultad, nombre);

    setCodigoFacultad("");
    setNombre("");
  };
  return (
    <>
      <h1>Ingreso de carrera</h1>

      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="cod_facultad">Facultad</label>
        <select
          name="cod_facultad"
          id="cod_facultad"
          value={codigoFacultad}
          required
          onChange={(e) => setCodigoFacultad(e.target.value)}
        >
          <option value="">Seleccione una opcion</option>
          {facultades.map((f) => (
            <option key={f.id_facultad} value={f.id_facultad}>
              {f.nombre}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="nombre">Nombre de la carrera</label>
        <input
          type="text"
          name="nombre"
          id="nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Fisica II"
        />
        <br />
        <input type="submit" value="Guardar" />
      </form>
    </>
  );
}
