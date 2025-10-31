import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Trash2, ExternalLink, Settings, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { artAPI } from '../utils/api';
import UploadSection from '../Components/UploadSection';

const MyDashboard = () => {
  const { artist } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [artworkLimit, setArtworkLimit] = useState({ limit: 100, remaining: 100, canUploadMore: true });

  const portfolioUrl = `${window.location.origin}/artist/${artist?.username}`;

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await artAPI.getMyArt();
      setArtworks(response.data.artworks);
      // Update limit info if provided by backend
      if (response.data.limit !== undefined) {
        setArtworkLimit({
          limit: response.data.limit,
          remaining: response.data.remaining || 0,
          canUploadMore: response.data.canUploadMore !== false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, publicId) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;

    try {
      await artAPI.delete(id);
      setArtworks(artworks.filter(art => art._id !== id));
      // Refresh to update limit counter
      fetchArtworks();
    } catch (error) {
      alert('Failed to delete artwork');
      console.error(error);
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchArtworks();
  };

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {artist?.displayName}!</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Portfolio Link Card */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Portfolio Link</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={portfolioUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
            />
            <button
              onClick={copyPortfolioLink}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {copiedLink ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {showUpload ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Upload New Artwork</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            <UploadSection onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <button
            onClick={() => {
              if (!artworkLimit.canUploadMore) {
                alert(`You have reached the maximum limit of ${artworkLimit.limit} artworks. Please delete some artworks before uploading new ones.`);
                return;
              }
              setShowUpload(true);
            }}
            disabled={!artworkLimit.canUploadMore}
            className={`w-full bg-white border-2 border-dashed rounded-lg p-8 mb-8 transition-colors group ${
              artworkLimit.canUploadMore
                ? 'border-purple-300 hover:border-purple-500 cursor-pointer'
                : 'border-gray-300 opacity-50 cursor-not-allowed'
            }`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-3 ${
              artworkLimit.canUploadMore
                ? 'text-purple-400 group-hover:text-purple-600'
                : 'text-gray-400'
            }`} />
            <p className={`text-lg font-semibold group-hover:text-purple-600 ${
              artworkLimit.canUploadMore ? 'text-gray-700' : 'text-gray-400'
            }`}>
              {artworkLimit.canUploadMore ? 'Upload New Artwork' : 'Upload Limit Reached'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {artworkLimit.canUploadMore
                ? 'Click to add a new piece to your portfolio'
                : `Maximum ${artworkLimit.limit} artworks allowed. Delete some to upload more.`}
            </p>
          </button>
        )}

        {/* Artworks Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              My Artworks ({artworks.length})
            </h2>
            <div className="text-sm text-gray-600">
              <span className={artworkLimit.remaining === 0 ? 'text-red-600 font-semibold' : ''}>
                {artworkLimit.remaining} of {artworkLimit.limit} slots remaining
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your artworks...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No artworks yet</p>
            <p className="text-gray-500 text-sm">Upload your first artwork to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork._id}
                className="bg-white rounded-lg shadow-md overflow-hidden group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  <img
                    src={artwork.url}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(artwork._id, artwork.publicId)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg"
                      title="Delete artwork"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {!artwork.isPublic && (
                    <div className="absolute top-2 left-2">
                      <span className="px-3 py-1 bg-gray-900/80 text-white text-xs rounded-full">
                        Private
                      </span>
                    </div>
                  )}
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
    </div>
  );
};

export default MyDashboard;
