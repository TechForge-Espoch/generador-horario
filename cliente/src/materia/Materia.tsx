import React from "react";
import { NavLink } from "react-router-dom";

export default function Materia() {
  return (
    <div className="container">
      <h1 className="title">Materias</h1>
      <nav className="menu2">
        <ul>
          <li>
            <NavLink to="ingreso/" className="menu-button">
              Ingreso de materia
            </NavLink>
          </li>
          <li>
            <NavLink to="listar/" className="menu-button">
              Listar las materias
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
