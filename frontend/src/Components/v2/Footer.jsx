import { motion } from 'framer-motion';
import { Mail, Instagram } from 'lucide-react';

export default function Footer({ artist }) {
  const socialLinks = artist?.socialLinks || {};

  return (
    <footer id="contact" className="py-12 w-full px-4 border-t border-[#F8F7F3]/10 bg-[#0A0A0A]">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.instagram && (
              <a
                href={`https://instagram.com/${socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 text-[#F8F7F3] hover:text-[#E6C989]"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="transition-transform hover:scale-110 text-[#F8F7F3] hover:text-[#E6C989]"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Copyright */}
          <p
            className="text-sm text-[#F8F7F3] opacity-60"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            © {new Date().getFullYear()} {artist?.displayName || artist?.name || 'Artist'}. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
