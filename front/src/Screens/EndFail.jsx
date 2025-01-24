import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EndFail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { aciertos, tiempoTranscurrido } = location.state || {
    aciertos: 0,
    tiempoTranscurrido: 0,
  };

  const home = () => {
    navigate("/");
  };

  return (
    <div className="vh-100 d-flex  flex-column justify-content-center align-items-center">
      <h1>No completaste el trivia</h1>
      <p>Aciertos: {aciertos}</p>
      <p>Tiempo transcurrido: {tiempoTranscurrido} segundos</p>
      <button onClick={home} className="btn btn-outline-light d-inline-block">
        Volver al inicio
      </button>
    </div>

  );
}
