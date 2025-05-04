import React from "react";
import { NavLink } from "react-router-dom";

export default function Horario() {
  return (
    <div className="container">
      <h1 className="title">Horarios</h1>
      <nav className="menu2">
        <ul>
          <li>
            <NavLink to="ingreso/" className="menu-button">
              Ingresar nuevo horario
            </NavLink>
          </li>
          <li>
            <NavLink to="listar/" className="menu-button">
              Listar las horarios
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
