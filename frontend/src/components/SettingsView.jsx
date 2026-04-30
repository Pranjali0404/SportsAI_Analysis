import React from 'react';
import { User, Mail, Shield, Bell, Globe, Moon, Sun, Lock } from 'lucide-react';

const SettingsView = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <Shield className="text-primary-400" size={28} />
        Account Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 border border-white/5 bg-white/5 rounded-3xl p-8 text-center flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-900">
                <User size={40} className="text-white opacity-80" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-slate-900" />
          </div>
          <h3 className="text-xl font-bold text-white">{user?.username || 'User'}</h3>
          <p className="text-slate-500 text-sm mt-1">{user?.email || 'user@example.com'}</p>
          <button className="mt-6 w-full bg-primary-500/10 text-primary-400 py-3 rounded-xl font-medium hover:bg-primary-500/20 transition-all border border-primary-500/20">
            Edit Profile
          </button>
        </div>

        {/* Settings Groups */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">General Settings</h4>
            
            {[
              { label: 'Notifications', icon: Bell, checked: true, desc: 'Receive real-time alerts for sports updates' },
              { label: 'Language', icon: Globe, value: 'English (US)', desc: 'Set your preferred display language' },
              { label: 'Dark Mode', icon: Moon, checked: true, desc: 'Switch between light and dark UI themes' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/5 text-slate-400 group-hover:text-primary-400 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                {item.checked !== undefined ? (
                  <div className="w-12 h-6 rounded-full bg-primary-500 flex items-center px-1">
                    <div className="w-4 h-4 rounded-full bg-white ml-auto" />
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 font-medium">{item.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="glass-panel p-6 space-y-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Security</h4>
            
            <div className="flex items-center justify-between py-4 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-white/5 text-slate-400 group-hover:text-red-400 transition-colors">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Update Password</p>
                  <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                </div>
              </div>
              <button className="text-sm font-medium text-primary-400 hover:underline">Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
