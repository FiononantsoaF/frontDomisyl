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
  fillBookingFormWithUserData?: (userData: any) => void;
  resetFormData?: () => void;
  setSelectedService?: (service: string) => void;       
  setSelectedMassageType?: (type: string) => void;
  preSelectedService?: string;
  preSelectedMassageType?: string;
};

export default function ChoiceClientModal({
  open,
  onClose,
  setLoginOpen,
  setIsBookingOpen,
  setLoginSource,
  resetBookingForm,
  resetFormData,
  setSelectedService,
  preSelectedService,
  preSelectedMassageType,
  setSelectedMassageType,
  handleClientChoice,
  fillBookingFormWithUserData,
}: ChoiceClientModalProps) {

  // const preselectServiceAndPrestation = () => {
  //   if (setSelectedService && preSelectedService) setSelectedService(preSelectedService);
  //   if (setSelectedMassageType && preSelectedMassageType) setSelectedMassageType(preSelectedMassageType);
  // };

  const handleExistingClient = () => {
    onClose();
    const userData = localStorage.getItem("user");
    const userId = localStorage.getItem("user_id");

    if (userData && userId) {
      try {
        const parsedUserData = JSON.parse(userData);
        // preselectServiceAndPrestation();
        if (fillBookingFormWithUserData) fillBookingFormWithUserData(parsedUserData);

        handleClientChoice("booking");
        setIsBookingOpen(true);
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        setLoginSource("booking");
        setLoginOpen(true);
      }
    } else {
      setLoginSource("booking");
      setLoginOpen(true);
    }
  };

  const handleNewClient = () => {
    onClose();
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");

    if (resetFormData) resetFormData();

    // preselectServiceAndPrestation();

    handleClientChoice("booking");
    setIsBookingOpen(true);
  };

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-medium text-gray-900">
              Connexion ou inscription
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-row gap-4">
            <button
              onClick={handleExistingClient}
              className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 text-center text-gray-700 hover:bg-gray-100 transition"
            >
              J'ai un compte
            </button>
            <button
              onClick={handleNewClient}
              className="w-1/2 rounded-lg bg-[#f18f34] text-white px-4 py-3 text-center hover:bg-[#f9b131] transition"
            >
              Nouveau utilisateur
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// import { Dialog } from "@headlessui/react";
// import { X } from "lucide-react";

// type ChoiceClientModalProps = {
//   open: boolean;
//   onClose: () => void;
//   setLoginOpen: (open: boolean) => void;
//   setIsBookingOpen: (open: boolean) => void;
//   setLoginSource: (source: "account" | "booking") => void; 
//   resetBookingForm: () => void;
//   handleClientChoice: (source: "account" | "booking") => void;
//   fillBookingFormWithUserData?: (userData: any) => void;
//   resetFormData?: () => void;
//   setSelectedService?: (service: string) => void;       
//   setSelectedMassageType?: (type: string) => void;
//   preSelectedService?: string;
//   preSelectedMassageType?: string;
// };

// export default function ChoiceClientModal({
//   open,
//   onClose,
//   setLoginOpen,
//   setIsBookingOpen,
//   setLoginSource,
//   resetBookingForm,
//   resetFormData,
//   setSelectedService,
//   preSelectedService,
//   preSelectedMassageType,
//   setSelectedMassageType,
//   handleClientChoice,
//   fillBookingFormWithUserData,
// }: ChoiceClientModalProps) {
  
//   const handleExistingClient = () => {
//     onClose();
//     const userData = localStorage.getItem("user");
//     const userId = localStorage.getItem("user_id");
    
//     if (userData && userId) {
//       try {
//         const parsedUserData = JSON.parse(userData);
//         if (fillBookingFormWithUserData) {
//           fillBookingFormWithUserData(parsedUserData);
//         }
//         handleClientChoice("booking");
//         setIsBookingOpen(true);
//       } catch (error) {
//         console.error("Erreur lors du parsing des données utilisateur:", error);
//         setLoginSource("booking");
//         setLoginOpen(true);
//       }
//     } else {
//       // Utilisateur pas connecté - ouvrir le login
//       setLoginSource("booking");
//       setLoginOpen(true);
//     }
//   };

//   const handleNewClient = () => {
//     onClose();
//     localStorage.removeItem("user");
//     localStorage.removeItem("user_id"); 
//     if (resetFormData) resetFormData();

//     if (setSelectedService && preSelectedService) setSelectedService(preSelectedService);
//     if (setSelectedMassageType && preSelectedMassageType) setSelectedMassageType(preSelectedMassageType);

//       // resetBookingForm();
//     handleClientChoice("booking");
//     setIsBookingOpen(true);

//     };

//   return (
//     // onClose={onClose}
//     <Dialog open={open}  onClose={() => {}} className="relative z-50">
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <Dialog.Title
//               className="text-xl font-medium text-gray-900"
//               style={{ fontFamily: "Agency FB, sans-serif" }}
//             >
//               {/* Connexion ou inscription */}
//             </Dialog.Title>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-500"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Boutons */}
//           <div className="flex flex-row gap-4">
//             <button
//               onClick={handleExistingClient}
//               className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 text-center text-gray-700 hover:bg-gray-100 transition"
//               style={{ fontFamily: "Agency FB, sans-serif" }}
//             >
//               J'ai un compte
//             </button>

//             <button
//               onClick={handleNewClient}
//               className="w-1/2 rounded-lg bg-[#f18f34] text-white px-4 py-3 text-center hover:bg-[#f9b131] transition"
//               style={{ fontFamily: "Agency FB, sans-serif" }}
//             >
//               Nouveau utilisateur
//             </button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// }