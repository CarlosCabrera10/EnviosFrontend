import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import SolicitarEnvio from "./pages/SolicitarEnvio";
import Tracking from "./pages/Tracking";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/solicitar-envio" element={
          <PrivateRoute rol="CLIENTE">
            <SolicitarEnvio />
          </PrivateRoute>
        } />
        <Route path="/tracking" element={
          <PrivateRoute rol="CLIENTE">
            <Tracking />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute rol="ADMIN">
            <Admin />
          </PrivateRoute>
        } />
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;