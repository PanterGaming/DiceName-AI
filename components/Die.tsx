import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DieProps {
  char: string;
  isRolling: boolean;
  index: number;
  totalDice: number;
}

const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const Die: React.FC<DieProps> = ({ char, isRolling, index }) => {
  // Local rolling state allows each die to stop independently
  const [internalRolling, setInternalRolling] = useState(false);
  const [displayChar, setDisplayChar] = useState(char);
  // Rotation state
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const intervalRef = useRef<number | undefined>(undefined);

  // Handle the staggered rolling logic
  useEffect(() => {
    let stopTimeout: number;

    if (isRolling) {
      setInternalRolling(true);
    } else {
      // Delay the stop based on index to create the "one after one" effect
      // 200ms stagger per die
      stopTimeout = window.setTimeout(() => {
        setInternalRolling(false);
      }, index * 200);
    }

    return () => {
      clearTimeout(stopTimeout);
    };
  }, [isRolling, index]);

  // Handle the animation loop
  useEffect(() => {
    if (internalRolling) {
      // Start chaotic rotation loop
      // We update the state rapidly to random values.
      // Framer motion will handle the interpolation between these, but we set duration low.
      intervalRef.current = window.setInterval(() => {
        // Update displayed char randomly while rolling for the "blur" effect
        setDisplayChar(RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length)));
        
        // Rotate wildly. We use large values to ensure it spins multiple times.
        // We add to the previous rotation to keep it spinning in one general direction or flip wildly.
        setRotation({
          x: Math.random() * 1080 - 540, 
          y: Math.random() * 1080 - 540,
          z: Math.random() * 360 - 180
        });
      }, 60); 
    } else {
      // STOPPING PHASE
      clearInterval(intervalRef.current);
      
      // Reset to final char
      setDisplayChar(char);
      
      // Snap to exactly 0,0,0 (Front Face)
      // The magic happens in the `transition` prop which changes to a spring
      setRotation({ x: 0, y: 0, z: 0 });
    }

    return () => clearInterval(intervalRef.current);
  }, [internalRolling, char]);
  
  // Fixed size for the cube
  const size = 64; // 64px = w-16
  const translateZ = size / 2;

  // Styles
  const faceClass = "absolute w-full h-full flex items-center justify-center border-2 border-purple-100 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 font-mono text-xl backface-hidden";
  const frontFaceClass = "absolute w-full h-full flex items-center justify-center border-2 border-purple-200 dark:border-purple-500 bg-white dark:bg-slate-800 shadow-inner font-black font-mono text-3xl text-indigo-600 dark:text-teal-400 backface-hidden";
  const dotClass = "w-2 h-2 rounded-full bg-purple-100 dark:bg-slate-600";

  // Calculate random jump offset for a bit of organic variance
  const jumpHeight = -140 - (Math.random() * 40); 

  return (
    <div 
      className="relative w-16 h-16 perspective-800 group"
      style={{ 
        zIndex: internalRolling ? 50 : 1, // Ensure it stays on top while "in the air"
      }}
    >
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ 
          rotateX: rotation.x, 
          rotateY: rotation.y, 
          rotateZ: rotation.z,
          y: internalRolling ? jumpHeight : 0
        }}
        transition={{
          // Rotations: Fast and linear chaos when rolling, bouncy spring when settling
          rotateX: internalRolling ? { duration: 0.06, ease: "linear" } : { type: "spring", stiffness: 250, damping: 15, mass: 1 },
          rotateY: internalRolling ? { duration: 0.06, ease: "linear" } : { type: "spring", stiffness: 250, damping: 15, mass: 1 },
          rotateZ: internalRolling ? { duration: 0.06, ease: "linear" } : { type: "spring", stiffness: 250, damping: 15, mass: 1 },
          
          // Y Position: Smooth throw up, heavy thud down
          y: internalRolling 
            ? { duration: 0.4, ease: "easeOut" } 
            : { type: "spring", stiffness: 300, damping: 18, mass: 1.5 }
        }}
      >
        {/* Front Face (Final Result) */}
        <div 
          className={frontFaceClass}
          style={{ transform: `rotateY(0deg) translateZ(${translateZ}px)` }}
        >
          {displayChar}
        </div>

        {/* Right Face */}
        <div 
          className={faceClass}
          style={{ transform: `rotateY(90deg) translateZ(${translateZ}px)` }}
        >
          <div className={dotClass}></div>
        </div>

        {/* Back Face */}
        <div 
          className={faceClass}
          style={{ transform: `rotateY(180deg) translateZ(${translateZ}px)` }}
        >
           <div className="flex gap-1"><div className={dotClass}></div><div className={dotClass}></div></div>
        </div>

        {/* Left Face */}
        <div 
          className={faceClass}
          style={{ transform: `rotateY(-90deg) translateZ(${translateZ}px)` }}
        >
          <div className={dotClass}></div>
        </div>

        {/* Top Face */}
        <div 
          className={faceClass}
          style={{ transform: `rotateX(90deg) translateZ(${translateZ}px)` }}
        >
           <div className="flex gap-1 rotate-45"><div className={dotClass}></div><div className={dotClass}></div></div>
        </div>

        {/* Bottom Face */}
        <div 
          className={faceClass}
          style={{ transform: `rotateX(-90deg) translateZ(${translateZ}px)` }}
        >
          <div className={dotClass}></div>
        </div>
      </motion.div>
      
      {/* Shadow beneath the cube */}
      <motion.div 
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/10 dark:bg-black/40 blur-md rounded-[100%]"
        animate={{
          scale: internalRolling ? 0.5 : 1,
          opacity: internalRolling ? 0.2 : 1
        }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
};