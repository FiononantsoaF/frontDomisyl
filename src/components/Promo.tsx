import React from 'react';

const PromoBanner = () => {
  const promoLines = [
    "OFFRES SPECIALES LANCEMENT",
    "-25% sur toutes les prestations", 
    "du 20/09 au 20/10/2025"
  ];

  return (
    <div className="w-full bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 py-2 shadow-md overflow-hidden">
      <div className="relative flex items-center">
        <div className="whitespace-nowrap animate-marquee text-white font-bold text-2xl sm:text-base md:text-lg" style={{
          fontFamily: 'Agency FB, sans-serif'
        }}>
          {promoLines.join(" • ")} &nbsp; {promoLines.join(" • ")}
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
