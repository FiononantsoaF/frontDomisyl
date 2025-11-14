import React, { useEffect, useState } from "react";
import {
  CreditCard,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import {
  carteCadeauService,
  ServiceType,
  Prestations,
  CarteCadeau,
} from "../../api/carteCadeauService";
import CarteCadeauCard from "./CarteCadeauCard";
import { Link } from "react-router-dom";

const CarteCadeauComponent: React.FC = () => {
  const [carteCadeau, setCarteCadeau] = useState<CarteCadeau[]>([]);
  const [loading, setLoading] = useState(true);
  const [beneficiaire, setBeneficiaire] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail]=useState("");
  const [emailBenef, setEmailBenef] = useState("");
  const [messageBenef, setMessageBenef] = useState("");

// Infos donneur
  const [donneurEmail, setDonneurEmail] = useState("");
  const [donneurPassword, setDonneurPassword] = useState("");
  const [validite, setValidite] = useState("");
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [selectedPrestation, setSelectedPrestation] = useState<number | null>(null);
  const [step, setStep] = useState<"beneficiaire" | "donneur">("beneficiaire");

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
    loadPurchaseHistory();
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


  const loadPurchaseHistory = () => {
    const mockHistory = [
      {
        id: 1,
        beneficiaire: "Marie Dupont",
        service: "Massage Relaxant",
        montant: 75,
        date: "2025-10-15",
        validite: "90 jours",
        statut: "Active",
      },
      {
        id: 2,
        beneficiaire: "Jean Martin",
        service: "Soin du visage",
        montant: 60,
        date: "2025-10-20",
        validite: "60 jours",
        statut: "Active",
      },
      {
        id: 3,
        beneficiaire: "Sophie Lambert",
        service: "Manucure",
        montant: 35,
        date: "2025-09-10",
        validite: "30 jours",
        statut: "Expirée",
      },
    ];
    setPurchaseHistory(mockHistory);
  };

  const handleShowHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleBeneficiaireSubmit = () => {
    if (!beneficiaire || !contact ) {
      setMessage("Veuillez remplir tous les champs !");
      return;
    }
    const benefData = { beneficiaire, contact, email: emailBenef, message: messageBenef };
    sessionStorage.setItem("beneficiaire", JSON.stringify(benefData));

    console.log()

    setStep("donneur");

    // const newPurchase = {
    //   id: purchaseHistory.length + 1,
    //   beneficiaire,
    //   service: "Carte cadeau générique",
    //   montant: 0,
    //   date: new Date().toISOString().split("T")[0],
    //   validite,
    //   statut: "Active",
    // };

    // setPurchaseHistory([newPurchase, ...purchaseHistory]);
    // setBeneficiaire("");
    // setContact("");
    // setValidite("");

    // setTimeout(() => {
    //   setShowHistory(true);
    // }, 1500);
  };

  const handleDonneurSubmit = () => {
    if (!donneurEmail || !donneurPassword) {
      alert("Veuillez saisir votre email et mot de passe !");
      return;
    }

    // Stocker infos du donneur
    sessionStorage.setItem("donneur", JSON.stringify({ email: donneurEmail, password: donneurPassword }));

    // Ici tu peux appeler l'API pour valider l'achat
    alert("Infos du bénéficiaire et du donneur stockées, prêt pour paiement !");
  };

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-white px-4 pt-4">
      {/* Header */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1">
      {/* Retour toujours à gauche */}
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
      className="text-4xl font-bold text-center sm:text-left text-[#1d1d1b] mt-2 sm:mt-0"
      style={{ fontFamily: "Agency FB, sans-serif" }}
    >
      Cartes Cadeaux
    </h1>

    {/* Bouton à droite sur sm+ */}
    <button
      onClick={handleShowHistory}
      className={`flex items-center gap-1 border-2 border-[#f18f34] font-semibold px-6 py-2 rounded-full transition-all duration-300 mt-3 sm:mt-0 ${
        showHistory
          ? "bg-[#f18f34] text-white"
          : "bg-transparent text-[#f18f34] hover:bg-[#f18f34] hover:text-white"
      }`}
    >
      <CreditCard className="w-5 h-5" />
      {showHistory ? "X" : "Mes cartes"}
    </button>
    </div>
      {/* Historique */}
      {showHistory ? (
        <div className="mb-10 bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-6 h-6 text-[#f18f34]" />
            <h2
              className="text-3xl font-bold text-gray-800"
              style={{ fontFamily: "Agency FB, sans-serif" }}
            >
              Historique des achats
            </h2>
          </div>

          {purchaseHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun achat pour le moment.
            </p>
          ) : (
            <div className="space-y-4">
              {purchaseHistory.map((purchase) => (
                <div
                  key={purchase.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                         {purchase.beneficiaire}
                      </h3>
                      <p className="text-gray-600">{purchase.service}</p>
                      <p className="text-sm text-gray-500">
                        Validité : {purchase.validite}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-xl text-[#f18f34]">
                          {purchase.montant > 0
                            ? `${purchase.montant} Ar`
                            : "Gratuit"}
                        </p>
                        <p className="text-sm text-gray-500">{purchase.date}</p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          purchase.statut === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {purchase.statut}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Section des cartes */}
          <div className=" bg-gradient-to-br from-[#fdc800] to-white rounded-1xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {carteCadeau.map((carte) => (
                <CarteCadeauCard
                  key={carte.id}
                  prestation={carte.service} // ✅ on passe le service de la carte cadeau
                  selectedPrestation={selectedPrestation}
                  onSelect={setSelectedPrestation}
                  price={calculatePrice(carte)}
                />
              ))}
            </div>
          </div>


          {/* Formulaire */}
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-2 border border-gray-100">
            {/* <h3 className="text-2xl font-bold text-center text-[#f18f34] mb-8">
              Offrir une carte cadeau
            </h3> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Nom du bénéficiaire
                  </label>
                  <input
                    type="text"
                    value={beneficiaire}
                    onChange={(e) => setBeneficiaire(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Contact du bénéficiaire
                  </label>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email du bénéficiaire (facultatif)
                  </label>
                  <input
                    type="text"
                    value={emailBenef}
                    onChange={(e) => setEmailBenef(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Votre message
                  </label>
                  <textarea
                    value={messageBenef}
                    onChange={(e) => setMessageBenef(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  onClick={handleBeneficiaireSubmit }
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-4 py-2 rounded-full transition-all duration-300"
                >
                  Valider l'achat
                </button>

                {message && (
                  <p className="mt-2 text-green-600 font-medium text-center">
                    {message}
                  </p>
                )}
              </div>
              
            </div>
            {step === "donneur" && (
                <>
                  <h3 className="text-2xl font-bold text-center text-[#f18f34] mb-5">
                    Informations du donneur
                  </h3>
                  <div className="space-y-5">
                    <input
                      type="email"
                      placeholder="Votre email"
                      value={donneurEmail}
                      onChange={(e) => setDonneurEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    <input
                      type="password"
                      placeholder="Votre mot de passe"
                      value={donneurPassword}
                      onChange={(e) => setDonneurPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    <button
                      onClick={handleDonneurSubmit}
                      className="w-full bg-orange-500 text-white font-bold px-4 py-2 rounded-full"
                    >
                      Valider et payer
                    </button>
                  </div>
                </>
              )}
          </div>

        </>
      )}
    </div>
  );
};

export default CarteCadeauComponent;
