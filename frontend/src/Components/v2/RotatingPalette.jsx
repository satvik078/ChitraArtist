import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

export default function RotatingPalette() {
  return (
    <div className="w-full py-16 flex items-center justify-center bg-[#0A0A0A]">
      <motion.div
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative"
      >
        <Palette className="w-16 h-16 text-[#E6C989]" strokeWidth={1.5} />
        
        {/* Decorative circles around the palette */}
        <motion.div
          className="absolute -inset-8 rounded-full border-2 border-[#E6C989]/20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -inset-12 rounded-full border border-[#E6C989]/10"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.05, 0.2]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </motion.div>
    </div>
  );
}
