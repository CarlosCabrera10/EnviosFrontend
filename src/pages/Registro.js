import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [sexo, setSexo] = useState("M");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", { nombre, correo, password, sexo, telefono });
      alert("Usuario registrado correctamente, ahora inicia sesión");
      navigate("/login");
    } catch (error) {
      alert("Error al registrar: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "440px" }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div
              className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "56px", height: "56px" }}
            >
              <i className="bi bi-person-plus-fill text-white fs-4"></i>
            </div>
            <h4 className="fw-bold mb-0">Crear cuenta</h4>
            <p className="text-muted small">Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleRegistro}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre completo</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <label className="form-label fw-semibold">Sexo</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-gender-ambiguous text-muted"></i>
                  </span>
                  <select
                    className="form-select border-start-0"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-telephone text-muted"></i>
                  </span>
                  <input
                    type="tel"
                    className="form-control border-start-0"
                    placeholder="0000-0000"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Registrando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>

            <p className="text-center text-muted small mt-3 mb-0">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-success fw-semibold text-decoration-none">
                Inicia sesión
              </a>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Registro;