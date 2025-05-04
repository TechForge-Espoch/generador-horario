// import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  NavLink,
  // useNavigate,
  useLocation,
  // Outlet,
} from "react-router-dom";
import Generar from "./generar/Generar";
import Malla from "./malla/Malla";
import IngresoMalla from "./malla/IngresoMalla";
import ListarMallas from "./malla/ListarMallas";
import IngresarFacultad from "./facultad/IngresarFacultad";
import Facultad from "./facultad/Facultad";
import ListarFacultades from "./facultad/ListarFacultades";
import Carrera from "./carrera/Carrera";
import ListarCarreras from "./carrera/ListarCarreras";
import Materia from "./materia/Materia";
import ListarMaterias from "./materia/ListarMaterias";
import Horario from "./horario/Horario";
import IngresoHorario from "./horario/IngresoHorario";
import IngresarCarrera from "./carrera/IngresarCarrera";
import ListarHorarios from "./horario/ListarHorarios";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Menu />
      </div>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/*" element={<Plantilla />}> */}
        <Route path="malla/*" element={<Malla />} />
        <Route path="malla/ingreso/" element={<IngresoMalla />} />
        <Route path="malla/listar/" element={<ListarMallas />} />
        <Route path="facultad/" element={<Facultad />} />
        <Route path="facultad/ingreso/" element={<IngresarFacultad />} />
        <Route path="facultad/listar/" element={<ListarFacultades />} />
        <Route path="carrera/" element={<Carrera />} />
        <Route path="carrera/listar/" element={<ListarCarreras />} />
        <Route path="carrera/ingreso/" element={<IngresarCarrera />} />
        <Route path="materia/" element={<Materia />} />
        <Route path="materia/listar/" element={<ListarMaterias />} />
        <Route path="horario/*" element={<Horario />} />
        <Route path="horario/ingreso/" element={<IngresoHorario />} />
        <Route path="horario/listar/" element={<ListarHorarios />} />
        <Route path="/horarios/:horarioId" element={<ListarHorarios />} />
        <Route path="generar/*" element={<Generar />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

function Menu() {
  const url = useLocation();

  function seleccionado(nombre: string) {
    if (nombre.length == 0) return url.pathname == "/" ? "selected" : "";

    return url.pathname.includes(nombre) ? "selected" : "";
  }

  return (
    <nav className="menu">
      <ul>
        <li>
          <NavLink to="/" className={seleccionado("")}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/malla" className={seleccionado("malla")}>
            Malla curricular
          </NavLink>
        </li>
        <li>
          <NavLink to="/facultad" className={seleccionado("facultad")}>
            Facultades
          </NavLink>
        </li>
        <li>
          <NavLink to="/carrera" className={seleccionado("carrera")}>
            Carreras
          </NavLink>
        </li>
        <li>
          <NavLink to="/materia" className={seleccionado("materia")}>
            Materias
          </NavLink>
        </li>
        <li>
          <NavLink to="/horario" className={seleccionado("horario")}>
            Horario
          </NavLink>
        </li>
        <li>
          <NavLink to="/generar" className={seleccionado("generar")}>
            Generar horario
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function Home() {
  return (
    <div className="container">
      <h2 className="title">Pagina de inicio</h2>
    </div>
  );
}
