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
};

export default function ChoiceClientModal({
  open,
  onClose,
  setLoginOpen,
  setIsBookingOpen,
  setLoginSource,
  resetBookingForm,
  handleClientChoice,
}: ChoiceClientModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title
              className="text-xl font-medium text-gray-900"
              style={{ fontFamily: "Agency FB, sans-serif" }}
            >
              {/* Choix du client */}
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
                onClick={() => {
                onClose();
                if (localStorage.getItem("user") && localStorage.getItem("user_id")) {
                    handleClientChoice("booking");
                } else {
                    setLoginSource("booking");
                    setLoginOpen(true);
                }
                }}
                className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 text-center text-gray-700 hover:bg-gray-100 transition"
            >
                Déjà client
            </button>

            <button
                onClick={() => {
                handleClientChoice("booking");
                localStorage.removeItem("user");
                localStorage.removeItem("user_id");
                resetBookingForm();
                setIsBookingOpen(true);
                onClose();
                }}
                className="w-1/2 rounded-lg bg-[#f18f34] text-white px-4 py-3 text-center hover:bg-[#f9b131] transition"
                style={{ fontFamily: "Agency FB, sans-serif" }}
            >
                Nouveau client
            </button>
            </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
