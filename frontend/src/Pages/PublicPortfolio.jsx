import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Mail, Instagram, Twitter, Globe } from 'lucide-react';
import { artistAPI } from '../utils/api';

const PublicPortfolio = () => {
  const { username } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await artistAPI.getByUsername(username);
        setArtist(response.data.artist);
        setArtworks(response.data.artworks);
      } catch (err) {
        setError(err.response?.data?.message || 'Artist not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artist Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Artist Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/50">
              {artist.profileImage ? (
                <img
                  src={artist.profileImage}
                  alt={artist.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl font-bold text-white">
                  {artist.displayName?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{artist.displayName}</h1>
              <p className="text-xl opacity-90 mb-4">@{artist.username}</p>
              {artist.bio && (
                <p className="text-lg opacity-95 mb-6 max-w-2xl">{artist.bio}</p>
              )}

              {/* Social Links */}
              {artist.socialLinks && Object.values(artist.socialLinks).some(link => link) && (
                <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                  {artist.socialLinks.website && (
                    <a
                      href={artist.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {artist.socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${artist.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  {artist.socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${artist.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  {artist.socialLinks.email && (
                    <a
                      href={`mailto:${artist.socialLinks.email}`}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Contact
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Gallery */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Artworks ({artworks.length})
          </h2>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg">No artworks yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={artwork.url}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{artwork.title}</h3>
                  {artwork.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {artwork.description}
                    </p>
                  )}
                  {artwork.category && (
                    <span className="inline-block px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      {artwork.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>
            Powered by <Link to="/" className="text-purple-600 hover:text-purple-700 font-semibold">ChitraArtist</Link>
          </p>
          <p className="text-sm mt-2">
            <Link to="/signup" className="hover:text-purple-600">Create your own portfolio</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;
