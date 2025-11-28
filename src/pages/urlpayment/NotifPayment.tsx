import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../api/axios";

const NotifPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const appointment_id = searchParams.get("appointment_id");
  const client_id = searchParams.get("client_id");
  const [status, setStatus] = useState("Vérification du paiement...");

//   useEffect(() => {
//     const checkPayment = async () => {
//       try {
//         const response = await API.post("/orangemoney/confirm-payment", {
//           appointment_id,
//           client_id,
//         });

//         if (response.data.success) {
//           setStatus("Paiement confirmé ");
//         } else {
//           setStatus("Paiement non confirmé ");
//         }
//       } catch (error) {
//         setStatus("Erreur lors du traitement.");
//       }
//     };

//     checkPayment();
//   }, [appointment_id, client_id]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold">Notification de paiement</h1>
      <p className="mt-3">{status}</p>
    </div>
  );
};

export default NotifPayment;
