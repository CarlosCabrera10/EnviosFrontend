import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (!usuario) return null;

  return (
    <nav className="navbar navbar-expand-md navbar-dark" style={{ backgroundColor: "#1f363d" }}>
      <div className="container-fluid px-4">

        {/* Brand */}
        <span className="navbar-brand d-flex align-items-center gap-2 fw-bold">
          <i className="bi bi-truck fs-5"></i>
          EnviosApp
        </span>

        {/* Toggler mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* Links centro */}
          <ul className="navbar-nav me-auto mb-2 mb-md-0 ms-3">
            {usuario.rol === "CLIENTE" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-1" to="/solicitar-envio">
                    <i className="bi bi-send"></i> Solicitar Envío
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-1" to="/tracking">
                    <i className="bi bi-search"></i> Tracking
                  </Link>
                </li>
              </>
            )}
            {usuario.rol === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-1" to="/admin">
                  <i className="bi bi-gear-fill"></i> Administración
                </Link>
              </li>
            )}
          </ul>

          {/* Usuario + logout */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}
              >
                <i className="bi bi-person-fill text-white small"></i>
              </div>
              <div className="lh-1">
                <p className="mb-0 text-white small fw-semibold">{usuario.nombre}</p>
                <p className="mb-0 text-white-50" style={{ fontSize: "0.7rem" }}>
                  {usuario.rol === "ADMIN" ? "Administrador" : "Cliente"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Salir</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;