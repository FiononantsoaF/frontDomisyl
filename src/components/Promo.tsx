import React, { useState, useEffect } from 'react';

const PromoBanner = () => {
  const [currentLine, setCurrentLine] = useState(0);

  const promoLines = [
    "🎉 PROMOTION : -20% SUR TOUS LES MASSAGES 🎉",
    "✨ OFFRE SPÉCIALE : RÉSERVEZ MAINTENANT ✨", 
    "🎁 DERNIERS JOURS : PROFITEZ-EN VITE ! 🎁"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % promoLines.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">


      <div className="absolute top-2 w-3/4 flex justify-center z-5">
        <div className="ticket-container max-w-4xl overflow-hidden">
          <div className="px-4 py-2">
            <div 
              key={currentLine}
              className={`scroll-text line-transition promo-line-${currentLine + 1}`}
            >
              {promoLines[currentLine]}
              {" • "}
              {promoLines[currentLine]}
              {" • "}
              {promoLines[currentLine]}
            </div>
          </div>
          
          {/* Indicateurs de ligne */}
          <div className="absolute bottom-1 right-4 flex gap-1">
            {promoLines.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentLine 
                    ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;