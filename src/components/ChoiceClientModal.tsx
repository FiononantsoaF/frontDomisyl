import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

type ChoiceClientModalProps = {
  open: boolean;
  onClose: () => void;
  setLoginOpen: (open: boolean) => void;
  setIsBookingOpen: (open: boolean) => void;
  setLoginSource: (source: "account" | "booking") => void; 
  resetBookingForm: () => void;
  handleClientChoice: (source: "account" | "booking") => void;
  fillBookingFormWithUserData?: (userData: any) => void; // Nom correct de la prop
};

export default function ChoiceClientModal({
  open,
  onClose,
  setLoginOpen,
  setIsBookingOpen,
  setLoginSource,
  resetBookingForm,
  handleClientChoice,
  fillBookingFormWithUserData, // Utiliser le bon nom de prop
}: ChoiceClientModalProps) {
  
  const handleExistingClient = () => {
    onClose();
    
    // Vérifier si l'utilisateur est déjà connecté
    const userData = localStorage.getItem("user");
    const userId = localStorage.getItem("user_id");
    
    if (userData && userId) {
      // Utilisateur déjà connecté - pré-remplir et ouvrir le formulaire
      try {
        const parsedUserData = JSON.parse(userData);
        
        // Appeler la fonction de pré-remplissage si elle existe
        if (fillBookingFormWithUserData) {
          fillBookingFormWithUserData(parsedUserData);
        }
        
        handleClientChoice("booking");
        setIsBookingOpen(true);
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        // En cas d'erreur, ouvrir le login
        setLoginSource("booking");
        setLoginOpen(true);
      }
    } else {
      // Utilisateur pas connecté - ouvrir le login
      setLoginSource("booking");
      setLoginOpen(true);
    }
  };

  const handleNewClient = () => {
    onClose();
    localStorage.removeItem("user");
    localStorage.removeItem("user_id"); 
    resetBookingForm();
    handleClientChoice("booking");
    setIsBookingOpen(true);
  };

  return (
    // onClose={onClose}
    <Dialog open={open}  onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title
              className="text-xl font-medium text-gray-900"
              style={{ fontFamily: "Agency FB, sans-serif" }}
            >
              {/* Connexion ou inscription */}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Boutons */}
          <div className="flex flex-row gap-4">
            <button
              onClick={handleExistingClient}
              className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 text-center text-gray-700 hover:bg-gray-100 transition"
              style={{ fontFamily: "Agency FB, sans-serif" }}
            >
              J'ai un compte
            </button>

            <button
              onClick={handleNewClient}
              className="w-1/2 rounded-lg bg-[#f18f34] text-white px-4 py-3 text-center hover:bg-[#f9b131] transition"
              style={{ fontFamily: "Agency FB, sans-serif" }}
            >
              Nouveau utilisateur
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}