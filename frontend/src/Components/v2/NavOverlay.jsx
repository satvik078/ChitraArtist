import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
    { to: '/', label: 'Home', isRoute: true },
    { to: '#about', label: 'About', isRoute: false },
    { to: '#gallery', label: 'Gallery', isRoute: false },
    { to: '/competition', label: 'Competition', isRoute: true },
    { to: '#contact', label: 'Contact', isRoute: false },
    { to: '/login', label: 'Login', isRoute: true },
    { to: '/signup', label: 'Signup', isRoute: true },
  ];

  const handleLinkClick = (link, isRoute) => {
    if (!isRoute) {
      const el = document.querySelector(link);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] backdrop-blur-md bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay Panel */}
          <motion.nav
            className="fixed left-0 top-0 bottom-0 w-80 z-[70] px-8 py-20 bg-[#0A0A0A]"
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
                  {link.isRoute ? (
                    <Link
                      to={link.to}
                      onClick={() => handleLinkClick(link.to, true)}
                      className="block text-[1.75rem] font-medium transition-opacity hover:opacity-70"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#E6C989' }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.to}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.to, false);
                      }}
                      className="block text-[1.75rem] font-medium transition-opacity hover:opacity-70"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#E6C989' }}
                    >
                      {link.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
