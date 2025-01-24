import React, { useState } from "react";
import "../styles/modal.css";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "") {
      alert("Por favor, ingresa un nombre de usuario."); 
    } else {
      onSubmit(username);
      setUsername(""); 
      onClose(); 
    }
  };

  if (!isOpen) return null;

  return (
      <div className="modal-overlay">
        <div className="modal-content custom-modal">
          
          <h2>Ingresa tu nombre</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
            />
            <button type="submit">Enviar</button>
          </form>
      </div>
    </div>
  );
};

export default Modal;
