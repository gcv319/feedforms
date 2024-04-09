// Alert.js
import React from 'react';

interface AlertProps {
  message: string;
  type: string;
  visible: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div 
      className={`alert alert-${type} position-fixed bottom-0 start-0 m-3`}
      style={{ zIndex: 1050 }}
      role="alert"
    >
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

export default Alert;
