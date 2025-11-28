import React, { useEffect, useState, useRef } from "react";
import {
  CreditCard,
  ShoppingBag,
  ChevronLeft,
   X 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {carteCadeauService, CarteCadeau, CarteCadeauClient } from "../../api/carteCadeauService";
import CarteCadeauCard from "./CarteCadeauCard";
import { Link } from "react-router-dom";
import PaymentStep from "../paiement/PaymentStep";
import ListCarteCadeau from "../../pages/cartecadeau/ListCarteCadeau";
import { servicesService } from "../../api/serviceCategoryApi";
import { useLocation } from "react-router-dom";
import OverlayMessage from "../OverlayMessage";
import { useOverlay } from '../../hooks/useOverlay';


interface PopupProps {
  message: string;
  onClose: () => void;
}

const CarteCadeauComponent: React.FC = () => {

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [carteCadeau, setCarteCadeau] = useState<CarteCadeau[]>([]);
  const [loading, setLoading] = useState(true);
  const [beneficiaire, setBeneficiaire] = useState("");
  const [contact, setContact] = useState("");
  const [emailBenef, setEmailBenef] = useState("");
  const [messageBenef, setMessageBenef] = useState("");
  const [beneficiaireValide, setBeneficiaireValide] = useState(false);

  // Infos donneur
  const [donneurEmail, setDonneurEmail] = useState("");
  const [donneurPassword, setDonneurPassword] = useState("");
  const [donneurContact, setDonneurContact] = useState("");
  const [donneurName, setDonneurName] = useState("");
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPrestation, setSelectedPrestation] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [step, setStep] = useState<"beneficiaire" | "donneur" | "paiement">("beneficiaire");

  const [selectedMethod, setSelectedMethod] = useState<string | null >("card");
  const [acceptedCGV, setAcceptedCGV] = useState(false);
  const cgvRef = useRef<HTMLDivElement>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paiementData, setPaiementData] = useState<any>({});
  const [loadingpay, setLoadingPay] = useState(false);

  const [purchaseList, setPurchaseList] = useState<CarteCadeauClient[] | null>(null);
  const [phoneError , setPhoneError] = useState("");
  const [emailError , setEmailError] = useState("");

  const [userConnected, setUserConnected] = useState(null);
  const { overlay, showOverlay, closeOverlay } = useOverlay();

  
  const navigate = useNavigate();
  const fromPayment = params.get("frompayment");

  useEffect(() => {
    if (fromPayment === "1") {
      setShowHistory(true);
    }
  }, [fromPayment]);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await carteCadeauService.getAll();
        if (res.success) {
          setCarteCadeau(res.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);


  useEffect(() => {
    const loadData = async () => {
    const userId = localStorage.getItem("user_id");
      try {
        const res = await carteCadeauService.getByClientId(Number(userId));
        setPurchaseList(res.data); 

      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("user connecté",storedUser);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserConnected(user);
      setDonneurName(user.name || "");
      setDonneurEmail(user.email || "");
      setDonneurContact(user.phone || "");
    }
  }, []);

  const calculatePrice = (carte: CarteCadeau): number => {
    if (carte.reduction_percent) {
      const price = carte.service.price ? Number(carte.service.price) : 0;
      return price * (1 - Number(carte.reduction_percent) / 100);
    } else {
      return carte.amount !== null
        ? Number(carte.amount)
        : carte.service.price
        ? Number(carte.service.price)
        : 0;
    }
  };

  const validateEmail = async (value : string ) => {
    if (!value) {
      setEmailError("");
      return;
    }
    const valid = await servicesService.checkEmailFormat(value);
    if (!valid) {
      setEmailError("Email invalide");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = async (value : string ) => {
    if (!value) {
      setPhoneError("");
      return;
    }
    const valid = await servicesService.checkPhoneNumber(value);
    if (!valid) {
      setPhoneError(" Numero invalide");
    } else {
      setPhoneError("");
    }
  };

  const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
    if (!message) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
          <p className="text-gray-800 font-semibold mb-4">{message}</p>
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold w-full"
          >
            OK
          </button>
        </div>
      </div>
    );
  };



  const handleShowHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleBeneficiaireSubmit = async() => {
    if (!selectedPrestation) {
      await showOverlay("Veuillez selectionner une prestation", "success");
      return;
    }
    if (!beneficiaire || !contact) {
      await showOverlay("Veuillez remplir tous les champs !", "success");
      return;
    }
    if (phoneError || emailError || !contact || !beneficiaire) {
        setMessage("Veuillez vérifier les champs !");
        return;
    }
  
    const stored = JSON.parse(sessionStorage.getItem("carteCadeau") || "{}");

    const updatedData = {
      ...stored,
      prestationId: selectedPrestation,
      price: selectedPrice,
      beneficiaire: {
        name: beneficiaire,
        contact: contact,
        email: emailBenef,
        message: messageBenef,
      },
    };

    sessionStorage.setItem("carteCadeau", JSON.stringify(updatedData));
    console.log(sessionStorage.getItem("carteCadeau"));
    setBeneficiaireValide(true);
    setStep("donneur");
  };

  const handleDonneurSubmit = async () => {
    if (!donneurName || !donneurEmail || !donneurContact || !donneurPassword) {
      await showOverlay("Veuillez remplir tous les champs requis !", "error");
      return;
    }
    const checkPassword = await servicesService.checkPassword(donneurPassword, donneurEmail);
    if(!checkPassword){
      await showOverlay("Mot de passe incorrect", "error");
      return;
    }
    const carte = JSON.parse(sessionStorage.getItem("carteCadeau") || "{}");
    if (!carte || !carte.beneficiaire) {
      await showOverlay("Veuillez remplir les informations du bénéficiaire !", "error");
      return;
    }
    const updatedCarte = {
      ...carte,
      donneur: {
        name: donneurName,
        email: donneurEmail,
        password: donneurPassword,
        contact: donneurContact,
      }
    };
    sessionStorage.setItem("carteCadeau", JSON.stringify(updatedCarte));
    const card = JSON.parse(sessionStorage.getItem("carteCadeau") || "{}");
    const response = await carteCadeauService.save(card);
    // console.log("price du prestation selectionnée", selectedPrice);

    if (response.data && response.data.data && response.data.data.clients) {
      localStorage.setItem("user", JSON.stringify(response.data.data.clients));
      localStorage.setItem("user_id", JSON.stringify(response.data.data.clients.id));
    }
    
    navigate("/paiement-carte-cadeau"); 
  };

  const handlePaiementDataChange = (data: any) => setPaiementData(data);
  const handlePaiement = () => alert("Paiement simulé");
  const handleSetSelectedMethod = (method: string |null) => setSelectedMethod(method);

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  return (
  <div 
    className="min-h-screen bg-white px-4 pt-4 bg-no-repeat"
    style={{
      backgroundImage: `url('/gift_card_back.png')`,
      backgroundSize: '100% auto',
      backgroundPosition: 'top center',
    }}
  >
      {overlay && (
        <OverlayMessage
          text={overlay.text}
          type={overlay.type}
          onClose={closeOverlay}
        />
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <Link
            to="/"
            className="flex items-center text-[#f18f34] font-semibold hover:underline"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour
          </Link>
        </div>
      </div>

      <div className="px-4 py-1 text-sm text-gray-700 flex flex-wrap items-center justify-between gap-1">
        <h1
          className="text-4xl font-bold text-center sm:text-left text-[#1d1d1b] mt-2 sm:mt-0 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]"
          style={{ fontFamily: "Agency FB, sans-serif" }}
        >
          Cartes Cadeaux
        </h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`group flex items-center gap-2 border-2 border-[#f18f34] font-semibold px-5 py-1 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#f18f34]/50 ${
            showHistory
              ? "bg-[#f18f34] text-white"
              : "bg-transparent text-[#f18f34] hover:bg-[#f18f34] hover:text-white"
          }`}
        >
          <span className={showHistory ? "rotate-90" : ""}>
            {showHistory ? <X className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
          </span>
          {showHistory ? "Fermer" : "Mes cartes"}
        </button>

        {/* <button
          onClick={handleShowHistory}
          className={`flex items-center gap-1 border-2 border-[#f18f34] font-semibold px-6 py-2 rounded-full transition-all duration-300 mt-3 sm:mt-0 ${
            showHistory
              ? "bg-[#f18f34] text-white"
              : "bg-transparent text-[#f18f34] hover:bg-[#f18f34] hover:text-white"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          {showHistory ? "X" : "Mes cartes"}
        </button> */}
      </div>

      {/* Historique */}
      {showPaymentModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Bouton fermer */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#f18f34]">Paiement</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            {/* Contenu PaymentStep */}
            <div className="p-6">
              <PaymentStep
                show={true}
                selectedMethod={selectedMethod}
                setSelectedMethod={handleSetSelectedMethod}
                acceptedCGV={acceptedCGV}
                setAcceptedCGV={setAcceptedCGV}
                cgvRef={cgvRef}
                handleCgvScroll={() => {}}
                cgvHtml="<p>CGV ici</p>"
                showPaymentModal={showPaymentModal}
                setShowPaymentModal={setShowPaymentModal}
                paiement={{ price: selectedPrice ?? 0 }}
                paiementData={paiementData}
                handlePaiementDataChange={handlePaiementDataChange}
                handlePaiement={handlePaiement}
                loadingpay={loadingpay}
                refreshPage={() => window.location.reload()}
              />
            </div>
          </div>
        </div>
      ) : showHistory ? (
         <ListCarteCadeau purchaseList={purchaseList} />

      ) : (
        <>
            <div className="p-6 mb-8">
              <div
                className="
                  grid grid-cols-1 
                  sm:grid-cols-1 
                  md:grid-cols-2 
                  lg:grid-cols-4 
                  gap-4 
                  justify-center
                "
              >
                {carteCadeau.map((carte) => (
                  <CarteCadeauCard
                    key={carte.id}
                    prestation={carte.service}
                    selectedPrestation={selectedPrestation}
                    onSelect={() => {
                      setSelectedPrestation(carte.service.id);
                      setSelectedPrice(calculatePrice(carte));
                    }}
                    price={calculatePrice(carte)}
                  />
                ))}
              </div>
            </div>

          {/* Formulaire */}
          <div className="max-w-4xl mx-auto bg-none shadow-xl rounded-2xl p-4 border border-gray-100">
            {/* Menu interne */}
            <div className="flex justify-center mb-6 border-b border-gray-300">
              <button
                className={`px-4 py-2 font-semibold ${
                  step === "beneficiaire" ? "border-b-2 border-orange-500 text-orange-600" : "text-gray-500"
                }`}
                onClick={() => setStep("beneficiaire")}
              >
                Bénéficiaire
              </button>
              <button
                className={`px-4 py-2 font-semibold ${
                  step === "donneur" ? "border-b-2 border-orange-500 text-orange-600" : "text-gray-500"
                } ${!beneficiaireValide ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (beneficiaireValide) setStep("donneur");
                }}
                disabled={!beneficiaireValide}
              >
                Vos informations
              </button>

            </div>

            {/* Contenu dynamique */}
            {step === "beneficiaire" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        {/* Nom, contact, email du bénéficiaire */}
                        <div>
                          <label className="block text-sm font-medium mb-1 text-dark-700">
                            Nom du bénéficiaire
                          </label>
                          <input
                            type="text"
                            value={beneficiaire}
                            onChange={(e) => setBeneficiaire(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        {/* Contact et email avec erreurs */}
                        <div>
                          <label className="block text-sm font-medium mb-1 text-dark-700">
                            Contact du bénéficiaire
                          </label>
                          <input
                            type="tel"
                            value={contact}
                            onChange={(e) => {
                              setContact(e.target.value);
                              validatePhone(e.target.value);
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-dark-700">
                            Email du bénéficiaire (facultatif)
                          </label>
                          <input
                            type="text"
                            value={emailBenef}
                            onChange={(e) => {
                              setEmailBenef(e.target.value);
                              validateEmail(e.target.value);
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>
                      </div>
                      <div className="space-y-5">
                          <label className="block text-sm font-medium mb-1 text-dark-700">
                            Un mot pour accompagner votre cadeau
                          </label>
                          <textarea
                            value={messageBenef}
                            onChange={(e) => setMessageBenef(e.target.value)}
                            rows={6}
                            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-40 resize-none"
                          />
                      </div>
                  </div>
                  <div className="space-y-10 mt-6">
                        <button
                            onClick={handleBeneficiaireSubmit}
                            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-orange-600 hover:to-[#f9b131] text-white font-bold px-4 py-2 rounded-full transition-all duration-300"
                          >
                            Valider l'achat
                        </button>
                  </div>
                </>
            )}

            {step === "donneur" && (
              <div className="space-y-5 mt-4">
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={donneurName}
                  onChange={(e) => setDonneurName(e.target.value)}
                  disabled={!!userConnected}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  value={donneurEmail}
                  onChange={(e) => { setDonneurEmail(e.target.value); validateEmail(e.target.value); }}
                  disabled={!!userConnected}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                <input
                  type="text"
                  placeholder="Votre contact"
                  value={donneurContact}
                  onChange={(e) => setDonneurContact(e.target.value)}
                  disabled={!!userConnected}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="password"
                  placeholder="Votre mot de passe"
                  value={donneurPassword}
                  onChange={(e) => setDonneurPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <div>
                  <Link to="/password_reset" className="font-semibold underline">Mot de passe oublié ?</Link>
                </div>
                <button
                  onClick={handleDonneurSubmit}
                  className="w-full bg-gray-500 text-white font-bold px-4 py-2 rounded-full"
                >
                  Valider et payer
                </button>
              </div>
            )}
          </div>

        </>
      )}

  </div>


  );

  
};

export default CarteCadeauComponent;