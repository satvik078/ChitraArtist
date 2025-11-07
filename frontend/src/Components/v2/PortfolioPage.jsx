import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { artistAPI } from '../../utils/api';
import Header from './Header';
import NavOverlay from './NavOverlay';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import GallerySection from './GallerySection';
import Footer from './Footer';

const colors = {
  background: '#0A0A0A',
  textPrimary: '#F5F5F0',
  accent: '#E6C989',
};

export default function PortfolioPageV2() {
  const { username } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await artistAPI.getByUsername(username);
        if (!isMounted) return;
        
        setArtist(response.data.artist);
        setArtworks(response.data.artworks || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Artist not found');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [username]);

  // Map artist data to match expected format
  const artistData = artist ? {
    name: artist.displayName,
    displayName: artist.displayName,
    designation: artist.bio ? artist.bio.split('.')[0] + '.' : 'Visual Artist',
    bio: artist.bio || '',
    education: artist.education || 'Self-taught Artist',
    medium: artist.medium || 'Digital & Traditional Media',
    portrait: artist.profileImage,
    profileImage: artist.profileImage,
    socialLinks: artist.socialLinks,
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.accent }}></div>
          <p style={{ color: colors.textPrimary, fontFamily: 'Inter, sans-serif' }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: colors.background }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'Playfair Display, serif' }}>
            Artist Not Found
          </h1>
          <p style={{ color: colors.textPrimary, fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: colors.background }}>
      {/* Persistent Header */}
      <Header onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

      {/* Navigation Overlay */}
      <NavOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Hero Section */}
      <HeroSection artist={artistData} />

      {/* About Section */}
      <AboutSection artist={artistData} />

      {/* Gallery Section */}
      <GallerySection artworks={artworks} />

      {/* Footer */}
      <Footer artist={artistData} />
    </div>
  );
}
