import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Award, Star, Target } from 'lucide-react';
import { competitionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CompetitionDashboard = () => {
  const { artist } = useAuth();
  const [competition, setCompetition] = useState(null);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [compRes, rankRes] = await Promise.all([
        competitionAPI.getCurrent(),
        competitionAPI.getMyRank(),
      ]);
      setCompetition(compRes.data.competition);
      setMyRank(rankRes.data);
    } catch (error) {
      console.error('Failed to fetch competition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (rank === 2) return { icon: Award, color: 'text-gray-400', bg: 'bg-gray-100' };
    if (rank === 3) return { icon: Award, color: 'text-orange-500', bg: 'bg-orange-100' };
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading competition...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Weekly Art Competition</h1>
              <p className="text-purple-100 mt-1">
                Week {competition?.week || 'N/A'}
              </p>
            </div>
          </div>
          
          {myRank && (
            <div className="bg-white/20 backdrop-blur rounded-lg p-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Your Current Rank</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold">#{myRank.rank || '—'}</span>
                    {myRank.percentile > 0 && (
                      <span className="text-lg text-purple-100">
                        (Top {myRank.percentile}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-100 text-sm">Total Score</p>
                  <p className="text-3xl font-bold mt-2">{myRank.totalScore.toFixed(1)}</p>
                  <p className="text-purple-100 text-sm mt-1">
                    {myRank.artworkCount} artwork{myRank.artworkCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* My Stats Card */}
        {myRank && myRank.rank && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Your Performance
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Rank</p>
                <p className="text-2xl font-bold text-purple-600">#{myRank.rank}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Score</p>
                <p className="text-2xl font-bold text-blue-600">{myRank.totalScore.toFixed(1)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-green-600">{myRank.averageScore.toFixed(1)}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Artworks</p>
                <p className="text-2xl font-bold text-orange-600">{myRank.artworkCount}</p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-block mt-4 text-purple-600 hover:text-purple-700 font-semibold"
            >
              Upload more artworks to improve your rank →
            </Link>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Leaderboard
          </h2>

          {!competition?.leaderboard || competition.leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No rankings yet. Be the first to upload!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {competition.leaderboard.slice(0, 50).map((entry, index) => {
                const badge = getRankBadge(entry.rank);
                const isMe = artist && entry.artistId?._id === artist.id;
                
                return (
                  <div
                    key={entry.artistId?._id || index}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      isMe
                        ? 'bg-purple-50 border-purple-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 text-center">
                      {badge ? (
                        <div className={`w-10 h-10 rounded-full ${badge.bg} flex items-center justify-center mx-auto`}>
                          <badge.icon className={`w-6 h-6 ${badge.color}`} />
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Artist Info */}
                    <div className="flex-1 flex items-center gap-4">
                      {entry.artistId?.profileImage ? (
                        <img
                          src={entry.artistId.profileImage}
                          alt={entry.artistId.displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                          {entry.artistId?.displayName?.[0]?.toUpperCase() || 'A'}
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/artist/${entry.artistId?.username}`}
                          className="font-bold text-lg text-gray-900 hover:text-purple-600"
                        >
                          {entry.artistId?.displayName || 'Unknown Artist'}
                          {isMe && <span className="ml-2 text-purple-600">(You)</span>}
                        </Link>
                        <p className="text-sm text-gray-500">@{entry.artistId?.username}</p>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-2xl font-bold text-gray-900">
                          {entry.totalScore.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {entry.artworkCount} art • Avg: {entry.averageScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Artworks */}
        {competition?.topArtworks && competition.topArtworks.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-600" />
              Top Artworks This Week
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {competition.topArtworks.slice(0, 8).map((item, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {/* Artwork would be loaded here if we had the artwork data */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                      <Award className="w-12 h-12 text-purple-300" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    #{item.rank}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {item.score?.toFixed(1)} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-bold text-blue-900 mb-2">How It Works</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Each artwork is automatically scored by AI (0-100 points)</li>
            <li>• Scores are based on: Aesthetic, Technical, Creativity, and Composition</li>
            <li>• Your total score = sum of all your artwork scores this week</li>
            <li>• Leaderboard resets every Monday at midnight</li>
            <li>• Top artists get featured on the homepage!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDashboard;

