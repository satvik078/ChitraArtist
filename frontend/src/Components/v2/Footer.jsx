import { motion } from 'framer-motion';
import { Mail, Instagram, Twitter, Globe } from 'lucide-react';

const colors = {
  background: '#0A0A0A',
  textPrimary: '#F5F5F0',
  accent: '#E6C989',
};

export default function Footer({ artist }) {
  const socialLinks = artist?.socialLinks || {};

  return (
    <footer id="contact" className="py-12 px-4 border-t" style={{ borderColor: 'rgba(245, 245, 240, 0.1)' }}>
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.instagram && (
              <a
                href={`https://instagram.com/${socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                style={{ color: colors.textPrimary }}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="transition-transform hover:scale-110"
                style={{ color: colors.textPrimary }}
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={`https://twitter.com/${socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                style={{ color: colors.textPrimary }}
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {socialLinks.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                style={{ color: colors.textPrimary }}
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Copyright */}
          <p
            className="text-sm"
            style={{ color: colors.textPrimary, fontFamily: 'Inter, sans-serif', opacity: 0.6 }}
          >
            © {new Date().getFullYear()} {artist?.displayName || 'Artist'}. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}

