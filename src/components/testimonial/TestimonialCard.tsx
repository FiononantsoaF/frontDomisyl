import React from 'react';

interface TestimonialCardProps {
  file_path: string;
  is_active?: boolean;
  
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ file_path, is_active }) => {
  return (
    <div className="p-2 flex flex-col relative group">
      {is_active !== undefined && (
        <span
          className={`absolute top-2 left-2 px-2 py-1 rounded text-white text-sm font-bold ${
            is_active ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {is_active ? '✔' : '✖'}
        </span>
      )}

      <div className="h-48 overflow-hidden rounded shadow-md">
        <img
          src={file_path}
          alt="Témoignage"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default TestimonialCard;
