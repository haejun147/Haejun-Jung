
import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md welcome-fade">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle accent light */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <Lock className="text-emerald-500" size={28} />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Private Access</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Admin Authentication Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Passcode"
                className={`w-full bg-black border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg p-4 text-center text-sm outline-none focus:border-emerald-500 transition-all tracking-[0.5em] font-bold`}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-[10px] mt-3 text-center uppercase font-bold tracking-widest">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-lg flex items-center justify-center group hover:bg-emerald-500 hover:text-white transition-all text-xs uppercase tracking-[0.2em]"
            >
              Unlock Dashboard
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center text-zinc-600">
             <ShieldCheck size={14} className="mr-2" />
             <span className="text-[10px] uppercase font-bold tracking-widest">End-to-End Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
