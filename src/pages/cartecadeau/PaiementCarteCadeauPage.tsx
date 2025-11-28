import React, { useEffect, useRef, useState } from "react";
import PaymentStep from "../../components/paiement/PaymentStep";
import {carteCadeauService, CarteCadeau, CarteCadeauClient } from "../../api/carteCadeauService";


interface PaiementData {
  client_phone: string;
  amount: number;
  subscription_id?: string;
  appointment_id?: string;
}

export default function PaiementCarteCadeauPage() {

  const [step, setStep] = useState("paiement");
  const [cgvHtml, setCgvHtml] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [acceptedCGV, setAcceptedCGV] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [paiement, setPaiement] = useState<{ price?: number; price_promo?: number } | null>(null);

  const cgvRef = useRef<HTMLDivElement>(null);
  

  const [paiementData, setPaiementData] = useState<PaiementData>({
    client_phone: "",
    amount: 0,
  });

  useEffect(() => {
      fetch("/CGV.html")
        .then((res) => res.text())
        .then((data) => setCgvHtml(data))
        .catch((error) => console.error('Erreur lors du chargement CGV:', error));
    }, []);

  /** ----- Récupération carte cadeau ----- */
  useEffect(() => {
    const card = JSON.parse(sessionStorage.getItem("carteCadeau") || "{}");
    if (card && card.price) {
      setPaiement({
        price: card.price,
        price_promo: card.prixPromo ?? null,
      });

      setPaiementData((prev) => ({
        ...prev,
        amount: card.prixPromo ?? card.price,
      }));
      sessionStorage.removeItem("carteCadeau");
    }
  }, []);

  /** ----- Gestion des inputs MVola ----- */
  const handlePaiementDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaiementData({
      ...paiementData,
      [e.target.name]: e.target.value,
    });
  };

  /** ----- Soumission MVola ----- */
  const handlePaiement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Paiement en cours… (MVola)");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <PaymentStep
        show={step === "paiement"}
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        acceptedCGV={acceptedCGV}
        setAcceptedCGV={setAcceptedCGV}
        cgvRef={cgvRef}
        handleCgvScroll={() => {}}
        cgvHtml={cgvHtml}
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        paiement={paiement}
        paiementData={paiementData}
        handlePaiementDataChange={handlePaiementDataChange}
        handlePaiement={handlePaiement}
        loadingpay={false}
        refreshPage={() => window.location.reload()}
      />

    </div>
  );
}
