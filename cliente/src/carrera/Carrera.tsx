import React from "react";
import { NavLink } from "react-router-dom";

export default function Carrera() {
  return (
    <div className="container">
      <h1 className="title">Carreras</h1>
      <nav className="menu2">
        <ul>
          <li>
            <NavLink to="ingreso/" className="menu-button">
              Ingresar nueva carrera
            </NavLink>
          </li>
          <li>
            <NavLink to="listar/" className="menu-button">
              Listar las carreras
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
