import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { artistAPI } from '../utils/api';
import Header from '../components/v2/Header';
import NavOverlay from '../components/v2/NavOverlay';
import HeroSection from '../components/v2/HeroSection';
import AboutSection from '../components/v2/AboutSection';
import GallerySection from '../components/v2/GallerySection';
import RotatingPalette from '../components/v2/RotatingPalette';
import Footer from '../components/v2/Footer';

export default function ArtistPortfolio() {
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
    bio: artist.bio || `I am ${artist.displayName}, a lifelong devotee of Shri Krishna and a passionate artist exploring the divine through my creations.`,
    education: artist.education || 'Self-taught Artist',
    medium: artist.medium || 'Digital & Traditional Media',
    portrait: artist.profileImage,
    profileImage: artist.profileImage,
    socialLinks: artist.socialLinks || {},
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6C989] mx-auto mb-4"></div>
          <p className="text-[#F8F7F3]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0A0A] w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#F8F7F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Artist Not Found
          </h1>
          <p className="text-[#F8F7F3] opacity-70" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0A0A0A]">
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

      {/* Rotating Palette Icon */}
      <RotatingPalette />

      {/* Footer */}
      <Footer artist={artistData} />
    </div>
  );
}

