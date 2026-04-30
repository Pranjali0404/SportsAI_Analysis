import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { Trophy, TrendingUp, Users, Target } from 'lucide-react';

const scoringData = [
  { name: 'Game 1', team: 102, opponent: 95 },
  { name: 'Game 2', team: 115, opponent: 110 },
  { name: 'Game 3', team: 98, opponent: 105 },
  { name: 'Game 4', team: 121, opponent: 114 },
  { name: 'Game 5', team: 110, opponent: 112 },
  { name: 'Game 6', team: 125, opponent: 118 },
  { name: 'Game 7', team: 132, opponent: 124 },
];

const teamStatsData = [
  { subject: 'Offense', A: 120, B: 110, fullMark: 150 },
  { subject: 'Defense', A: 98, B: 130, fullMark: 150 },
  { subject: 'Speed', A: 86, B: 130, fullMark: 150 },
  { subject: 'Teamwork', A: 99, B: 100, fullMark: 150 },
  { subject: 'Stamina', A: 85, B: 90, fullMark: 150 },
  { subject: 'Strategy', A: 65, B: 85, fullMark: 150 },
];

const comparisonData = [
  { name: 'Assists', team: 25, average: 20 },
  { name: 'Rebounds', team: 42, average: 40 },
  { name: 'Steals', team: 8, average: 7 },
  { name: 'Blocks', team: 5, average: 4 },
  { name: 'Turnovers', team: 12, average: 15 },
];

const PerformanceCharts = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Points', value: '114.7', icon: Trophy, color: 'text-primary-400' },
          { label: 'Win Rate', value: '71%', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Team PSR', value: '92.4', icon: Users, color: 'text-blue-400' },
          { label: 'Efficiency', value: '+8.4', icon: Target, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scoring Trend */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <TrendingUp size={18} className="text-primary-400" />
            Scoring Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoringData}>
                <defs>
                  <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="team" stroke="#6366f1" fillOpacity={1} fill="url(#colorTeam)" strokeWidth={3} />
                <Area type="monotone" dataKey="opponent" stroke="#94a3b8" fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Attributes Radar */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <Target size={18} className="text-primary-400" />
            Team Attributes Comparison
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamStatsData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                <Radar name="Team A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Radar name="League Avg" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Bar Chart */}
        <div className="glass-panel p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <Users size={18} className="text-primary-400" />
            Key Efficiency Metrics
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="team" fill="#6366f1" radius={[4, 4, 0, 0]} name="Our Team" />
                <Bar dataKey="average" fill="#334155" radius={[4, 4, 0, 0]} name="League Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
