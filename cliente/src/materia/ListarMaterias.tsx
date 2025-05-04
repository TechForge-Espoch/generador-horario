import React, { useEffect, useState } from "react";
import supabase from "../supabase";

// Obtener facultades
async function getFacultades() {
  return supabase.from("facultad").select("*");
}

// Obtener carreras por facultad
async function getCarreras(codFacultad: string) {
  return supabase.from("carrera").select("*").eq("cod_facultad", codFacultad);
}

// Obtener materias por carrera
async function getMaterias(codCarrera: string) {
  return supabase
    .from("materia")
    .select("id_materia, nombre, codigo, cod_carrera")
    .eq("cod_carrera", codCarrera);
}

export default function ListarMaterias() {
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [codFacultadSeleccionada, setCodFacultadSeleccionada] = useState("");
  const [codCarreraSeleccionada, setCodCarreraSeleccionada] = useState("");

  useEffect(() => {
    async function fetchFacultades() {
      const { data, error } = await getFacultades();
      if (error) console.error("Error al obtener facultades:", error);
      else setFacultades(data || []);
    }
    fetchFacultades();
  }, []);

  useEffect(() => {
    async function fetchCarreras() {
      if (!codFacultadSeleccionada) return;
      const { data, error } = await getCarreras(codFacultadSeleccionada);
      if (error) console.error("Error al obtener carreras:", error);
      else setCarreras(data || []);
    }
    fetchCarreras();
  }, [codFacultadSeleccionada]);

  useEffect(() => {
    async function fetchMaterias() {
      if (!codCarreraSeleccionada) return;
      const { data, error } = await getMaterias(codCarreraSeleccionada);
      if (error) console.error("Error al obtener materias:", error);
      else setMaterias(data || []);
    }
    fetchMaterias();
  }, [codCarreraSeleccionada]);

  return (
    <div className="container">
      <h1 className="title">Listado de Materias</h1>

      {/* Selección de Facultad */}
      <label>Facultad</label>
      <select
        value={codFacultadSeleccionada}
        onChange={(e) => {
          setCodFacultadSeleccionada(e.target.value);
          setCodCarreraSeleccionada(""); // Resetear carrera al cambiar facultad
          setMaterias([]); // Limpiar materias
        }}
      >
        <option value="">Seleccione una facultad</option>
        {facultades.map((f) => (
          <option key={f.id_facultad} value={f.id_facultad}>
            {f.nombre}
          </option>
        ))}
      </select>

      {/* Selección de Carrera */}
      {codFacultadSeleccionada && (
        <>
          <label>Carrera</label>
          <select
            value={codCarreraSeleccionada}
            onChange={(e) => setCodCarreraSeleccionada(e.target.value)}
          >
            <option value="">Seleccione una carrera</option>
            {carreras.map((c) => (
              <option key={c.id_carrera} value={c.id_carrera}>
                {c.nombre}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Listado de Materias */}
      {codCarreraSeleccionada && (
        <div className="materia-container">
          <h2>Materias de la carrera seleccionada</h2>
          {materias.length > 0 ? (
            <ul>
              {materias.map((m) => (
                <li key={m.id_materia}>
                  {m.nombre} <span className="codigo">({m.codigo})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay materias disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
}
