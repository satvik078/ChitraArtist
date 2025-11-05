import { motion } from 'framer-motion';

const colors = {
  background: '#0A0A0A',
  textPrimary: '#F5F5F0',
  accent: '#E6C989',
};

export default function HeroSection({ artist }) {
  const displayName = artist?.displayName || 'Artist';
  const designation = artist?.bio 
    ? artist.bio.split('.')[0] + '.' 
    : 'Visual Artist & Storyteller';
  const portrait = artist?.profileImage || null;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Portrait */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {portrait ? (
              <div className="aspect-square rounded-lg overflow-hidden bg-[#1a1a1a]">
                <img
                  src={portrait}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            ) : (
              <div 
                className="aspect-square rounded-lg flex items-center justify-center text-8xl font-bold"
                style={{ background: '#1a1a1a', color: colors.accent, fontFamily: 'Playfair Display, serif' }}
              >
                {displayName[0]?.toUpperCase() || 'A'}
              </div>
            )}
          </motion.div>

          {/* Name & Designation */}
          <motion.div
            className="order-1 md:order-2 text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
              style={{ color: colors.textPrimary, fontFamily: 'Playfair Display, serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {displayName}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl"
              style={{ color: colors.accent, fontFamily: 'Inter, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {designation}
            </motion.p>
            <motion.div
              className="h-1 w-32 mt-6 rounded"
              style={{ background: `linear-gradient(90deg, ${colors.accent} 0%, transparent 100%)` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

