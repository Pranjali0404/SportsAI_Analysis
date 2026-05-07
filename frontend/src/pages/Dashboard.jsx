import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  History,
  Search,
  Settings,
  LogOut,
  Send,
  Trophy,
  Activity,
  Clock,
  ChevronRight,
  User,
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { analysisService } from "../services/api";

// Components
import PlayerContentAgent from "../components/PlayerContentAgent";
import HistoryView from "../components/HistoryView";
import SettingsView from "../components/SettingsView";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'performance', 'history', 'settings'

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchHistory(parsedUser.id);
  }, [navigate]);

  const fetchHistory = async (userId) => {
    try {
      const data = await analysisService.getHistory(userId);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query.trim() || !user) return;

    setIsAnalyzing(true);
    setReport(null);

    try {
      const data = await analysisService.analyze(user.id, query);
      setReport(data.result);
      fetchHistory(user.id);
    } catch (err) {
      console.error("Analysis failed:", err);
      // Extracts detailed error message from the response if available
      const detail = err.response?.data?.detail || "Could not complete analysis. Check backend connectivity.";
      setReport(`Error: ${detail}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'player':
        return <PlayerContentAgent user={user} />;
      case 'history':
        return <HistoryView history={history} onSelect={(item) => {
          setReport(item.result);
          setQuery(item.query);
          setActiveTab('analysis');
        }} />;
      case 'settings':
        return <SettingsView user={user} />;
      case 'analysis':
      default:
        return (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analysis Form & Result */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6">
                <form onSubmit={handleAnalyze} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Ask any sports question (e.g., India vs Australia)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input w-full pl-12 pr-32 py-4 rounded-2xl text-white placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="btn-primary absolute right-2 top-2 bottom-2 px-6 rounded-xl text-white font-semibold flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Analyze
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <AnimatePresence mode="wait">
                {isAnalyzing && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-panel p-12 flex flex-col items-center justify-center text-center"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full pulse" />
                      <Activity className="text-primary-400 relative z-10" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Analyzing Data...</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">
                      Our AI agents are gathering real-time statistics and generating your report.
                    </p>
                  </motion.div>
                )}

                {report && !isAnalyzing && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8"
                  >
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/5">
                      <span className="status-badge bg-green-500/20 text-green-400">Analysis Complete</span>
                      <button className="text-primary-400 text-sm font-medium hover:underline">Download Markdown</button>
                    </div>
                    <div className="report-markdown prose prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          img: ({ node, ...props }) => (
                            <div className="my-4">
                              <img
                                {...props}
                                className="player-image rounded-xl border-2 border-white/5 shadow-2xl"
                                style={{ maxWidth: '240px', height: 'auto', display: 'block' }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.style.display = 'none';
                                }}
                              />
                            </div>
                          )
                        }}
                      >
                        {report}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar / Recent History */}
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Clock size={18} className="text-primary-400" />
                  Recent History
                </h3>
                <div className="space-y-4">
                  {history.length > 0 ? history.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setReport(item.result);
                        setQuery(item.query);
                      }}
                      className="group p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-200 line-clamp-1 group-hover:text-primary-400 transition-colors">
                          {item.query}
                        </p>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-primary-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 text-center py-4 italic">No history yet</p>
                  )}
                  {history.length > 5 && (
                    <button
                      onClick={() => setActiveTab('history')}
                      className="w-full py-2 text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium text-center border-t border-white/5 mt-2 pt-4"
                    >
                      View All History
                    </button>
                  )}
                </div>
              </div>

              <div className="glass-panel p-6 bg-gradient-to-br from-primary-600/20 to-transparent">
                <h3 className="text-lg font-semibold mb-2 text-white">Pro Tip</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Try asking for specific player matchups or team defensive transitions for more detailed AI insights.
                </p>
              </div>
            </div>
          </section>
        );
    }
  };

  const navItems = [
    { id: 'analysis', label: 'Analysis', icon: LayoutDashboard },
    { id: 'player', label: 'Player Performance', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-primary-500 p-2 rounded-lg text-white">
            <Trophy size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Sportlytics</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 text-left ${activeTab === item.id
                ? "bg-primary-500/10 text-primary-400 font-semibold border border-primary-500/10 shadow-lg shadow-primary-500/5"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
            >
              <item.icon size={20} className={activeTab === item.id ? "animate-pulse" : ""} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-left group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-slate-400">Welcome back, {user?.username || 'User'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-slate-800 p-2.5 rounded-full border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;

