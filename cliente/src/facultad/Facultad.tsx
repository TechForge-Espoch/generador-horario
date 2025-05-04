import React from "react";
import { NavLink } from "react-router-dom";

export default function Facultad() {
  return (
    <div className="container">
      <h1 className="title">Facultades</h1>
      <nav className="menu2">
        <ul>
          <li>
            <NavLink to="ingreso/" className="menu-button">
              Ingresar nueva facultad
            </NavLink>
          </li>
          <li>
            <NavLink to="listar/" className="menu-button">
              Listar las facultades
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
