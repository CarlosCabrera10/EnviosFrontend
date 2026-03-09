import React, { useState, useEffect } from "react";
import api from "../services/Api";

function Admin() {
  const [capacidad, setCapacidad] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [envios, setEnvios] = useState([]);
  const [loadingEnvios, setLoadingEnvios] = useState(true);
  const [codigoActualizar, setCodigoActualizar] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [errorActualizar, setErrorActualizar] = useState("");

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const response = await api.get("/admin/config", { withCredentials: true });
        setCapacidad(response.data.capacidadDiaria);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarConfig();
  }, []);

  useEffect(() => {
    const cargarEnvios = async () => {
      try {
        const response = await api.get("/admin/envios", { withCredentials: true });
        setEnvios(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingEnvios(false);
      }
    };
    cargarEnvios();
  }, []);

  const actualizar = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await api.put("/admin/config", { capacidadDiaria: capacidad }, { withCredentials: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar capacidad");
    } finally {
      setSaving(false);
    }
  };

  const actualizarEstado = async (e) => {
    e.preventDefault();
    setErrorActualizar("");
    try {
      // Primero verificamos el estado actual del envío
      const response = await api.get(`/envios/${codigoActualizar}`, { withCredentials: true });
      const envioActual = response.data;
      
      if (envioActual.estado === "RECIBIDO" || envioActual.estado === "CANCELADO") {
        setErrorActualizar(`No se puede actualizar. El estado actual es: ${envioActual.estado}`);
        return;
      }
      
      // Enviar como JSON con la estructura del DTO
      await api.put(`/admin/estado/${codigoActualizar}`, { estado: nuevoEstado });
      alert("Estado actualizado correctamente");
      setCodigoActualizar("");
      setNuevoEstado("");
      
      // Recargar la lista de envíos
      const enviosResponse = await api.get("/admin/envios", { withCredentials: true });
      setEnvios(enviosResponse.data);
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Response:", error.response);
      if (error.response && error.response.data) {
        const msg = error.response.data.message || error.response.data;
        setErrorActualizar(typeof msg === 'object' ? JSON.stringify(msg) : msg);
      } else if (error.request) {
        setErrorActualizar("No se pudo conectar al servidor. Verifica que el backend esté corriendo.");
      } else {
        setErrorActualizar("Error al actualizar estado: " + error.message);
      }
    }
  };

  const getBadgeColor = (estado) => {
    switch(estado) {
      case "AGENDADO": return "bg-primary";
      case "EN_TRASLADO": return "bg-info";
      case "ENTREGADO": return "bg-success";
      case "RECIBIDO": return "bg-success";
      case "CANCELADO": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "460px" }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div
              className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "56px", height: "56px" }}
            >
              <i className="bi bi-gear-fill text-white fs-4"></i>
            </div>
            <h4 className="fw-bold mb-0">Panel de Administración</h4>
            <p className="text-muted small">Configura los parámetros del sistema</p>
          </div>

          {success && (
            <div className="alert alert-success d-flex align-items-center py-2 mb-3" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <span className="small">Capacidad actualizada correctamente</span>
            </div>
          )}

          <div className="bg-light rounded-3 p-3 mb-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-truck me-1 text-warning"></i>
              Capacidad diaria de envíos
            </label>
            <p className="text-muted small mb-2">
              Número máximo de envíos que se pueden procesar por día.
            </p>

            {loading ? (
              <div className="d-flex align-items-center gap-2 text-muted">
                <span className="spinner-border spinner-border-sm"></span>
                <span className="small">Cargando configuración...</span>
              </div>
            ) : (
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-123 text-muted"></i>
                </span>
                <input
                  type="number"
                  className="form-control border-start-0"
                  value={capacidad}
                  min={1}
                  onChange={(e) => setCapacidad(e.target.value)}
                />
                <span className="input-group-text bg-white text-muted small">envíos/día</span>
              </div>
            )}
          </div>

          <button
            className="btn btn-warning w-100 py-2 fw-semibold text-white"
            onClick={actualizar}
            disabled={loading || saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-floppy me-2"></i>
                Guardar cambios
              </>
            )}
          </button>

        </div>
      </div>

      {/* Sección de Gestión de Envíos */}
      <div className="card shadow-sm mt-4" style={{ width: "100%", maxWidth: "800px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div
              className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "56px", height: "56px" }}
            >
              <i className="bi bi-box-seam-fill text-white fs-4"></i>
            </div>
            <h4 className="fw-bold mb-0">Gestión de Envíos</h4>
            <p className="text-muted small">Actualiza el estado de los paquetes</p>
          </div>

          {/* Formulario para actualizar estado */}
          <form onSubmit={actualizarEstado} className="bg-light rounded-3 p-3 mb-4">
            <div className="row align-items-end">
              <div className="col-md-5">
                <label className="form-label fw-semibold small">
                  <i className="bi bi-upc me-1"></i>
                  Código del envío
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: ENV-12345678"
                  value={codigoActualizar}
                  onChange={(e) => setCodigoActualizar(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">
                  <i className="bi bi-arrow-repeat me-1"></i>
                  Nuevo estado
                </label>
                <select
                  className="form-select"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  required
                >
                  <option value="">Seleccionar estado</option>
                  <option value="EN_CAMINO">En Camino</option>
                  <option value="RECIBIDO">Recibido</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-check-circle me-1"></i>
                  Actualizar
                </button>
              </div>
            </div>
            {errorActualizar && (
              <div className="alert alert-danger mt-2 py-2 small" role="alert">
                {errorActualizar}
              </div>
            )}
            <p className="text-muted small mt-2 mb-0">
              <i className="bi bi-info-circle me-1"></i>
              No se puede actualizar si el estado actual es "Recibido" o "Cancelado"
            </p>
          </form>

          {/* Lista de envíos */}
          <h5 className="fw-bold mb-3">
            <i className="bi bi-list-ul me-2"></i>
            Lista de Envíos
          </h5>
          {loadingEnvios ? (
            <div className="d-flex align-items-center gap-2 text-muted">
              <span className="spinner-border spinner-border-sm"></span>
              <span>Cargando envíos...</span>
            </div>
          ) : envios.length === 0 ? (
            <p className="text-muted">No hay envíos registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {envios.map((envio) => (
                    <tr key={envio.codigo}>
                      <td className="fw-semibold">{envio.codigo}</td>
                      <td>
                        <span className={`badge ${getBadgeColor(envio.estado)}`}>
                          {envio.estado}
                        </span>
                      </td>
                      <td>{envio.fechaEnvio}</td>
                      <td>{envio.usuario?.nombre || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;