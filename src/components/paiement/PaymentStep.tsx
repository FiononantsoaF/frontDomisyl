import React, { RefObject } from "react";
import PaymentInfo from "../PaymentInfo";
import { useNavigate } from "react-router-dom";

interface Paiement {
  price?: number;
  price_promo?: number;
}

interface PaiementData {
  client_phone: string;
  amount: number;
  subscription_id?: string;
  appointment_id?: string;
}

interface PaymentStepProps {
  show: boolean;
  selectedMethod: string | null;
  setSelectedMethod: (method: string | null) => void;
  acceptedCGV: boolean;
  setAcceptedCGV: (value: boolean) => void;
  cgvRef: RefObject<HTMLDivElement>;
  handleCgvScroll: () => void;
  cgvHtml: string;
  showPaymentModal: boolean;
  setShowPaymentModal: (value: boolean) => void;
  paiement: Paiement | null;
  paiementData: PaiementData;
  handlePaiementDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaiement: (e: React.FormEvent<HTMLFormElement>) => void;
  loadingpay: boolean;
  refreshPage: () => void;
}

export default function PaymentStep({
  show,
  selectedMethod,
  setSelectedMethod,
  acceptedCGV,
  setAcceptedCGV,
  cgvRef,
  handleCgvScroll,
  cgvHtml,
  showPaymentModal,
  setShowPaymentModal,
  paiement,
  paiementData,
  handlePaiementDataChange,
  handlePaiement,
  loadingpay,
  refreshPage
}: PaymentStepProps) {

  if (!show) return null;
  const navigate = useNavigate();
  return (
    <div className="text-center">
      {!selectedMethod && (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">

            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
              Méthode de paiement
            </h2>

            <div
              ref={cgvRef}
              onScroll={handleCgvScroll}
              className="border h-64 overflow-y-auto p-2 mb-4"
              dangerouslySetInnerHTML={{ __html: cgvHtml }}
            />

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="cgv"
                checked={acceptedCGV}
                onChange={(e) => { setAcceptedCGV(e.target.checked);
                                setShowPaymentModal(e.target.checked);
                }
                }
                className="mr-2 w-4 h-4 accent-[#f18f34]"
              />
              <label htmlFor="cgv" className="text-gray-700 text-sm">
                J'accepte les{" "}
                <a href="/CGV.pdf" className="text-[#f18f34] underline">
                  conditions générales de vente
                </a>
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
                    <button
                    onClick={() => setSelectedMethod('mvola')}
                    disabled={!acceptedCGV}
                    className="flex-1 bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-dark px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                  >
                    MVola
                  </button>
                  {/* <button
                    onClick={() => setSelectedMethod('stripe')}
                    className="flex-1 bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-dark px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                  >
                    Virement bancaire
                  </button> */}
                   <button
                    onClick={() => setSelectedMethod('orange')}
                    disabled={!acceptedCGV}
                    className="flex-1 bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-dark px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                  >
                    Orange Money
                  </button>  

                {/* {showPaymentModal && (
                  <PaymentInfo
                    isOpen={showPaymentModal}
                    setIsOpen={setShowPaymentModal}
                    choicePaiement={selectedMethod}
                    setChoicePaiement={setSelectedMethod}
                    price={paiement?.price_promo ?? paiement?.price}
                    onClose={() => navigate("/carte-cadeau?frompayment=1")}
                  />
                )} */}


            </div>
          </div>
        </div>
      )}

      {/* --- PAIEMENT ORANGE MONEY --- */}
      {/* {selectedMethod === "orange" && (
        <OrangeMoney amount={paiement?.price_promo ?? paiement?.price ?? 0} />
      )} */}

      {/* --- PAIEMENT MVOLA --- */}
      {selectedMethod === "mvola" && (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">

              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Paiement MVola
              </h2>

              <form onSubmit={handlePaiement} className="space-y-4">
                
                <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
                  <p className="text-sm font-medium text-gray-600">Total à payer</p>

                  {paiement?.price_promo ? (
                    <>
                      <p className="text-lg line-through text-gray-400">{paiement?.price} Ar</p>
                      <p className="text-2xl font-bold text-[#f18f34]">{paiement?.price_promo} Ar</p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-[#f18f34]">{paiement?.price} Ar</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro (034 ou 038 seulement)
                  </label>

                  <input
                    type="text"
                    name="client_phone"
                    value={paiementData.client_phone}
                    onChange={handlePaiementDataChange}
                    className="w-full pl-14 rounded-md border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f18f34] focus:border-transparent"
                    required
                  />
                </div>

                <input type="number" name="amount" value={paiementData.amount} readOnly className="hidden" />
                <input type="hidden" name="subscription_id" value={paiementData.subscription_id} />
                <input type="hidden" name="appointment_id" value={paiementData.appointment_id} />

                <button
                  type="submit"
                  disabled={loadingpay}
                  className="w-full bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-white px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                >
                  <span>Payer maintenant</span>
                  {loadingpay && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
