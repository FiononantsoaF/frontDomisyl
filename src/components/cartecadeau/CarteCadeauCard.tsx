import React, { useState } from "react";
import { Prestations } from "../../api/carteCadeauService";
import { Eye, X, Gift, Sparkles } from "lucide-react";

interface CarteCadeauCardProps {
  prestation: Prestations;
  selectedPrestation: number | null;
  onSelect: (id: number) => void;
  price: number;
}

const CarteCadeauCard: React.FC<CarteCadeauCardProps> = ({
  prestation,
  selectedPrestation,
  onSelect,
  price,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      {/* ---- CARTE ---- */}
      <div
        key={prestation.id}
        onClick={() => onSelect(prestation.id)}
        className={`group cursor-pointer transition-all duration-500 rounded-lg overflow-hidden
          ${
            selectedPrestation === prestation.id
              ? "ring-4 ring-[#f18f34] ring-offset-2 shadow-lg scale-[1.02]"
              : "shadow-lg hover:shadow-xl hover:scale-[1.01]"
          }`}
      >
        <div className={`relative p-2 transition-all duration-500 ${
          selectedPrestation === prestation.id
            ? "bg-gradient-to-br from-orange-50 via-white to-orange-50"
            : "bg-gradient-to-br from-white via-gray-50 to-white"
        }`}>
          
          {selectedPrestation === prestation.id && (
            <div className="absolute top-2 right-2 bg-[#f18f34] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              ✓
            </div>
          )}

          {/* Titre et bouton info */}
          <div className="flex justify-between items-start mb-3">
            <h3 className={`text-lg font-bold leading-tight pr-2 transition-colors duration-300 ${
              selectedPrestation === prestation.id
                ? "text-[#f18f34]"
                : "text-gray-800 group-hover:text-[#f18f34]"
            }`}>
              {prestation.title}
            </h3>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
              className="shrink-0 p-2 rounded-full bg-white hover:bg-[#f18f34] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              title="Voir les détails"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Catégorie */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-[#f18f34] animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: "Agency FB, sans-serif" }}>
              {prestation.service_category.name}
            </span>
          </div>
        </div>

        {/* Section prix - style carte cadeau */}
        {prestation.price != null && !isNaN(Number(prestation.price)) && (
          <div className="relative bg-gradient-to-r from-[#f18f34] to-[#f9b131] p-2 overflow-hidden">
            
            {/* Motif décoratif */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
            </div>

            <div className="relative flex items-center justify-between">
              
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-500">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                {/* <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                  Offre spéciale
                </span> */}
              </div>

              {/* Prix */}
              <div className="text-right">
                {price !== prestation.price && (
                  <div className="text-sm line-through text-white/60 mb-1">
                    {Number(prestation.price).toFixed(2)} Ar
                  </div>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white drop-shadow-lg">
                    {Number(price).toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-white/90">
                    Ar
                  </span>
                </div>
              </div>
            </div>

            {/* Barre de décoration en pointillés */}
            <div className="absolute bottom-0 left-0 right-0 h-px border-b-2 border-dashed border-white/30"></div>
          </div>
        )}
      </div>


      {/* ---- POPUP ---- */}
        {showDetails && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header avec dégradé subtil */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-100">
                  
                  {/* Bouton fermer moderne */}
                  <button
                    onClick={() => setShowDetails(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg group"
                  >
                    <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                  </button>

                  {/* Titre avec accent */}
                  <div className="flex items-center gap-3 pr-12">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#f18f34] to-[#ff6b35] rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Détails de la prestation
                    </h2>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-4">
                  
                  {/* Titre et catégorie */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {prestation.title}
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#f18f34] to-[#ff6b35]"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {prestation.service_category.name}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {prestation.description && (
                    <div className="prose prose-sm max-w-none">
                      <div
                        className="text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: prestation.description,
                        }}
                      />
                    </div>
                  )}

                  {/* Divider décoratif */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  </div>

                  {/* Prix moderne */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white/70 text-sm font-medium">Prix de l'offre</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">
                            {Number(
                              price !== null && price !== undefined ? price : prestation.price
                            ).toFixed(2)}
                          </span>
                          <span className="text-sm font-bold text-white/80">Ar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
        )}
    </div>
  );
};

export default CarteCadeauCard;
