import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Logo';

export default function Header({ onMenuClick, isMenuOpen }) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#0A0A0A]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo - Left */}
      <motion.div
        whileHover={{ scale: 1.05 }}
      >
        <Logo className="text-xl" iconSize="w-6 h-6" textSize="text-xl" />
      </motion.div>

      {/* Art Gallery - Center */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold uppercase tracking-wider hidden md:block"
        style={{ fontFamily: 'Cinzel, serif', color: '#F8F7F3', letterSpacing: '0.15em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ART GALLERY
      </motion.div>

      {/* Hamburger Menu - Right */}
      <button
        onClick={onMenuClick}
        className="p-2 text-[#F8F7F3] hover:opacity-70 transition-opacity"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.header>
  );
}
