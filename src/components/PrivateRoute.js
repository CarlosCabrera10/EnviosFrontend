import { Navigate } from "react-router-dom";

function PrivateRoute({ children, rol }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return <Navigate to="/login" />;
  if (rol && usuario.rol !== rol) return <Navigate to="/login" />;
  return children;
}

export default PrivateRoute;