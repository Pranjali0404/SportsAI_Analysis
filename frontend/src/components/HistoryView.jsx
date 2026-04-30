import React from 'react';
import { Clock, Search, ChevronRight, Hash, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryView = ({ history, onSelect }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Clock className="text-primary-400" size={28} />
          Analysis History
        </h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search queries..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.length > 0 ? history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(item)}
            className="glass-panel p-5 group flex items-center justify-between hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                <Hash size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-medium text-lg leading-tight group-hover:text-primary-400 transition-colors">
                  {item.query}
                </h4>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Report
              </span>
              <ChevronRight size={20} className="text-slate-600 group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        )) : (
          <div className="glass-panel p-20 flex flex-col items-center justify-center text-center opacity-60">
            <Clock size={48} className="text-slate-600 mb-4" />
            <p className="text-xl text-slate-400">No analysis records found yet.</p>
            <p className="text-sm text-slate-500 mt-2">Start your first analysis to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
