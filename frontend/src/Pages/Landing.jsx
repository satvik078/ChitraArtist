import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Users, Sparkles } from 'lucide-react';
import { artistAPI } from '../utils/api';

const Landing = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await artistAPI.getAll();
        setArtists(response.data.artists);
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Palette className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            ChitraArtist
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal art portfolio platform. Create, share, and showcase your artwork with the world. 
            Get your own portfolio page in seconds!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/signup"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Create Your Portfolio
            </Link>
            <Link
              to="/login"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-purple-600"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Artists Love Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Own Page</h3>
              <p className="text-gray-600">
                Get yoursite.com/artist/yourname - Share one link to showcase all your work
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Management</h3>
              <p className="text-gray-600">
                Upload, update, and delete your artwork anytime from your dashboard
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Free</h3>
              <p className="text-gray-600">
                No hidden costs. Create your portfolio and start sharing immediately
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Artists
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading artists...</p>
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Be the first artist to join!</p>
              <Link
                to="/signup"
                className="inline-block mt-4 text-purple-600 hover:text-purple-700 font-semibold"
              >
                Create your portfolio →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <Link
                  key={artist._id}
                  to={`/artist/${artist.username}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    {artist.profileImage ? (
                      <img
                        src={artist.profileImage}
                        alt={artist.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl font-bold text-purple-300">
                        {artist.displayName?.[0]?.toUpperCase() || 'A'}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                      {artist.displayName}
                    </h3>
                    <p className="text-sm text-gray-500">@{artist.username}</p>
                    {artist.artworkCount !== undefined && (
                      <p className="text-sm text-gray-600 mt-2">
                        {artist.artworkCount} artwork{artist.artworkCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Share Your Art?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join artists worldwide and create your free portfolio in minutes
          </p>
          <Link
            to="/signup"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
