import React from "react";

const CancelPayment: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Paiement annulé</h1>

      <p className="mt-4">
        Votre paiement Orange Money a été annulé.  
        Vous pouvez réessayer à tout moment.
      </p>

      <a
        href="/"
        className="mt-6 inline-block bg-red-600 px-6 py-3 rounded-lg text-white"
      >
        Retour à l'accueil
      </a>
    </div>
  );
};

export default CancelPayment;
