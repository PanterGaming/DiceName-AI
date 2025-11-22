import React, { useState, useCallback, useEffect } from 'react';
import { Die } from './components/Die';
import { AnalysisCard } from './components/AnalysisCard';
import { analyzeUsername } from './services/geminiService';
import { AnalysisResult, NameStyle } from './types';
import { Dices, Settings2, Copy, Check, Sparkles, Moon, Sun, Zap, Leaf, Gamepad2, Camera, Smartphone, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MIN_LENGTH = 3;
const MAX_LENGTH = 9;

// Configuration for Name Styles
const STYLE_CONFIG: Record<NameStyle, { label: string, icon: React.ElementType, vowels: string, consonants: string }> = {
  CALM: { 
    label: 'Calm', 
    icon: Leaf, 
    vowels: "AEIOU", 
    consonants: "LMNRSWYZ" // Softer sounds
  },
  EXTREME: { 
    label: 'Extreme', 
    icon: Zap, 
    vowels: "AEIOU", 
    consonants: "KXZVQRJPTG" // Harder sounds
  },
  GAMING: { 
    label: 'Gaming', 
    icon: Gamepad2, 
    vowels: "AEIOU", 
    consonants: "XZKVQWJP" // Edgy letters
  },
  VLOG: { 
    label: 'Vlog', 
    icon: Camera, 
    vowels: "AEIOU", 
    consonants: "BCDFGHJKLMNPQRSTVWXYZ" // Standard
  },
  TECH: { 
    label: 'Tech', 
    icon: Smartphone, 
    vowels: "AEIO", 
    consonants: "XTSNLRCD" // Techy sounds
  },
  RANDOM: { 
    label: 'Random', 
    icon: HelpCircle, 
    vowels: "AEIOU", 
    consonants: "BCDFGHJKLMNPQRSTVWXYZ"
  }
};

const generateStyledName = (length: number, style: NameStyle) => {
  const config = STYLE_CONFIG[style];
  let name = "";
  // Randomly start with Vowel or Consonant
  let useVowel = Math.random() > 0.5;

  for (let i = 0; i < length; i++) {
    if (useVowel) {
      name += config.vowels.charAt(Math.floor(Math.random() * config.vowels.length));
    } else {
      name += config.consonants.charAt(Math.floor(Math.random() * config.consonants.length));
    }
    // Alternate
    useVowel = !useVowel;
  }
  return name;
};

function App() {
  const [length, setLength] = useState<number>(5);
  const [diceValues, setDiceValues] = useState<string[]>(Array(5).fill('?'));
  const [isRolling, setIsRolling] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to True
  const [selectedStyle, setSelectedStyle] = useState<NameStyle>('RANDOM');

  // Sync Dark Mode with HTML Element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle length slider change
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = parseInt(e.target.value);
    setLength(newLength);
    // Reset dice to '?' when resizing
    setDiceValues(prev => {
      const newValues = [...prev];
      if (newLength > prev.length) {
        return [...newValues, ...Array(newLength - prev.length).fill('?')];
      } else {
        return newValues.slice(0, newLength);
      }
    });
    setAnalysis(null);
  };

  const rollDice = useCallback(async () => {
    if (isRolling || isAnalyzing) return;

    // 1. Determine final values immediately based on style
    const sensibleName = generateStyledName(length, selectedStyle);
    const finalValues = sensibleName.split('');

    setDiceValues(finalValues);
    setAnalysis(null);
    setIsRolling(true);

    // 2. "Spin up" phase - Let them all rotate chaotically for a moment
    const SPIN_UP_DURATION = 800; 
    
    // 3. Trigger the sequential stopping
    setTimeout(() => {
      setIsRolling(false);
    }, SPIN_UP_DURATION);

    // 4. Wait for visual sequence to finish before analyzing
    const STAGGER_MS = 200;
    const totalAnimationTime = SPIN_UP_DURATION + (length * STAGGER_MS) + 600;

    setTimeout(async () => {
      setIsAnalyzing(true);
      const result = await analyzeUsername(sensibleName, selectedStyle);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, totalAnimationTime);

  }, [length, isRolling, isAnalyzing, selectedStyle]);

  const handleCopy = () => {
    const name = diceValues.join('');
    if (name.includes('?')) return;
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[#F2F2F7] dark:bg-black text-slate-900 dark:text-slate-100 selection:bg-teal-200 dark:selection:bg-purple-500 font-sans overflow-x-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Orb */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 animate-pulse transition-colors duration-1000
          bg-purple-300 dark:bg-purple-900" />
        
        {/* Top Right Orb */}
        <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-40 transition-colors duration-1000
          bg-teal-200 dark:bg-teal-900/40" />
        
        {/* Bottom Center Orb */}
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-40 transition-colors duration-1000
          bg-indigo-300 dark:bg-indigo-900/40" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300
        bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-white/50 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl text-white shadow-lg shadow-purple-500/20 bg-gradient-to-br from-indigo-500 to-purple-600">
            <Dices className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white/90">DiceName AI</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-300
            bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-400/80 border-black/5 dark:border-white/10">
            <Sparkles className="w-3 h-3 text-teal-500" />
            Powered by Google Gemini
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-20 px-4 sm:px-6 relative z-10">
        
        {/* Hero */}
        <div className="text-center mb-16 max-w-xl relative">
          <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight pb-2 drop-shadow-sm bg-clip-text text-transparent
            bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 
            dark:from-white dark:via-slate-200 dark:to-slate-400">
            Roll your Identity.
          </h2>
          <p className="text-lg leading-relaxed transition-colors duration-300 text-slate-600 dark:text-slate-400">
            Set the length, choose a style, and roll the 3D dice for a unique, pronounceable alias.
          </p>
        </div>

        {/* Dice Container */}
        <div className="w-full max-w-5xl mb-16">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 min-h-[140px] items-center perspective-800 py-8">
              <AnimatePresence mode='popLayout'>
                {diceValues.map((val, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, scale: 0.5, x: -40 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                  >
                    <Die 
                      char={val} 
                      isRolling={isRolling} 
                      index={idx}
                      totalDice={diceValues.length}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Current Name Display */}
            {!isRolling && !diceValues.includes('?') && (
              <div className="mt-12 text-center animate-in fade-in duration-700 slide-in-from-bottom-8 delay-300">
                <button 
                  onClick={handleCopy}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all shadow-xl backdrop-blur-md group
                  bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 text-slate-800 dark:text-white 
                  hover:bg-white/60 dark:hover:bg-white/10 hover:border-teal-400/50 dark:hover:border-teal-500/50 
                  shadow-black/5 dark:shadow-black/20"
                >
                  <span className="font-mono text-3xl tracking-widest font-bold">
                    {diceValues.join('')}
                  </span>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    bg-black/5 dark:bg-white/10 group-hover:bg-teal-500/10 group-hover:text-teal-500">
                      {copied ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4 opacity-60 group-hover:opacity-100" />}
                  </div>
                </button>
              </div>
            )}
        </div>

        {/* Controls Card - Enhanced Liquid Glass */}
        <div className="w-full max-w-2xl relative group">
          {/* Outer Glow */}
          <div className="absolute -inset-1 rounded-3xl opacity-20 blur-lg group-hover:opacity-30 transition duration-1000
            bg-gradient-to-r from-purple-600 to-teal-400" />
          
          <div className="relative p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-2xl border transition-all duration-500
            bg-white/60 dark:bg-gray-900/40 border-white/50 dark:border-white/10">
            
            {/* Styles Selector */}
            <div className="mb-8">
              <label className="block text-sm font-bold uppercase tracking-wider mb-4 pl-1 text-slate-500 dark:text-slate-400">
                Choose Style
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {(Object.keys(STYLE_CONFIG) as NameStyle[]).map((style) => {
                  const config = STYLE_CONFIG[style];
                  const Icon = config.icon;
                  const isSelected = selectedStyle === style;
                  return (
                    <button
                      key={style}
                      onClick={() => !isRolling && setSelectedStyle(style)}
                      disabled={isRolling || isAnalyzing}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border relative overflow-hidden
                        ${isSelected 
                          ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/50 text-indigo-600 dark:text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                          : 'bg-white/40 dark:bg-white/5 border-transparent hover:bg-white/60 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}
                      `}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'stroke-2' : 'stroke-1.5'}`} />
                      <span className="text-[10px] font-bold tracking-widest">{config.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
              {/* Length Slider */}
              <div className="rounded-xl p-4 border transition-colors duration-300
                bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <Settings2 className="w-4 h-4 opacity-70" />
                    Length
                  </label>
                  <span className="px-3 py-1 rounded-lg font-mono text-sm font-bold shadow-sm border transition-colors
                    bg-white dark:bg-black/40 text-slate-800 dark:text-slate-200 border-black/5 dark:border-white/10">
                    {length}
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_LENGTH}
                  max={MAX_LENGTH}
                  value={length}
                  onChange={handleLengthChange}
                  disabled={isRolling || isAnalyzing}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                  bg-slate-300 dark:bg-slate-700 accent-indigo-500 hover:accent-indigo-400"
                />
                <div className="flex justify-between mt-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <span>Min {MIN_LENGTH}</span>
                  <span>Max {MAX_LENGTH}</span>
                </div>
              </div>

              {/* Roll Button */}
              <button
                onClick={rollDice}
                disabled={isRolling || isAnalyzing}
                className="w-full h-[88px] relative group overflow-hidden rounded-xl shadow-xl transition-all 
                bg-slate-900 dark:bg-white text-white dark:text-black 
                shadow-indigo-500/10 hover:scale-[1.02] hover:shadow-indigo-500/20 
                disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:scale-100 active:scale-[0.98]"
              >
                {/* Gradient sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative z-10 flex flex-col items-center justify-center h-full">
                  <span className="text-sm font-medium opacity-70 uppercase tracking-widest mb-1">
                    {isRolling ? 'Generating...' : isAnalyzing ? 'Thinking...' : 'Ready to Roll'}
                  </span>
                  <div className="flex items-center gap-3 text-xl font-bold tracking-wide">
                    {isRolling ? 'ROLLING' : isAnalyzing ? 'ANALYZING' : 'ROLL DICE'}
                    {!isRolling && !isAnalyzing && <Dices className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />}
                  </div>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Results */}
        <AnalysisCard data={analysis} isLoading={isAnalyzing} />

      </main>
    </div>
  );
}

export default App;