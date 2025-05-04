import React from "react";

export default function Generar() {
  return (
    <div className="container">
      <h1 className="title">Generar</h1>
      <form className="form-container">
        <label htmlFor="cod_facultad">Facultad</label>
        <select name="cod_facultad" id="cod_facultad">
          <option value="">Seleccione una opcion</option>
          <option value="1">FIE</option>
        </select>
        <br />
        <label htmlFor="cod_carrera">Carrera</label>
        <select name="cod_carrera" id="cod_carrera">
          <option value="">Seleccione una opcion</option>
          <option value="1">Software</option>
          <option value="1">Telematica</option>
          <option value="1">Tecnologias de la informacion</option>
        </select>
        <br />

        <label htmlFor="ultimo_pao">PAO mas alto cursado</label>
        <select name="pao" id="pao">
          <option value="">Seleccione una opcion</option>
          <option value="1">PAO 1</option>
        </select>
        <fieldset>
          <legend>PAO 1</legend>
          {[
            "Investigación formativa",
            "Matemáticas",
            "Física I",
            "Cálculo I",
            "Educación física",
          ].map((materia, index) => (
            <div key={index} className="materia-container">
              <h3>{materia}</h3>

              <div className="radio-label">
                {[
                  "Aprobado",
                  "Reprobado 1era matrícula",
                  "Reprobado 2da matrícula",
                  "Todavía no cursó",
                ].map((estado, idx) => {
                  const id = `pao1_mat${index}_${idx}`; // Generamos un ID único para cada input
                  return (
                    <div key={id} className="radio-option">
                      <input
                        type="radio"
                        id={id}
                        name={`pao1_mat${index}`}
                        value={estado.toLowerCase()}
                      />
                      <label htmlFor={id}> {estado}</label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </fieldset>

        <input
          type="submit"
          name="submit"
          value="Generar horario"
          className="submit-button"
        />
      </form>
    </div>
  );
}
