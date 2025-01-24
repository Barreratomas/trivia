import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/juego.css";
import Modal from "../components/ModalGame";

export default function Game() {
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState();
  const [indice, Setindice] = useState(0);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);

  const [aciertos, setAciertos] = useState(0);
  const [user, setUser] = useState("");

  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0); 
  const [timerActive, setTimerActive] = useState(false); 

  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/preguntas", {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const JsonResponse = await response.json();

        if (JsonResponse.statusCode === 6001) {
          setPreguntas(JsonResponse.consulta);
          console.log(JsonResponse.consulta);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log("Error fetching data");
        console.log(error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => {
        setTiempoTranscurrido((prev) => prev + 1); 
      }, 1000);
    }

    return () => clearInterval(timer); 
  }, [timerActive]);

  const handleScore = async (acierto) => {
    setTimerActive(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/hall_of_fame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: user,
          Puntaje: acierto,
          TiempoTranscurrido: tiempoTranscurrido,
        }),
      });
      if (response.ok) {
      } else {
        console.error("Error al guardar el puntaje:", response.statusText);
      }
    } catch (error) {}
  };

  const handleClick = (seleccion) => {
    if (seleccion.valor) {
      if (!opcionesSeleccionadas.includes(seleccion.id)) {
        const nuevasOpcionesSeleccionadas = [
          ...opcionesSeleccionadas,
          seleccion.id,
        ];

        setOpcionesSeleccionadas(nuevasOpcionesSeleccionadas);

        const totalOpcionesCorrectas = preguntas[indice].opciones_correctas;

        if (nuevasOpcionesSeleccionadas.length === totalOpcionesCorrectas) {
    

          Setindice((prevIndice) => prevIndice + 1);
          setAciertos((prevAciertos) => prevAciertos + 1);
          setOpcionesSeleccionadas([]);


          if (indice + 1 >= preguntas.length) {
            handleScore(aciertos+1); 
            navigate("/EndWin", {
              state: { aciertos: aciertos+1, tiempoTranscurrido },
            }); 
          }
        }
      } else {
        const nuevasOpcionesSeleccionadas = opcionesSeleccionadas.filter(
          (id) => id !== seleccion.id
        );
        setOpcionesSeleccionadas(nuevasOpcionesSeleccionadas);
      }
    } else {
      handleScore(aciertos);

      navigate("/EndFail", { state: { aciertos, tiempoTranscurrido } });
    }
  };

  const handleUserSubmit = (username) => {
    setUser(username);
    setIsModalOpen(false);
    setTimerActive(true); 
  };

  return (
    <div className="container">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUserSubmit}
      />

      <h1>Seleccione las respuestas correctas</h1>
      {preguntas && (
        <>
          <div className="headerPreguntas">
            <h3>
              Pregunta {indice + 1}/{preguntas.length}
            </h3>
          </div>

          <div className="headerPreguntas bodyPreguntas">
            <h2>{preguntas[indice].texto_pregunta}</h2>

            {preguntas[indice].paquete_respuestas.map((respuesta, index) => (
              <button
                onClick={() => handleClick(respuesta)}
                key={index}
                className={`opcion ${
                  opcionesSeleccionadas.includes(respuesta.id)
                    ? "seleccionada"
                    : ""
                }`}
              >
                {respuesta.texto_respuesta}
              </button>
            ))}
          </div>

          <hr />

          <button className="btn-outline-light" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </>
      )}
    </div>
  );
}
