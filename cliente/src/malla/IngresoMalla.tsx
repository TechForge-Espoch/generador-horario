import React, { useState } from "react";
import supabase from "../supabase";
// import "./styles.css";

export default function IngresoMalla() {
  const [file, setFile] = useState<File | null>(null);
  const [anioAprobacion, setAnioAprobacion] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !anioAprobacion) {
      setError("Debe completar todos los campos.");
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("anio_aprobacion", anioAprobacion.toString());

    try {
      const { data, error } = await supabase.functions.invoke("malla", {
        body: formData,
      });

      if (error) {
        setError("Error al procesar la malla.");
        console.error("Error al invocar la función:", error.message);
      } else {
        console.log("Respuesta de la función:", data);
        alert("Malla subida exitosamente.");
        setFile(null);
        setAnioAprobacion("");
      }
    } catch (e) {
      console.error("Error inesperado:", e);
      setError("Error inesperado. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Solo se permiten archivos PDF.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnioAprobacionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const anio = e.target.value;
    if (!/^\d{4}$/.test(anio)) {
      setError("Ingrese un año válido.");
      return;
    }
    setAnioAprobacion(Number(anio));
    setError(null);
  };

  return (
    <div className="container">
      <h1 className="title">Ingreso de Malla</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="anio_aprobacion">Año de aprobación de la malla:</label>
        <input
          type="number"
          name="anio_aprobacion"
          placeholder="2021"
          // value={anioAprobacion}
          onChange={handleAnioAprobacionChange}
          // disabled={loading}
          required
        />

        <label htmlFor="malla">Malla curricular:</label>
        <input
          type="file"
          name="malla"
          required
          disabled={loading}
          onChange={handleFileChange}
          accept="application/pdf"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Enviar y procesar"}
        </button>
      </form>
    </div>
  );
}
