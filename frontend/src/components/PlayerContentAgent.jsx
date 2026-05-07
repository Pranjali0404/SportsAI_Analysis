import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Sparkles, Trophy, Zap, ImageOff } from 'lucide-react';
import { playerService } from '../services/api';

const SUGGESTED_PLAYERS = [
  'Virat Kohli', 'LeBron James', 'Cristiano Ronaldo', 'Lionel Messi',
  'Novak Djokovic', 'Neymar Jr', 'Roger Federer', 'MS Dhoni',
];

const PlayerContentAgent = ({ user }) => {
  const [playerName, setPlayerName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const handleGenerate = async (name = playerName) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsGenerating(true);
    setResult(null);
    setError(null);
    setImgError(false);
    setPlayerName(trimmed);

    try {
      const data = await playerService.generatePlayerContent(trimmed, user?.id || null);
      setResult(data);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Could not generate player content. Check backend connectivity.';
      setError(detail);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary-500/20 text-primary-400">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Player Content Agent</h3>
            <p className="text-sm text-slate-400">AI-powered player profiles with live stats &amp; Wikipedia photos</p>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}
          className="relative mt-2"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            id="player-search-input"
            type="text"
            placeholder="Enter any player name (e.g., Virat Kohli, LeBron James)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="search-input w-full pl-12 pr-40 py-4 rounded-2xl text-white placeholder-slate-500"
          />
          <button
            id="player-generate-btn"
            type="submit"
            disabled={isGenerating || !playerName.trim()}
            className="btn-primary absolute right-2 top-2 bottom-2 px-6 rounded-xl text-white font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap size={16} />
                Generate
              </>
            )}
          </button>
        </form>

        {/* Suggested Players */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Quick picks</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PLAYERS.map((p) => (
              <button
                key={p}
                id={`suggested-${p.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleGenerate(p)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-primary-500/20 hover:border-primary-500/40 hover:text-primary-300 transition-all disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-12 flex flex-col items-center justify-center text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-400/30">
                <User className="text-primary-400" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Researching <span className="text-primary-400">{playerName}</span>...
            </h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm">
              AI agents are gathering career stats, recent form, and fetching photo from Wikipedia.
            </p>
            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-400"
                  style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isGenerating && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 border border-red-500/20 bg-red-500/5 text-center"
          >
            <p className="text-red-400 font-medium">⚠️ {error}</p>
          </motion.div>
        )}

        {/* Result Card */}
        {result && !isGenerating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Player Photo Card */}
            <div className="glass-panel p-6 flex flex-col items-center text-center lg:col-span-1">
              <div className="relative mb-4">
                {result.image_url && !imgError ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full" />
                    <img
                      src={result.image_url}
                      alt={result.player_name}
                      className="relative z-10 w-40 h-40 rounded-2xl object-cover border-2 border-white/10 shadow-2xl"
                      onError={() => setImgError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <ImageOff size={36} />
                    <span className="text-xs">Photo unavailable</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mt-2">{result.player_name}</h2>

              {result.image_url && !imgError && (
                <span className="mt-2 px-3 py-1 rounded-full text-xs bg-green-500/15 text-green-400 border border-green-500/20">
                  📷 Photo via Wikipedia
                </span>
              )}

              <div className="mt-4 w-full pt-4 border-t border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Generated</p>
                <p className="text-xs text-slate-400">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 w-full">
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <Trophy size={14} className="text-primary-400" />
                  <span className="text-xs text-primary-300 font-medium">AI-Powered Profile</span>
                </div>
              </div>
            </div>

            {/* AI Report */}
            <div className="glass-panel p-8 lg:col-span-2">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <span className="status-badge bg-green-500/20 text-green-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Profile Generated
                </span>
                <span className="text-xs text-slate-500">Powered by Tavily + Groq AI</span>
              </div>
              <div className="report-markdown prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: () => null, // images handled in left card
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-white mb-3">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-primary-300 mt-6 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h3>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">{children}</strong>
                    ),
                    li: ({ children }) => (
                      <li className="text-slate-300 leading-relaxed">{children}</li>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate-300 leading-relaxed mb-3">{children}</p>
                    ),
                  }}
                >
                  {result.report}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !isGenerating && !error && (
        <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
            <User size={36} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No player selected yet</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Search for any athlete above or pick from the quick suggestions to generate an AI-powered performance profile with their photo.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerContentAgent;
