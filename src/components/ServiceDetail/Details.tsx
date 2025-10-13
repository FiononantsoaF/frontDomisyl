import { ChevronLeft, ChevronDown, Sparkles } from "lucide-react";
import { ServiceType, Services } from "../../api/serviceCategoryApi";
import { useEffect } from "react";

type ServiceDetailsProps = {
  showServices: boolean;
  selectedShowService: string | null;
  services: Services[];
  setShowServices: (show: boolean) => void;
  setIsBookingOpen: (open: boolean) => void;
  setChoiceClient: (open: boolean) => void;
  handleBookNowPrestation: (serviceTitle: string, typeId: string ) => void;
  handleShowTypeDetails: (type: ServiceType) => void;
  selectedService?: string | null;
  selectedMassageType?: string | number | null;
  selectedType?: ServiceType | null;
};

export default function Details({
    showServices,
    selectedShowService,
    services,
    setShowServices,
    setIsBookingOpen,
    setChoiceClient,
    handleBookNowPrestation,
    handleShowTypeDetails,
    selectedService,
    selectedMassageType,
    selectedType,
}: ServiceDetailsProps) {

  if (showServices && selectedShowService) {
    const service = services.find(
      (s) =>
        s.title.toLowerCase().trim() ===
        selectedShowService.toLowerCase().trim()
    );

    useEffect(() => {
      if (showServices && selectedShowService) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, [showServices, selectedShowService]);

    if (!service) {
      return <div>Service introuvable.</div>;
    }

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Bouton retour */}
          <button
            onClick={() => setShowServices(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          {/* "grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1
                className="mx-auto text-4xl mb-5 text-[#1d1d1b] text-center"
                style={{ fontFamily: "Agency FB, sans-serif" }}
              >
                {service.title}
              </h1>
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            </div>

            {/* Colonne détails */}
            <div>
              <div className="mb-8">
                <div className="space-y-4">
                  {Array.isArray(service.details?.types) &&
                    service.details.types
                      .filter((type) => {
                        if (!selectedService) return true;
                        if (selectedService && !selectedMassageType) {
                          return selectedService === service.title;
                        }
                        return (
                          selectedService === service.title &&
                          selectedMassageType === type.id
                        );
                      })
                      .map((type, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="mb-1 flex items-center gap-1">
                            {type.price_promo && (
                              <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                                <Sparkles className="w-2 h-2" />
                                Promotion
                              </span>
                            )}
                            <button
                              onClick={() => {
                                handleBookNowPrestation(service.title, type.id);
                                const user = localStorage.getItem("user");
                                const userId = localStorage.getItem("user_id");

                                if (user && userId) {
                                  setIsBookingOpen(true);
                                } else {
                                  setChoiceClient(true);
                                }
                              }}
                              className="bg-[#f18f34] hover:bg-[#f9b131] text-dark text-sm font-medium px-3 py-1 rounded-md shadow ml-auto"
                              style={{ fontFamily: "Agency FB, sans-serif" }}
                            >
                              Réserver
                            </button>
                          </div>

                          {/* Prix */}
                          <div className="flex justify-between items-center mb-2">
                            <h3
                              className="text-lg font-semibold"
                              translate="no"
                            >
                              {type.title}
                            </h3>
                            <div className="flex items-center gap-3">
                              {type.price_promo ? (
                                <>
                                  <span className="inline-flex items-center gap-2">
                                    <span className="line-through text-gray-400">
                                      {type.price}
                                    </span>
                                    <span className="text-[#f18f34] font-semibold">
                                      {type.price_promo}
                                      {Number(type.validity_days) === 30
                                        ? "/mois"
                                        : ""}
                                    </span>
                                  </span>
                                </>
                              ) : (
                                <span className="text-[#f18f34] font-semibold">
                                  {type.price}
                                  {Number(type.validity_days) === 30
                                    ? "/mois"
                                    : ""}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description & détails */}
                          <div className="flex items-center text-gray-500 text-sm justify-between">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: type.description,
                              }}
                            />
                            {type.sessions.some(
                              (session) =>
                                parseInt(session.session_per_period) > 0
                            ) && (
                              <div className="ml-auto">
                                <button
                                  onClick={() => handleShowTypeDetails(type)}
                                  title="Afficher détails"
                                  className="w-fit bg-white hover:bg-grey text-black px-4 py-1 rounded-full transition-colors flex items-center justify-center gap-1"
                                >
                                  <ChevronDown
                                    className={`w-6 h-6 transition-transform duration-300 ${
                                      selectedType?.id === type.id
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>
                              </div>
                            )}
                          </div>

                          {selectedType?.title === type.title && (
                            <div className="mt-4 p-4 bg-[#f9b131] from-orange-100 to-white border border-orange-300 rounded-xl">
                              <div
                                dangerouslySetInnerHTML={{
                                   __html: type.description ?? "",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                </div>
                <div
                  style={{
                    fontFamily: "Agency FB, sans-serif",
                    display: "block",
                  }}
                >
                  {service.remarque}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
