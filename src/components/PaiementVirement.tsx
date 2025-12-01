import React from "react";

interface Props {
  amount: number;
}

const PaiementVirement: React.FC<Props> = ({ amount }) => {
  return (
    <div className="p-5 bg-white rounded-lg shadow text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Virement Bancaire</h2>

      {/* Message de félicitations */}
      <p className="text-green-600 font-semibold">
        Félicitations pour votre prise de rendez-vous !
      </p>

      <p className="text-gray-600">
        Le paiement par <span className="font-semibold">virement bancaire</span> 
        n’est pas encore disponible directement dans l’application.
      </p>

      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-sm text-gray-700">
          Montant à payer :
        </p>
        <p className="text-2xl font-bold text-gray-800">
          {amount} Ar
        </p>
      </div>

      {/* <p className="text-dark text-2xl">
        00008 00006 05003025555 59
      </p> */}
    </div>
  );
};

export default PaiementVirement;
