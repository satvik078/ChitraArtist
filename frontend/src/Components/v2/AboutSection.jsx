import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const colors = {
  background: '#0A0A0A',
  textPrimary: '#F5F5F0',
  accent: '#E6C989',
};

export default function AboutSection({ artist }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const displayName = artist?.displayName || 'Artist';
  const bio = artist?.bio || 'An independent artist exploring visuals and narrative through color, form and light.';
  const education = artist?.education || 'Self-taught Artist';
  const medium = artist?.medium || 'Digital & Traditional Media';
  const aboutImage = artist?.profileImage || null;

  return (
    <section id="about" ref={ref} className="py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {aboutImage ? (
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a]">
                <img
                  src={aboutImage}
                  alt={`${displayName} - About`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div 
                className="aspect-[4/3] rounded-lg flex items-center justify-center text-6xl font-bold"
                style={{ background: '#1a1a1a', color: colors.accent, fontFamily: 'Playfair Display, serif' }}
              >
                {displayName[0]?.toUpperCase() || 'A'}
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: colors.textPrimary, fontFamily: 'Playfair Display, serif' }}
            >
              About {displayName}
            </h2>
            <div className="space-y-4" style={{ color: colors.textPrimary, fontFamily: 'Inter, sans-serif' }}>
              <p className="text-lg leading-relaxed opacity-90">
                {bio}
              </p>
              <div className="space-y-2 pt-4">
                <p className="opacity-80">
                  <span style={{ color: colors.accent }}>Education:</span> {education}
                </p>
                <p className="opacity-80">
                  <span style={{ color: colors.accent }}>Medium:</span> {medium}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

