
import React, { useState, useCallback, useEffect } from 'react';
import { AVAILABLE_GENRES, MediaItem } from './types';
import { getRecommendations } from './geminiService';
import GenreButton from './components/GenreButton';
import RecommendationCard from './components/RecommendationCard';
import DetailModal from './components/DetailModal';
import { Search, Clapperboard, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

const LOADING_MESSAGES = [
  "Dimming the lights...",
  "Popping the popcorn...",
  "Scanning the global archives...",
  "Consulting the critics...",
  "Finding official high-res posters...",
  "Verifying direct streaming links...",
  "Almost showtime...",
  "Finalizing your personalized watchlist..."
];

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    let interval: number | undefined;
    if (loading) {
      setLoadingMessageIndex(0);
      interval = window.setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput && selectedGenres.length === 0) return;

    setLoading(true);
    setError(null);
    setRecommendations([]); // Clear existing results while searching
    
    try {
      const results = await getRecommendations(userInput, selectedGenres);
      setRecommendations(results);
    } catch (err) {
      setError("Failed to fetch recommendations. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="py-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Clapperboard className="w-10 h-10 text-indigo-500" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            CineMatch AI
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
          Your personal cinematic guide. Mix and match genres to discover your next obsession.
        </p>
      </header>

      <main className="space-y-12">
        <section className="glass rounded-[2rem] p-6 md:p-10 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="What are you in the mood for? (e.g., 'Mystery like Knives Out')"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg placeholder:text-slate-600"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 ml-1">
                  Genre Filter
                </h3>
                {selectedGenres.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => setSelectedGenres([])}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_GENRES.map(genre => (
                  <GenreButton
                    key={genre}
                    genre={genre}
                    isActive={selectedGenres.includes(genre)}
                    onClick={() => toggleGenre(genre)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading || (!userInput && selectedGenres.length === 0)}
                className="group relative px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3 overflow-hidden min-w-[240px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="animate-pulse">Curating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    <span>Find My Match</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section>
          {error && (
            <div className="flex items-center justify-center gap-2 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mb-8">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              <div className="relative">
                <Clapperboard className="w-20 h-20 text-indigo-500 animate-bounce" />
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse -z-10" />
              </div>
              <div className="text-center space-y-3 max-w-md mx-auto h-24">
                <p key={loadingMessageIndex} className="text-2xl font-bold text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </p>
                <div className="flex justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Locating official metadata and direct streaming links
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!loading && recommendations.map((item) => (
              <RecommendationCard 
                key={item.id} 
                item={item} 
                onClick={(it) => setSelectedMedia(it)}
              />
            ))}
          </div>

          {!loading && recommendations.length === 0 && !error && (
            <div className="text-center py-24 opacity-20 select-none">
              <Clapperboard className="w-24 h-24 mx-auto mb-6" />
              <p className="text-2xl italic font-light tracking-wide">The theater is empty.</p>
              <p className="text-sm mt-2">Enter a mood or mix genres to see results.</p>
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {selectedMedia && (
        <DetailModal 
          item={selectedMedia} 
          onClose={() => setSelectedMedia(null)} 
        />
      )}

      <footer className="mt-20 py-8 border-t border-slate-800/50 text-center text-slate-600 text-sm">
        <p>CineMatch AI &bull; Official High-Resolution Assets &bull; Powered by Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
