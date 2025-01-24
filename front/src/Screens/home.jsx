import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelAdmin from "../components/PanelAdmin";
import "../styles/hallOfFame.css";


export default function Home() {
  const navigate = useNavigate();
  const [serverUp, setServerUp] = useState();
  const [hallOfFameData, setHallOfFameData] = useState([]);



  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/preguntas", 
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonResponse = await response.json();

        // Verifica si la respuesta contiene los datos esperados
        if (jsonResponse.statusCode === 6001) {
          setServerUp(true); 
        } else {
          navigate("/ServerError");  
        }
      } catch (error) {
        console.error("Error checking server status:", error);
        navigate("/ServerError"); 
      }
    };

    checkServerStatus(); 
  }, [navigate]);



  useEffect(() => {
    const fetchHallOfFame = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/hall_of_fame");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setHallOfFameData(data.response);
      } catch (error) {
        console.error("Error fetching Hall of Fame data:", error);
      }
    };

    fetchHallOfFame();
  }, []);


  const handleClick = () => {
    navigate("/game");
  };

  //
  return (
    <div className="container my-3 vh-100 d-flex flex-column  align-items-center ">
      {serverUp ? (
        <>
          <div className="d-inline-flex">
            <button
              type="button"
              className="btn btn-outline-light "
              onClick={handleClick}
            >
              Iniciar juego
            </button>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <h4 className="text-light">Top 10</h4>
              <table className="top-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Puntaje</th>
                    <th>Tiempo (segundos)</th>
                  </tr>
                </thead>
                <tbody>
                  {hallOfFameData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.UserName}</td>
                      <td>{item.Puntaje}</td>
                      <td>{item.TiempoEnSegundos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
          <div
            className="row d-flex align-content-center "
            style={{  width: "60vw" }}
            >
            <div className="col-12 mt-5 ">
              <h4>Administrar trivia </h4>
              <PanelAdmin />
            </div>
          </div>
        </>
      ) : (
        <h4> </h4>
      )}
    </div>
  );
}
