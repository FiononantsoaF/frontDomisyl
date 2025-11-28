import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ModernSelect({ options, onSelect, placeholder = "Menu" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(placeholder);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpen(false);

    if (onSelect) {
      onSelect(option.value);
    }
    if (option.value) {
      window.location.href = option.value;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-[99999]" ref={dropdownRef} >
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-transparent border-2 border-[#f18f34] text-[#f18f34] hover:bg-[#f18f34] hover:text-white font-bold px-6 py-1 rounded-full transition-all duration-300 text-lg flex items-center gap-3 min-w-[150px] justify-between overflow-hidden"
        style={{ fontFamily: 'Agency FB, sans-serif' }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
        <span className="relative z-10">{selected}</span>

        <ChevronDown
          className={`relative z-10 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>

      {/* Menu déroulant */}
      <div
        className={`absolute top-full mt-2 w-full bg-slate-800 border-2 border-[#f18f34] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 origin-top z-[99999] ${
          isOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            disabled={option.value === ''}
            className={`w-full px-6 py-3 text-left transition-all duration-200 ${
              option.value === ''
                ? 'text-gray-500 cursor-default'
                : 'text-[#f18f34] hover:bg-[#f18f34] hover:text-white cursor-pointer'
            } ${index !== options.length - 1 ? 'border-b border-[#f18f34]/30' : ''}`}
            style={{
              fontFamily: 'Agency FB, sans-serif',
              animationDelay: `${index * 50}ms`,
              animation: isOpen ? 'slideIn 0.3s ease-out forwards' : 'none',
            }}
          >
            <span className="block transform transition-transform duration-200 hover:translate-x-2">
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* Glow */}
      {isOpen && (
        <div className="absolute inset-0 -z-10 bg-[#f18f34]/20 blur-xl rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
