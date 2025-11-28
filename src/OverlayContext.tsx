
import React, { createContext, useContext, useState } from "react";
import OverlayMessage from "./components/OverlayMessage";

interface Overlay {
  text: string;
  type: "success" | "error" | "info";
}

interface OverlayContextType {
  showOverlay: (text: string, type: "success" | "error" | "info") => Promise<void>;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  const showOverlay = (text: string, type: "success" | "error" | "info") => {
    return new Promise<void>((resolve) => {
      setOverlay({ text, type });
      (window as any).__overlayResolve = resolve;
    });
  };

  const closeOverlay = () => {
    setOverlay(null);
    if ((window as any).__overlayResolve) {
      (window as any).__overlayResolve();
      (window as any).__overlayResolve = null;
    }
  };

  return (
    <OverlayContext.Provider value={{ showOverlay }}>
      {children}
      {overlay && (
        <OverlayMessage
          text={overlay.text}
          type={overlay.type}
          onClose={closeOverlay}
        />
      )}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }
  return context;
};