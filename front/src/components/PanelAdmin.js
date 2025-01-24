import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function PanelAdmin() {
  const [error, setError] = useState("");
  const [answerError, setAnswerError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localData, setLocalData] = useState([]);

  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  const inputRef = useRef(null);

  const [isAnswerModalVisible, setIsAnswerModalVisible] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([
    { text: "", isCorrect: false },
  ]);

  // Hook para obtener datos de la API
  const { data } = useSWR(
    `http://127.0.0.1:8000/api/preguntas/admin?page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false, // Desactiva revalidación al cambiar de pestaña
    }
  );

  // Sincronizar datos locales con los datos obtenidos de la API
  useEffect(() => {
    if (data?.consulta) {
      setLocalData(data.consulta);
      setTotalPages(data.pagination.total_pages);
    }
  }, [data]);

  // Crear una nueva pregunta y enviarla a la API
  const handleCreateQuestion = async () => {
    // Validar que la pregunta y todas las respuestas sean válidas
    if (!newQuestion.trim()) {
      setError("El texto de la pregunta es obligatorio.");
      return;
    }

    const allAnswersValid = newAnswers.every(
      (answer) => answer.text.trim() !== ""
    );
    if (!allAnswersValid) {
      setError("Todas las respuestas deben tener texto.");
      return;
    }

    setError("");

    const newQuestionData = {
      texto_pregunta: newQuestion,
      respuestas: newAnswers.map((answer) => ({
        texto_respuesta: answer.text,
        valor: answer.isCorrect ? 1 : 0,
      })),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/preguntas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestionData),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al crear la pregunta:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  // Enviar nueva respuesta al backend
  const handleCreateAnswer = async () => {
    try {
      // Validar que al menos una respuesta sea válida
      const allAnswersValid = newAnswers.every(
        (answer) => answer.text.trim() !== ""
      );
      if (!allAnswersValid) {
        setAnswerError("Todas las respuestas deben tener texto.");
        return;
      }
      setAnswerError("");

      for (const answer of newAnswers) {
        const response = await fetch(
          `http://127.0.0.1:8000/api/respuesta/${selectedQuestionId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texto_respuesta: answer.text,
              valor: answer.isCorrect,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al agregar una respuesta");
        }
      }
      window.location.reload();
      setNewAnswers([{ text: "", isCorrect: false }]);
      setIsAnswerModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al agregar las respuestas");
    }
  };

  // Guardar cambios en el campo editado
  const handleSaveQuestion = async (questionId) => {
    if (!fieldValue.trim()) {
      alert("El texto de la respuesta no puede estar vacío.");
      return;
    }
    try {
      const updatedQuestion = {
        texto_pregunta: fieldValue,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/preguntas/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuestion),
        }
      );

      if (response.ok) {
        setLocalData((prev) =>
          prev.map((item) =>
            item.id === questionId
              ? { ...item, texto_pregunta: fieldValue }
              : item
          )
        );
        setEditingField(null);
      }
    } catch (error) {
      console.error("Error al actualizar la pregunta:", error);
    }
  };

  // Guardar cambios en el campo editado
  const handleSaveAnswer = async (respuestaId) => {
    if (!fieldValue.trim()) {
      alert("El texto de la respuesta no puede estar vacío.");
      return;
    }
    try {
      const updatedRespuesta = {
        texto_respuesta: fieldValue,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/respuestas/${respuestaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRespuesta),
        }
      );

      if (response.ok) {
        setLocalData((prev) =>
          prev.map((item) => ({
            ...item,
            respuestas: item.respuestas.map((respuesta) =>
              respuesta.id === respuestaId
                ? { ...respuesta, texto_respuesta: fieldValue }
                : respuesta
            ),
          }))
        );
        setEditingField(null);
      }
    } catch (error) {
      console.error("Error al actualizar la respuesta:", error);
    }
  };

  // Manejar eliminación de una pregunta
  const handleDeleteQuestion = async (questionId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/preguntas/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setLocalData((prev) => prev.filter((item) => item.id !== questionId));
      } else {
        console.error("Error al eliminar la pregunta");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  // Manejar eliminación de una respuesta
  const handleDeleteAnswer = async (respuestaId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/respuestas/${respuestaId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setLocalData((prev) =>
          prev.map((item) => {
            // console.log(item);
            return {
              ...item,
              respuestas: item.respuestas.filter(
                (respuesta) => respuesta.id !== respuestaId
              ),
            };
          })
        );
      } else {
        console.error("Error al eliminar la respuesta");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  // Función para alternar entre Verdadera/Falsa
  const handleToggleAnswerCorrect = async (respuestaId, newIsCorrect) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/respuestas/${respuestaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            valor: newIsCorrect,
          }),
        }
      );
      if (response.ok) {
        setLocalData((prev) =>
          prev.map((item) => {
            // console.log(item);
            return {
              ...item,
              respuestas: item.respuestas.map((respuesta) => {
                if (respuesta.id === respuestaId) {
                  return { ...respuesta, valor: newIsCorrect };
                }
                return respuesta;
              }),
            };
          })
        );
      } else {
        console.error("Error al actualizar la respuesta");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  // Actualizar el estado del valor del campo en edición
  const handleInputChange = (e) => {
    setFieldValue(e.target.value);
  };

  // Actualizar el estado del valor del campo en edición
  const handleEditQuestionClick = (questionId, currentValue) => {
    setEditingField(questionId);
    setFieldValue(currentValue);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Manejar clic en "Agregar respuesta"
  const handleAddAnswerClick = (id) => {
    setSelectedQuestionId(id);
    setIsAnswerModalVisible(true);
  };

  // Manejar clic en el botón de editar
  const handleEditClick = (respuestaId, currentValue) => {
    setEditingField(respuestaId);
    setFieldValue(currentValue);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Guardar cambios automáticamente al perder el foco
  const handleBlurAnswer = () => {
    if (editingField) {
      handleSaveAnswer(editingField);
    }
  };

  // Guardar cambios automáticamente al perder el foco
  const handleBlur = () => {
    if (editingField) {
      handleSaveQuestion(editingField);
    }
  };

  // Manejar adición de una nueva respuesta
  const handleAddAnswer = () => {
    setNewAnswers((prevAnswers) => [
      ...prevAnswers,
      { text: "", isCorrect: false },
    ]);
  };

  // Actualizar texto de una respuesta nueva
  const handleAnswerChange = (index, text) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index].text = text;
    setNewAnswers(updatedAnswers);
  };
  const handleCorrectChange = (index) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index].isCorrect = !updatedAnswers[index].isCorrect;
    setNewAnswers(updatedAnswers);
  };

  const handleRemoveAnswer = (index) => {
    setNewAnswers((prevAnswers) => {
      // Filtrar las respuestas, excluyendo la que se quiere eliminar
      const updatedAnswers = prevAnswers.filter((_, i) => i !== index);
      return updatedAnswers.length > 0
        ? updatedAnswers
        : [{ text: "", isCorrect: false }];
    });
  };

  // Actualizar la página
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container">
      <Button variant="primary" onClick={() => setIsModalVisible(true)}>
        Crear nueva pregunta
      </Button>

      {/* Modal para crear una nueva pregunta */}
      <Modal
        show={isModalVisible}
        onHide={() => setIsModalVisible(false)}
        dialogClassName="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}{" "}
          <input
            type="text"
            placeholder="Texto de la pregunta"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="form-control mb-3"
          />
          <h4>Respuestas</h4>
          <br />
          {newAnswers.map((answer, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Respuesta"
                className="form-control me-2"
              />
              <input
                type="checkbox"
                checked={answer.isCorrect}
                onChange={() => handleCorrectChange(index)}
              />
              <label className="ms-2">Correcta</label>
              <Button
                variant="danger"
                onClick={() => handleRemoveAnswer(index)}
                className="ms-2"
                disabled={newAnswers.length === 1}
              >
                <i className="bi bi-trash me-2"></i>
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={handleAddAnswer}
            className="mt-2"
          >
            Agregar respuesta
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalVisible(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateQuestion}>
            Crear pregunta
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear una nueva respuesta */}
      <Modal
        show={isAnswerModalVisible}
        onHide={() => setIsAnswerModalVisible(false)}
        className="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar respuestas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {answerError && (
            <div className="alert alert-danger">{answerError}</div>
          )}
          <h4>Respuestas</h4>
          <br />
          {newAnswers.map((answer, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Texto de la respuesta"
                className="form-control me-2"
              />
              <input
                type="checkbox"
                checked={answer.isCorrect}
                onChange={() => handleCorrectChange(index)}
              />
              <label className="ms-2">Correcta</label>
              <Button
                variant="danger"
                onClick={() => handleRemoveAnswer(index)}
                className="ms-2"
                disabled={newAnswers.length === 1}
              >
                <i className="bi bi-trash me-2"></i>
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={handleAddAnswer}
            className="mt-2"
          >
            Agregar otra respuesta
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsAnswerModalVisible(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateAnswer}>
            Guardar respuestas
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tabla de preguntas */}
      <div className="table-responsive mt-4">
        <table className=" admin-table mt-4 ">
          <thead>
            <tr className="fila">
              <th className=" text-center">ID</th>
              <th className="text-center">Texto de la pregunta</th>
              <th className="">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {localData.map((item) => (
              <tr key={item.id} className="fila">
                <td>{item.id}</td>
                <td>
                  {editingField === item.id ? (
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      autoFocus
                      ref={inputRef}
                      style={{
                        marginRight: "8px",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        padding: "0",
                        color: "white",
                      }}
                    />
                  ) : (
                    <span
                      onClick={() =>
                        handleEditQuestionClick(item.id, item.texto_pregunta)
                      }
                    >
                      {item.texto_pregunta}
                    </span>
                  )}
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddAnswerClick(item.id)}
                  >
                    <i className="bi bi-plus"></i>{" "}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteQuestion(item.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    <i className="bi bi-trash me-2"></i>
                  </Button>
                </td>

                <td>
                  {item.respuestas.map((respuesta) => (
                    <div
                      key={respuesta.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      {editingField === respuesta.id ? (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={handleInputChange}
                          onBlur={handleBlurAnswer}
                          autoFocus
                          ref={inputRef}
                          style={{
                            marginRight: "8px",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            padding: "0",
                            color: "white",
                          }}
                        />
                      ) : (
                        <span
                          onClick={() =>
                            handleEditClick(
                              respuesta.id,
                              respuesta.texto_respuesta
                            )
                          }
                        >
                          {respuesta.texto_respuesta}
                        </span>
                      )}

                      {/* Botón para cambiar entre Verdadera/Falsa */}
                      <Button
                        variant={
                          respuesta.valor === 1 ? "success" : "secondary"
                        }
                        size="sm"
                        onClick={() =>
                          handleToggleAnswerCorrect(
                            respuesta.id,
                            respuesta.valor === 1 ? 0 : 1
                          )
                        }
                        style={{ marginLeft: "10px" }}
                      >
                        {respuesta.valor === 1 ? "Verdadera" : "Falsa"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAnswer(respuesta.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        <i className="bi bi-trash me-2"></i>
                      </Button>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="btn btn-secondary"
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="btn btn-secondary"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
