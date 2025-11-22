import React from 'react';
import { AnalysisResult } from '../types';
import { Sparkles, Quote, Award, RefreshCw } from 'lucide-react';

interface AnalysisCardProps {
  data: AnalysisResult | null;
  isLoading: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8 w-full max-w-2xl p-8 rounded-2xl border flex flex-col items-center justify-center min-h-[200px] backdrop-blur-md
        bg-white/30 dark:bg-white/5 border-white/40 dark:border-white/10">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
            <Sparkles className="relative w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-spin duration-[3s]" />
        </div>
        <p className="mt-4 font-medium tracking-wide text-sm uppercase animate-pulse text-slate-500 dark:text-slate-400">Consulting Gemini AI...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mt-8 w-full max-w-2xl relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
       {/* Ambient Glow */}
       <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>

      <div className="relative backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl border transition-colors duration-500
        bg-white/80 dark:bg-black/40 border-white/60 dark:border-white/10">
        
        {/* Header */}
        <div className="relative p-6 border-b border-black/5 dark:border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-none">Vibe Check</h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider opacity-80">
                    {data.vibe}
                  </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-0.5">Coolness</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${data.score}%` }}></div>
                </div>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{data.score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Bio Section */}
          <div className="relative pl-4 border-l-2 border-indigo-500/30 dark:border-indigo-500/50">
              <p className="text-slate-700 dark:text-slate-300 text-lg font-light italic leading-relaxed">
                "{data.bio}"
              </p>
          </div>

          {/* Suggestions Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" />
              Refined Variants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.suggestions.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => navigator.clipboard.writeText(suggestion)}
                  className="group relative p-3 rounded-xl transition-all text-center overflow-hidden border
                  bg-slate-50/50 dark:bg-white/5 border-slate-200/50 dark:border-white/5 
                  hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                >
                  <span className="font-mono text-indigo-600 dark:text-indigo-300 font-bold text-sm">{suggestion}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
                    bg-white/90 dark:bg-black/90">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">Copy</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};