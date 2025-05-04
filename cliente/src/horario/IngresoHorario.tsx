import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import { Tables } from "../../database.types";
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
  return supabase.from("materia").select("*").eq("cod_carrera", codCarrera);
}

export default function IngresoHorario() {
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [pao, setPao] = useState("");
  const [anioInicio, setAnioInicio] = useState("");
  const [anioFin, setAnioFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [codFacultadSeleccionada, setCodFacultadSeleccionada] = useState("");
  const [codCarreraSeleccionada, setCodCarreraSeleccionada] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await getFacultades();
      if (error) console.error("Error al obtener facultades:", error);
      else setFacultades(data || []);
    }

    fetchData();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("El archivo es obligatorio");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    if (codCarreraSeleccionada !== "")
      formData.append("cod_carrera", String(codCarreraSeleccionada));
    if (pao !== "") formData.append("pao", String(pao));
    if (anioInicio !== "") formData.append("anio_inicio", String(anioInicio));
    if (anioFin !== "") formData.append("anio_fin", String(anioFin));

    try {
      const { data, error } = await supabase.functions.invoke("horario", {
        body: formData,
      });

      const idHorario = data?.id_horario;

      if (error) {
        console.error("Error al invocar la función:", error);
        setError("Hubo un problema al subir el horario.");
      } else {
        console.log("Horario subido correctamente:", data);
        // alert("Horario subido exitosamente.");
        // /horarios/:facultadId?/:carreraId?/:pao?/:paralelo?
        navigate(`/horarios/${idHorario}`);
        setFile(null);
        setPao("");
        setAnioInicio("");
        setAnioFin("");
      }
    } catch (e) {
      console.error("Error inesperado:", e);
      setError("Ocurrió un error inesperado. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Ingreso de Horario</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>Facultad</label>
        <select
          value={codFacultadSeleccionada}
          onChange={(e) => setCodFacultadSeleccionada(e.target.value)}
        >
          <option value="">Seleccione una opción</option>
          {facultades.map((f) => (
            <option key={f.id_facultad} value={f.id_facultad}>
              {f.nombre}
            </option>
          ))}
        </select>

        <label>Carrera</label>
        <select
          value={codCarreraSeleccionada}
          onChange={(e) => setCodCarreraSeleccionada(e.target.value)}
        >
          <option value="">Seleccione una opción</option>
          {carreras.map((c) => (
            <option key={c.id_carrera} value={c.id_carrera}>
              {c.nombre}
            </option>
          ))}
        </select>
        <label>Año inicio del período</label>
        <input
          type="number"
          value={anioInicio}
          onChange={(e) => setAnioInicio(e.target.value)}
          placeholder="2024"
        />

        <label>Año fin del período</label>
        <input
          type="number"
          value={anioFin}
          onChange={(e) => setAnioFin(e.target.value)}
          placeholder="2025"
        />

        <label>Imagen del horario</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept="image/*"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Enviar y procesar"}
        </button>
      </form>
    </div>
  );
}
