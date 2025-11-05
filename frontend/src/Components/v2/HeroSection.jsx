import { motion } from 'framer-motion';

export default function HeroSection({ artist }) {
  const displayName = artist?.displayName || artist?.name || 'Artist';
  const designation = artist?.designation || artist?.bio 
    ? artist.bio.split('.')[0] + '.' 
    : 'Visual Artist & Storyteller';
  const portrait = artist?.profileImage || artist?.portrait || null;

  return (
    <section className="min-h-screen flex items-center justify-center w-full pt-20 px-4 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {/* Artist Portrait */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {portrait ? (
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden bg-[#1a1a1a]">
                <img
                  src={portrait}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            ) : (
              <div 
                className="w-64 h-64 md:w-80 md:h-80 rounded-lg flex items-center justify-center text-8xl font-bold bg-[#1a1a1a]"
                style={{ fontFamily: 'Playfair Display, serif', color: '#E6C989' }}
              >
                {displayName[0]?.toUpperCase() || 'A'}
              </div>
            )}
          </motion.div>

          {/* Name & Designation */}
          <motion.div
            className="order-1 md:order-2 text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-[#F8F7F3]"
              style={{ fontFamily: 'Playfair Display, serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {displayName}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-[#E6C989]"
              style={{ fontFamily: 'Inter, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {designation}
            </motion.p>
            <motion.div
              className="h-1 w-32 mt-6 rounded bg-gradient-to-r from-[#E6C989] to-transparent mx-auto md:mx-0"
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
