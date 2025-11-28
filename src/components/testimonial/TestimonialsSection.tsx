import React, { useEffect, useState, useRef } from 'react';
import { testimonial, Testimonial } from '../../api/testimonial';
import TestimonialCard from './TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonial.getAll();
        if (response.success) {
          setTestimonials(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des témoignages :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) return <p className="text-center py-10">Chargement...</p>;
  const showArrows = testimonials.length > 3;
  return (
    <section id="temoignage" className="py-10 px-4 bg-white">
      <div className="max-w-5xl mx-auto mb-6">
        <h2
          className="text-4xl text-center mb-4 text-[#1d1d1b]"
          style={{ fontFamily: 'Agency FB, sans-serif' }}
        >
          Témoignages clients
        </h2>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Flèches visibles uniquement si plus de 5 témoignages et pas sur mobile */}
        {showArrows && (
          <>
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Conteneur scrollable */}
        <div
          ref={containerRef}
          className="
            flex flex-row 
            overflow-x-auto 
            gap-6 scrollbar-hide scroll-smooth 
            px-4 snap-x snap-mandatory
          "
          style={{  height: '35vh' }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="
                flex-shrink-0 
                w-[90%] sm:w-[280px] 
                snap-center
              "
            >
              <TestimonialCard
                file_path={t.file_path}
                is_active={t.is_active}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
