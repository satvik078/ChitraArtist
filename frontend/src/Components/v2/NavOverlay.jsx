import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const colors = {
  background: '#0A0A0A',
  textPrimary: '#F5F5F0',
  accent: '#E6C989',
};

export default function NavOverlay({ isOpen, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const navLinks = [
    { to: '#home', label: 'Home' },
    { to: '#about', label: 'About' },
    { to: '#gallery', label: 'Gallery' },
    { to: '#contact', label: 'Contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay Panel */}
          <motion.nav
            className="fixed left-0 top-0 bottom-0 w-80 z-[70] px-8 py-20"
            style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(20px)' }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <ul className="space-y-6">
              {navLinks.map((link, idx) => (
                <motion.li
                  key={link.to}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <a
                    href={link.to}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector(link.to);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      onClose();
                    }}
                    className="block text-2xl font-medium transition-colors hover:opacity-70"
                    style={{ color: colors.textPrimary, fontFamily: 'Playfair Display, serif' }}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

