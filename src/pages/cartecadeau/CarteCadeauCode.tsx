import { useState, useEffect } from "react";
import { carteCadeauService } from "../../api/carteCadeauService";
import OverlayMessage from "../../components/OverlayMessage";

interface CarteCadeauPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const CarteCadeauCode: React.FC<CarteCadeauPanelProps> = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);
  const [overlay, setOverlay] = useState<{text: string; type: string} | null>(null);

  const handleCheckCode = async () => {
    if (!code) {
        setOverlay({ text: "Veuillez entrer un code.", type: "error" });
      return;
    }
    const user = localStorage.getItem("user");
    const userConnected = user ? JSON.parse(user) : null;
    setError(null);
    try {
      const response = await carteCadeauService.getByCode(code);
        if (userConnected) {
          const userPhone = userConnected.phone || "";
          const codePhone = response.data?.data?.benef_contact || "";
          if (userPhone !== codePhone) {
            setOverlay({
              text: "Votre contact ne correspond pas au propriétaire de ce code !",
              type: "error",
            });
            return;
          }
        }
      setSuccess(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Code invalide");
      setSuccess(null);
    }
  };

  useEffect(() => {
    if (success) {
      onSuccess(success); 
    }
  }, [success]);

  useEffect(() => {
    if (!isOpen) {
      setCode("");
      setContact("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{ fontFamily: 'Agency FB, sans-serif',
                 pointerEvents: 'auto'
    }}>
      {overlay && (
          <OverlayMessage
            text={overlay.text}
            type={overlay.type as any}
            onClose={() => setOverlay(null)}
          />
        )}
      <div className="bg-white rounded-xl p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4">Entrer le code de la carte cadeau</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code de la carte"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {/* {success && (
          <div className="bg-green-100 p-2 rounded mb-2">
            Carte trouvée : {success.code} - {success.carte_cadeau_service?.service?.title}
          </div>
        )} */}
        <div className="flex flex-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleCheckCode}
            className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white"
          >
            Vérifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarteCadeauCode;
