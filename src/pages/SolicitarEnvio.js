import { useState, useEffect } from "react";
import api from "../services/Api";

function SolicitarEnvio() {
  const [mensaje, setMensaje] = useState(null);
  const [disponible, setDisponible] = useState(true);
  const [verificando, setVerificando] = useState(true);
  const [solicitando, setSolicitando] = useState(false);

  useEffect(() => {
    const verificarDisponibilidad = async () => {
      try {
        const response = await api.get("/envios/capacidad-actual");
        setDisponible(response.data === "disponible");
      } catch (error) {
        console.error(error);
        setDisponible(false);
      } finally {
        setVerificando(false);
      }
    };

    verificarDisponibilidad();
    const intervalo = setInterval(verificarDisponibilidad, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const solicitar = async () => {
    setSolicitando(true);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    try {
      const response = await api.post("/envios/solicitar", usuario);
      setMensaje({ codigo: response.data.codigo, fecha: response.data.fechaEnvio });
      setDisponible(false);
    } catch (error) {
      console.error(error);
      alert("Error al solicitar envío");
    } finally {
      setSolicitando(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "460px" }}>
        <div className="card-body p-4">

          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "56px", height: "56px" }}
            >
              <i className="bi bi-truck text-white fs-4"></i>
            </div>
            <h4 className="fw-bold mb-0">Solicitar Envío</h4>
            <p className="text-muted small">Verifica la disponibilidad y agenda tu envío</p>
          </div>

          {/* Estado de disponibilidad */}
          <div className={`rounded-3 p-3 mb-4 d-flex align-items-center gap-2 ${
            verificando ? "bg-secondary bg-opacity-10" :
            disponible  ? "bg-success bg-opacity-10" : "bg-danger bg-opacity-10"
          }`}>
            {verificando ? (
              <>
                <span className="spinner-border spinner-border-sm text-secondary"></span>
                <span className="small text-secondary fw-semibold">Verificando disponibilidad...</span>
              </>
            ) : disponible ? (
              <>
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <div>
                  <p className="mb-0 small fw-semibold text-success">Espacios disponibles</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                    Puedes solicitar tu envío hoy
                  </p>
                </div>
                <span className="ms-auto badge bg-success">Disponible</span>
              </>
            ) : (
              <>
                <i className="bi bi-x-circle-fill text-danger fs-5"></i>
                <div>
                  <p className="mb-0 small fw-semibold text-danger">Capacidad diaria llena</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                    Intenta nuevamente mañana
                  </p>
                </div>
                <span className="ms-auto badge bg-danger">No disponible</span>
              </>
            )}
          </div>

          {/* Resultado del envío */}
          {mensaje && (
            <div className="alert alert-success mb-4" role="alert">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-box-seam-fill me-2 fs-5"></i>
                <span className="fw-semibold">¡Envío confirmado!</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Código:</span>
                <span className="fw-bold font-monospace">{mensaje.codigo}</span>
              </div>
              <div className="d-flex justify-content-between small mt-1">
                <span className="text-muted">Fecha de envío:</span>
                <span className="fw-semibold">{mensaje.fecha}</span>
              </div>
            </div>
          )}

          {/* Botón */}
          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            onClick={solicitar}
            disabled={!disponible || solicitando || verificando}
          >
            {solicitando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Procesando solicitud...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Solicitar Envío
              </>
            )}
          </button>


        </div>
      </div>
    </div>
  );
}

export default SolicitarEnvio;