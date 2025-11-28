import { useState } from "react";

interface Overlay {
  text: string;
  type: "success" | "error" | "info";
}

export const useOverlay = () => {
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  
  const showOverlay = (text: string, type: "success" | "error" | "info") => {
    return new Promise<void>((resolve) => {
      setOverlay({ 
        text, 
        type
      });
      
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

  return { overlay, showOverlay, closeOverlay };
};