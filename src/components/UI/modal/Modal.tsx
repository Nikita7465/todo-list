import React, { ReactNode } from "react";
import "./modal.css";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="blackout" onClick={onClose}>
      <div className="modal" onClick={handleModalClick}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
