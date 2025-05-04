import React, { useState } from "react";
import supabase from "../supabase";
async function insertFacultad(nombre: string, nombre_siglas: string) {
  const { data, error } = await supabase
    .from("facultad")
    .insert([{ nombre, nombre_siglas }]);

  if (error) {
    console.error("Error al insertar la facultad:", error.message);
    return { error: error.message };
  }

  return { data };
}

export default function IngresarFacultad() {
  const [nombre, setNombre] = useState<string>("");
  const [siglas, setSiglas] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim() || !siglas.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await insertFacultad(nombre, siglas);

    if (result.error) {
      setError(result.error);
    } else {
      alert("Facultad guardada exitosamente.");
      setNombre("");
      setSiglas("");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Ingreso de Facultad</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="nombre_facultad">Nombre de la facultad</label>
        <input
          type="text"
          id="nombre_facultad"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Informática..."
        />

        <label htmlFor="siglas_nombre">Siglas de la facultad</label>
        <input
          type="text"
          id="siglas_nombre"
          required
          value={siglas}
          onChange={(e) => setSiglas(e.target.value)}
          placeholder="FIE"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
