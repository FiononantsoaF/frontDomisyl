import React from "react";
import { createPortal } from "react-dom";

interface OverlayMessageProps {
  text: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const OverlayMessage: React.FC<OverlayMessageProps> = ({
  text,
  type = "info",
  onClose,
}) => {
  const overlayContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center text-2xl"
      style={{ 
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        fontFamily: 'Agency FB, sans-serif'
      }}
    >
      <div
        className="relative overflow-hidden bg-white p-6 w-80 text-center animate-slide-up border-2"
        style={{ 
          zIndex: 100000
        }}
      >
        {/* Gradient overlay pour effet moderne */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #f18f34 0%, transparent 100%)'
          }}
        />
        
        <div className="relative z-10">
          <p 
            className={`font-semibold text-lg mb-4 ${
              type === "success" ? "text-green-600" :
              type === "error" ? "text-red-600" :
              "text-gray-800"
            }`}
          >
            {text}
          </p>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-medium transition-all duration-200 w-full hover:shadow-lg"
            style={{
              backgroundColor: '#f8f5f3ff',
              color: 'black'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d0cdcaff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dddad7ff';
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
  return createPortal(overlayContent, document.body);
};

export default OverlayMessage;