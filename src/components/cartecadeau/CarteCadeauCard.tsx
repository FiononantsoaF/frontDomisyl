import React, { useState } from "react";
import { Prestations } from "../../api/carteCadeauService";
import { Eye, X } from "lucide-react";

interface CarteCadeauCardProps {
  prestation: Prestations;
  selectedPrestation: number | null;
  onSelect: (id: number) => void;
  price : number;
}

const CarteCadeauCard: React.FC<CarteCadeauCardProps> = ({
  prestation,
  selectedPrestation,
  onSelect,
  price,
}) => {
  const [showDetails, setShowDetails] = useState(false); 

  return (
    <>
      <div
        key={prestation.id}
        onClick={() => onSelect(prestation.id)}
        className={`cursor-pointer transition-all duration-300 rounded-xl p-3 hover:scale-105 shadow-md hover:shadow-lg ${
          selectedPrestation === prestation.id
            ? "ring-2 ring-[#f18f34] bg-orange-50 shadow-lg"
            : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3
            className={`text-sm font-semibold ${
              selectedPrestation === prestation.id
                ? "text-[#f18f34]"
                : "text-gray-800"
            }`}
          >
            {prestation.title}
          </h3>

          {/* Bouton voir détails */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche d’activer la sélection
              setShowDetails(true);
            }}
            className="p-1 rounded-full hover:bg-orange-100 transition"
            title="Voir les détails"
          >
            <Eye className="w-4 h-4 text-[#f18f34]" />
          </button>
        </div>

        <span
          className="bg-[#f18f34] text-white text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ fontFamily: "Agency FB, sans-serif" }}
        >
          {prestation.service_category.name}
        </span>

      {prestation.price != null && !isNaN(Number(prestation.price)) && (
        <div className="mt-2">
          {price !== prestation.price ? (
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">
                {Number(prestation.price).toFixed(2)} Ar
              </span>
              <span className="text-orange-600 font-bold">
                {Number(price).toFixed(2)} Ar
              </span>
            </div>
          ) : (
            <span className="text-orange-600 font-bold">
              {Number(prestation.price).toFixed(2)} Ar
            </span>
          )}
        </div>
      )}

      </div>

      {/* --- POPUP DETAIL --- */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-80 sm:w-96 p-5 relative">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-lg font-bold text-[#f18f34] mb-3">
              Détails de la prestation
            </h2>

            <p className="text-sm text-gray-700 mb-2">
              <strong>{prestation.title}</strong>({prestation.service_category.name})
            </p>
            {prestation.description && (
              <div className="text-sm text-gray-600 mb-3">
                {/* <strong>Description :</strong> */}
                <div
                  className="mt-1 text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: prestation.description,
                  }}
                />
              </div>
            )}
            {prestation.price != null && (
              <div className="bg-[#f18f34] text-white text-sm font-semibold mb-2 px-3 py-1 rounded-lg inline-block">
                {Number(prestation.price).toFixed(2)} Ar
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CarteCadeauCard;
