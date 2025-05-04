import React from "react";
import { NavLink } from "react-router-dom";

export default function Malla() {
  return (
    <div className="container">
      <h1 className="title">Malla curricular</h1>
      <nav className="menu2">
        <ul>
          <li>
            <NavLink to="ingreso/" className="menu-button">
              Ingresar nueva malla curricular
            </NavLink>
          </li>
          <li>
            <NavLink to="listar/" className="menu-button">
              Listar las malla curricular
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
