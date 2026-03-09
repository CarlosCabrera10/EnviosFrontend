import { useState, useEffect } from "react";
import api from "../services/Api";

function Tracking() {
  const [codigo, setCodigo] = useState("");
  const [envio, setEnvio] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [consultando, setConsultando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  // Cargar historial al iniciar
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario && usuario.id) {
          const response = await api.get(`/envios/historial/${usuario.id}`);
          setHistorial(response.data);
        }
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setCargandoHistorial(false);
      }
    };
    cargarHistorial();
  }, []);

  const consultar = async () => {
    if (!codigo.trim()) return;
    setConsultando(true);
    setMensaje(null);
    setEnvio(null);
    try {
      const response = await api.get(`/envios/${codigo}`);
      setEnvio(response.data);
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Código no encontrado. Verifica e intenta de nuevo." });
    } finally {
      setConsultando(false);
    }
  };

  const cancelar = async () => {
    setCancelando(true);
    try {
      await api.put(`/envios/cancelar/${codigo}`);
      setEnvio({ ...envio, estado: "CANCELADO" });
      setMensaje({ tipo: "success", texto: "Envío cancelado correctamente." });
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "No se puede cancelar este envío." });
    } finally {
      setCancelando(false);
    }
  };

  const estadoBadge = (estado) => {
    const map = {
      AGENDADO:    { bg: "bg-primary",  icon: "bi-clock",             label: "Agendado"    },
      EN_CAMINO:   { bg: "bg-warning",  icon: "bi-truck",             label: "En camino"   },
      ENTREGADO:   { bg: "bg-success",  icon: "bi-check-circle-fill", label: "Entregado"   },
      RECIBIDO:    { bg: "bg-success",  icon: "bi-check-circle-fill", label: "Recibido"    },
      CANCELADO:   { bg: "bg-danger",   icon: "bi-x-circle-fill",     label: "Cancelado"   },
    };
    const cfg = map[estado] || { bg: "bg-secondary", icon: "bi-question-circle", label: estado };
    return (
      <span className={`badge ${cfg.bg} d-inline-flex align-items-center gap-1 px-3 py-2`}>
        <i className={`bi ${cfg.icon}`}></i> {cfg.label}
      </span>
    );
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "480px" }}>
        <div className="card-body p-4">

          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "56px", height: "56px" }}
            >
              <i className="bi bi-search text-white fs-4"></i>
            </div>
            <h4 className="fw-bold mb-0">Tracking de Envío</h4>
            <p className="text-muted small">Consulta el estado de tu paquete</p>
          </div>

          {/* Buscador */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white">
              <i className="bi bi-upc-scan text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Ingresa tu código de envío"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && consultar()}
            />
            <button
              className="btn btn-info text-white fw-semibold"
              onClick={consultar}
              disabled={consultando || !codigo.trim()}
            >
              {consultando ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <><i className="bi bi-search me-1"></i>Consultar</>
              )}
            </button>
          </div>

          {/* Alerta de mensaje */}
          {mensaje && (
            <div className={`alert ${mensaje.tipo === "error" ? "alert-danger" : "alert-success"} d-flex align-items-center gap-2 py-2`} role="alert">
              <i className={`bi ${mensaje.tipo === "error" ? "bi-exclamation-circle-fill" : "bi-check-circle-fill"}`}></i>
              <span className="small">{mensaje.texto}</span>
            </div>
          )}

          {/* Tarjeta de resultado */}
          {envio && (
            <div className="border rounded-3 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold font-monospace fs-6">{envio.codigo}</span>
                {estadoBadge(envio.estado)}
              </div>

              <hr className="my-2" />

              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between small">
                  <span className="text-muted d-flex align-items-center gap-1">
                    <i className="bi bi-calendar-event"></i> Fecha de envío
                  </span>
                  <span className="fw-semibold">{envio.fechaEnvio}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted d-flex align-items-center gap-1">
                    <i className="bi bi-info-circle"></i> Estado actual
                  </span>
                  <span className="fw-semibold">{envio.estado}</span>
                </div>
              </div>

              {envio.estado === "AGENDADO" && (
                <>
                  <hr className="my-3" />
                  <button
                    className="btn btn-outline-danger w-100 py-2 fw-semibold"
                    onClick={cancelar}
                    disabled={cancelando}
                  >
                    {cancelando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Cancelando...
                      </>
                    ) : (
                      <><i className="bi bi-x-circle me-2"></i>Cancelar envío</>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Botón para mostrar/ocultar historial */}
          <div className="text-center mt-4">
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
            >
              {mostrarHistorial ? (
                <><i className="bi bi-chevron-up me-1"></i>Ocultar historial</>
              ) : (
                <><i className="bi bi-chevron-down me-1"></i>Ver mi historial de pedidos</>
              )}
            </button>
          </div>

          {/* Historial de envíos */}
          {mostrarHistorial && (
            <div className="mt-3">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-clock-history me-2"></i>
                Historial de pedidos
              </h6>
              {cargandoHistorial ? (
                <div className="text-center py-3">
                  <span className="spinner-border spinner-border-sm text-info"></span>
                  <p className="text-muted small mt-2">Cargando historial...</p>
                </div>
              ) : historial.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                  <p className="small mb-0">No tienes pedidos registrados</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead className="table-light">
                      <tr>
                        <th className="small">Código</th>
                        <th className="small">Fecha</th>
                        <th className="small">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((item) => (
                        <tr key={item.codigo} style={{ cursor: 'pointer' }} onClick={() => { setCodigo(item.codigo); consultar(); }}>
                          <td className="small fw-semibold">{item.codigo}</td>
                          <td className="small">{item.fechaEnvio}</td>
                          <td>{estadoBadge(item.estado)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Tracking;