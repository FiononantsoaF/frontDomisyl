import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

interface PaymentInfoProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  choicePaiement: boolean;
  setChoicePaiement: (value: boolean) => void;
  price : number | undefined;

}

export default function PaymentInfo({ isOpen, setIsOpen,choicePaiement, setChoicePaiement , price }:PaymentInfoProps) {
  const navigate = useNavigate();
  const handleClose = () => {
    setIsOpen(false);     
    setChoicePaiement(false);
    console.log("etttooooo") ;
    navigate("/");         
  };
  const mvolaNumber = "038 28 127 35";
  const orangeNumber = "032 45 491 00";
  const bankNumber = "00008 00006 05003025555 59";

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <Dialog.Panel className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <Dialog.Title className="text-xl font-medium text-gray-900">
            Félicitations !
          </Dialog.Title>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <p className="mb-4 text-dark-800">
            Votre rendez-vous a été enregistré avec succès.  
            Il sera confirmé dès réception du paiement d’un montant total:{" "}
            <strong className="text-dark-800 font-bold text-xl">
                {Number(price).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Ar
            </strong>
        </p>
        <p className="mb-4 text-gray-800 text-sm">
            En attendant que le paiement via l’application soit opérationnel, vous pouvez passer au paiement direct en utilisant l’un des numéros suivants :
        </p>

        <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="bg-yellow-400">
              <td className="px-4 py-2 font-semibold">MVola</td>
              <td className="px-4 py-2 font-bold">{mvolaNumber}</td>
            </tr>
            <tr className="bg-orange-400">
              <td className="px-4 py-2 font-semibold">Orange Money</td>
              <td className="px-4 py-2 font-bold">{orangeNumber}</td>
            </tr>
            {/* <tr>
              <td className="px-4 py-2 font-semibold">Virement bancaire</td>
              <td className="px-4 py-2">{bankNumber}</td>
            </tr> */}
          </tbody>
        </table>

      </Dialog.Panel>
    </Dialog>
  );
}
