import { Link } from 'react-router-dom';
import { Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Logo({ className = '', asLink = true, to = '/', iconSize = 'w-7 h-7', textSize = 'text-xl' }) {
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <Palette className={`${iconSize} text-purple-600`} />
      </motion.div>
      <span className={`${textSize} font-bold text-purple-600`}>ChitraArtist</span>
    </div>
  );

  if (asLink) {
    return (
      <Link to={to} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

