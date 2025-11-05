import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function GallerySection({ artworks }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Update index based on scroll progress
  useEffect(() => {
    if (artworks.length === 0) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const newIndex = Math.min(
        Math.floor(latest * artworks.length),
        artworks.length - 1
      );
      if (newIndex >= 0 && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, artworks.length, activeIndex]);

  if (artworks.length === 0) {
    return (
      <section id="gallery" className="py-20 px-4 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#F8F7F3] opacity-70" style={{ fontFamily: 'Inter, sans-serif' }}>
            No artworks yet. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" ref={ref} className="py-20 md:py-32 w-full px-4 relative bg-[#0A0A0A]">
      <motion.div
        className="max-w-7xl mx-auto"
        style={{ opacity }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#F8F7F3]"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Gallery
        </motion.h2>

        {/* Slideshow Container */}
        <div className="relative aspect-[4/3] md:aspect-[16/9] max-w-5xl mx-auto mb-8">
          <AnimatePresence mode="wait">
            {artworks.map((artwork, index) => {
              if (index !== activeIndex) return null;

              return (
                <motion.div
                  key={artwork._id || index}
                  className="absolute inset-0 rounded-lg overflow-hidden bg-[#1a1a1a] group cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.05 }}
                  style={{ transition: 'transform 0.3s ease-in-out' }}
                >
                  <img
                    src={artwork.url}
                    alt={artwork.title || `Artwork ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Dots Indicator */}
          {artworks.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {artworks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'opacity-100' : 'opacity-40'
                  }`}
                  style={{
                    background: index === activeIndex ? '#E6C989' : '#F8F7F3',
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Artwork Info Below Image */}
        <AnimatePresence mode="wait">
          {artworks.map((artwork, index) => {
            if (index !== activeIndex) return null;

            return (
              <motion.div
                key={`info-${artwork._id || index}`}
                className="max-w-5xl mx-auto text-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {artwork.title && (
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-3 text-[#F8F7F3]"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {artwork.title}
                  </h3>
                )}
                {artwork.description && (
                  <p
                    className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-[#F8F7F3] opacity-85"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {artwork.description}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
