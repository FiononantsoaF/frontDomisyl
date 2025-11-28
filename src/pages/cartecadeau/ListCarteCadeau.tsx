import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CarteCadeauClient } from "../../api/carteCadeauService";

const ITEMS_PER_PAGE = 3;

interface Props {
  purchaseList: CarteCadeauClient[] | null;
}

export default function ListCarteCadeau({ purchaseList }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  if (purchaseList === null) {
    return (
      <div className="text-center text-gray-500 py-8">
        Chargement...
      </div>
    );
  }

  const totalPages = Math.ceil(purchaseList.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginated = purchaseList.slice(startIndex, endIndex);

  return (
    <div className="mb-10">
      {/* <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-6 h-6 text-[#f18f34]" />
        <h2
          className="text-3xl font-bold text-gray-800"
          style={{ fontFamily: "Agency FB, sans-serif" }}
        >
          Historique des achats
        </h2>
      </div> */}

      {purchaseList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucun achat pour le moment.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((purchase) => (
              <div
                key={purchase.id}
                className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-amber-200"
              >
                {/* Badge de statut en coin */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                      purchase.is_active === 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {purchase.is_active === 1 ? "✓ Valide" : "Expirée"}
                  </span>
                </div>

                {/* Bandeau décoratif supérieur */}
                <div className="h-20 bg-gradient-to-r from-gray-1 to-amber-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl"></div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-4 pt-2">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-black text-[#f18f34] mb-1" style={{ fontFamily: "Agency FB, sans-serif" }}>
                      {purchase.carte_cadeau_service?.service?.title}

                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Carte Cadeau
                    </p>
                  </div>

                  {/* Bénéficiaire */}
                  <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 uppercase mb-1">Pour</p>
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {purchase.benef_name}
                    </h3>
                  </div>

                  {/* Service */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">Message</p>
                    <p className="font-semibold text-gray-700 text-sm line-clamp-2">
                        {purchase.message}
                    </p>
                  </div>

                  {/* Dates de validité */}
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-gray-600 mb-1">Valable du <strong>{purchase.start_date}</strong> au <strong>{purchase.end_date}</strong></p>
                    <p className="font-bold text-sm text-gray-800">
                      {Number(purchase.amount) > 0
                            ? `${Number(purchase.amount).toLocaleString()} Ar`
                            : "GRATUIT"}
                    </p>
                    
                  </div>
                </div>

                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Précédent
            </button>

            <span>
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}