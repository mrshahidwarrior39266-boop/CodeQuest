import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLearningStore } from '../store/useLearningStore';
import {
  generateBubbleSortTrace,
  generateSelectionSortTrace,
  generateInsertionSortTrace,
  generateQuickSortTrace,
} from '../engine/dynamicTrace';
import { soundEngine } from '../engine/soundEngine';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Trophy,
  ArrowRight,
  Gauge,
  Sparkles,
  Swords,
  Flame,
  CheckCircle,
} from 'lucide-react';
import type { ExecutionStep } from '../engine/types';

interface AlgorithmMeta {
  id: string;
  name: string;
  icon: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestCase: string;
}

const algorithms: Record<string, AlgorithmMeta> = {
  'bubble-sort': {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    icon: '🫧',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    bestCase: 'Ω(n)',
  },
  'selection-sort': {
    id: 'selection-sort',
    name: 'Selection Sort',
    icon: '🎯',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    bestCase: 'Ω(n²)',
  },
  'insertion-sort': {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    icon: '🃏',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    bestCase: 'Ω(n)',
  },
  'quick-sort': {
    id: 'quick-sort',
    name: 'Quick Sort',
    icon: '⚡',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    bestCase: 'Ω(n log n)',
  },
};

const traceGenerators: Record<string, (arr: number[]) => ExecutionStep[]> = {
  'bubble-sort': generateBubbleSortTrace,
  'selection-sort': generateSelectionSortTrace,
  'insertion-sort': generateInsertionSortTrace,
  'quick-sort': generateQuickSortTrace,
};

export function AlgorithmRaceScreen() {
  const { goToScreen } = useLearningStore();

  const [initialArray, setInitialArray] = useState<number[]>([7, 2, 9, 1, 5, 3]);
  const [algoA, setAlgoA] = useState<string>('bubble-sort');
  const [algoB, setAlgoB] = useState<string>('quick-sort');

  const [traceA, setTraceA] = useState<ExecutionStep[]>([]);
  const [traceB, setTraceB] = useState<ExecutionStep[]>([]);

  const [stepA, setStepA] = useState(0);
  const [stepB, setStepB] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300); // ms per tick

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-generate traces whenever array or chosen algorithms change
  useEffect(() => {
    const genA = traceGenerators[algoA] || generateBubbleSortTrace;
    const genB = traceGenerators[algoB] || generateQuickSortTrace;

    const tA = genA(initialArray);
    const tB = genB(initialArray);

    setTraceA(tA);
    setTraceB(tB);
    setStepA(0);
    setStepB(0);
    setIsPlaying(false);
  }, [initialArray, algoA, algoB]);

  // Synchronized playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const doneA = stepA >= traceA.length - 1;
    const doneB = stepB >= traceB.length - 1;

    if (doneA && doneB) {
      setIsPlaying(false);
      soundEngine.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6F4E37', '#E5E4E2', '#E6E0F0', '#d4a882'],
      });
      return;
    }

    timerRef.current = setTimeout(() => {
      if (!doneA) setStepA((s) => s + 1);
      if (!doneB) setStepB((s) => s + 1);
    }, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, stepA, stepB, traceA.length, traceB.length, speed]);

  const handleRandomize = (size: number) => {
    const generated: number[] = [];
    while (generated.length < size) {
      const r = Math.floor(Math.random() * (size * 2)) + 1;
      if (!generated.includes(r)) generated.push(r);
    }
    setInitialArray(generated);
  };

  const handleWorstCase = () => {
    const len = initialArray.length;
    const reversed = Array.from({ length: len }, (_, i) => len - i);
    setInitialArray(reversed);
  };

  const handleNearlySorted = () => {
    const len = initialArray.length;
    const arr = Array.from({ length: len }, (_, i) => i + 1);
    if (len >= 4) {
      // Swap two adjacent items
      [arr[1], arr[2]] = [arr[2], arr[1]];
    }
    setInitialArray(arr);
  };

  const handleReset = () => {
    setStepA(0);
    setStepB(0);
    setIsPlaying(false);
  };

  const currentStepA = traceA[stepA] || { array: initialArray, indices: [], event: 'highlight' };
  const currentStepB = traceB[stepB] || { array: initialArray, indices: [], event: 'highlight' };

  // Metrics
  const compA = traceA.slice(0, stepA + 1).filter((s) => s.event === 'compare').length;
  const swapA = traceA.slice(0, stepA + 1).filter((s) => s.event === 'swap').length;

  const compB = traceB.slice(0, stepB + 1).filter((s) => s.event === 'compare').length;
  const swapB = traceB.slice(0, stepB + 1).filter((s) => s.event === 'swap').length;

  const progA = traceA.length > 0 ? (stepA / (traceA.length - 1)) * 100 : 0;
  const progB = traceB.length > 0 ? (stepB / (traceB.length - 1)) * 100 : 0;

  const doneA = stepA >= traceA.length - 1 && traceA.length > 0;
  const doneB = stepB >= traceB.length - 1 && traceB.length > 0;

  let winnerName = '';
  if (doneA && !doneB) winnerName = algorithms[algoA].name;
  else if (doneB && !doneA) winnerName = algorithms[algoB].name;
  else if (doneA && doneB) {
    if (compA + swapA < compB + swapB) winnerName = algorithms[algoA].name;
    else if (compB + swapB < compA + swapA) winnerName = algorithms[algoB].name;
    else winnerName = 'Dead Heat Tie!';
  }

  const maxVal = Math.max(...initialArray, 1);
  const minVal = Math.min(...initialArray, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 md:px-8 py-6" style={{ background: '#0d0804' }}>
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
        {/* Header Banner */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-mocha-900/30">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ background: 'rgba(110, 78, 55, 0.3)', color: '#E6E0F0', border: '1px solid #6F4E37' }}
              >
                <Swords size={12} />
                Multi-Algorithm Race Arena
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#E5E4E2' }}>
              {algorithms[algoA]?.name} <span style={{ color: '#686765' }}>VS</span> {algorithms[algoB]?.name}
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: '#a8a7a5' }}>
              Benchmark any two algorithms head-to-head on identical arrays with live operations telemetry.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                border: '1px solid rgba(229, 228, 226, 0.3)',
                boxShadow: '0 0 16px rgba(110, 78, 55, 0.5)',
              }}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              <span>{isPlaying ? 'Pause Battle' : 'Start Race'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: 'rgba(229, 228, 226, 0.05)',
                color: '#a8a7a5',
                border: '1px solid rgba(110, 78, 55, 0.3)',
              }}
              title="Reset race"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Control Strip: Algorithm Pickers & Array Presets */}
        <div
          className="p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: '#160e08', border: '1px solid rgba(110, 78, 55, 0.25)' }}
        >
          {/* Algorithm Pickers */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Contender 1 Selector */}
            <div className="flex items-center gap-2 bg-[#0d0804] px-3 py-1.5 rounded-xl border border-mocha-900/50">
              <span className="text-xs font-bold text-lavender-300">Contender 1:</span>
              <select
                value={algoA}
                onChange={(e) => setAlgoA(e.target.value)}
                disabled={isPlaying}
                className="bg-transparent text-platinum text-xs font-semibold font-mono focus:outline-none cursor-pointer"
              >
                {Object.values(algorithms).map((algo) => (
                  <option key={algo.id} value={algo.id} className="bg-[#1a130c] text-platinum">
                    {algo.icon} {algo.name} ({algo.timeComplexity})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-mono font-bold text-[#686765]">VS</span>

            {/* Contender 2 Selector */}
            <div className="flex items-center gap-2 bg-[#0d0804] px-3 py-1.5 rounded-xl border border-mocha-900/50">
              <span className="text-xs font-bold text-lavender-300">Contender 2:</span>
              <select
                value={algoB}
                onChange={(e) => setAlgoB(e.target.value)}
                disabled={isPlaying}
                className="bg-transparent text-platinum text-xs font-semibold font-mono focus:outline-none cursor-pointer"
              >
                {Object.values(algorithms).map((algo) => (
                  <option key={algo.id} value={algo.id} className="bg-[#1a130c] text-platinum">
                    {algo.icon} {algo.name} ({algo.timeComplexity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Array Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[#a8a7a5] text-[11px] mr-1">Presets:</span>
            <button
              onClick={() => handleRandomize(6)}
              disabled={isPlaying}
              className="px-2.5 py-1 rounded-lg border border-mocha-800/40 hover:bg-mocha-900/40 text-platinum text-[11px] font-mono transition-all"
            >
              Rand 6
            </button>
            <button
              onClick={() => handleRandomize(10)}
              disabled={isPlaying}
              className="px-2.5 py-1 rounded-lg border border-mocha-800/40 hover:bg-mocha-900/40 text-platinum text-[11px] font-mono transition-all"
            >
              Rand 10
            </button>
            <button
              onClick={handleWorstCase}
              disabled={isPlaying}
              className="px-2.5 py-1 rounded-lg border border-mocha-800/40 hover:bg-mocha-900/40 text-platinum text-[11px] font-mono transition-all"
            >
              Worst Case (Rev)
            </button>
            <button
              onClick={handleNearlySorted}
              disabled={isPlaying}
              className="px-2.5 py-1 rounded-lg border border-mocha-800/40 hover:bg-mocha-900/40 text-platinum text-[11px] font-mono transition-all"
            >
              Nearly Sorted
            </button>
          </div>

          {/* Speed Buttons */}
          <div className="flex items-center gap-1 bg-[#0d0804] p-1 rounded-xl border border-mocha-900/40">
            {[
              { label: '0.5x', ms: 600 },
              { label: '1x', ms: 300 },
              { label: '2x', ms: 120 },
              { label: 'Turbo', ms: 35 },
            ].map((sp) => (
              <button
                key={sp.label}
                onClick={() => setSpeed(sp.ms)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all"
                style={{
                  background: speed === sp.ms ? '#6F4E37' : 'transparent',
                  color: speed === sp.ms ? '#E5E4E2' : '#888',
                }}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Winner Announcement Banner */}
        {(doneA || doneB) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(110, 78, 55, 0.4), rgba(230, 224, 240, 0.15))',
              border: '1px solid #E6E0F0',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Trophy size={18} className="text-lavender-200 animate-bounce" />
              <span className="text-xs md:text-sm font-bold text-platinum">
                {doneA && doneB ? 'Race Finished!' : 'Current Leader:'}{' '}
                <span className="text-lavender-100 underline decoration-mocha-400">{winnerName}</span>
              </span>
            </div>
            <div className="text-[11px] font-mono text-lavender-300">
              Total Ops: {algorithms[algoA].name} ({compA + swapA}) vs {algorithms[algoB].name} ({compB + swapB})
            </div>
          </motion.div>
        )}

        {/* Dual Arena Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── CONTENDER A ── */}
          <div
            className="rounded-2xl p-5 flex flex-col justify-between transition-all"
            style={{
              background: 'linear-gradient(145deg, #18110b 0%, #100a06 100%)',
              border: `1px solid ${doneA ? '#E6E0F0' : 'rgba(110, 78, 55, 0.35)'}`,
              boxShadow: doneA ? '0 0 24px rgba(230, 224, 240, 0.2)' : 'none',
            }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{algorithms[algoA].icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-platinum flex items-center gap-2">
                    {algorithms[algoA].name}
                    {doneA && <CheckCircle size={14} className="text-lavender" />}
                  </h3>
                  <p className="text-[11px] text-[#686765] font-mono">
                    Time: {algorithms[algoA].timeComplexity} · Space: {algorithms[algoA].spaceComplexity}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-lavender">
                  {Math.round(progA)}%
                </span>
                <p className="text-[10px] text-[#888] font-mono">
                  Step {stepA + 1}/{traceA.length}
                </p>
              </div>
            </div>

            {/* Visualizer Bars */}
            <div
              className="h-48 flex items-end justify-center gap-2 px-3 py-2 rounded-xl mb-4"
              style={{ background: '#0a0603', border: '1px solid rgba(110, 78, 55, 0.15)' }}
            >
              {currentStepA.array.map((val, idx) => {
                const isComparing = currentStepA.event === 'compare' && currentStepA.indices?.includes(idx);
                const isSwapping = currentStepA.event === 'swap' && currentStepA.indices?.includes(idx);
                const isComplete = currentStepA.event === 'complete';
                const heightPct = Math.max(12, Math.round(((val - minVal + 1) / (maxVal - minVal + 1)) * 95));

                let barBg = '#6F4E37';
                if (isComparing) barBg = '#E6E0F0';
                if (isSwapping) barBg = '#d4a882';
                if (isComplete) barBg = 'linear-gradient(to top, #6F4E37, #E6E0F0)';

                return (
                  <motion.div
                    key={idx}
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex-1 flex flex-col items-center justify-end rounded-t-lg relative"
                    style={{ height: `${heightPct}%`, background: barBg, maxWidth: 44 }}
                  >
                    <span className="text-[10px] font-mono font-bold mb-1" style={{ color: isComparing ? '#0d0804' : '#E5E4E2' }}>
                      {val}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#0e0905] border border-mocha-900/40 flex justify-between items-center">
                <span className="text-[#a8a7a5]">Comparisons:</span>
                <span className="text-platinum font-bold text-sm">{compA}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0e0905] border border-mocha-900/40 flex justify-between items-center">
                <span className="text-[#a8a7a5]">Swaps:</span>
                <span className="text-lavender font-bold text-sm">{swapA}</span>
              </div>
            </div>
          </div>

          {/* ── CONTENDER B ── */}
          <div
            className="rounded-2xl p-5 flex flex-col justify-between transition-all"
            style={{
              background: 'linear-gradient(145deg, #18110b 0%, #100a06 100%)',
              border: `1px solid ${doneB ? '#E6E0F0' : 'rgba(110, 78, 55, 0.35)'}`,
              boxShadow: doneB ? '0 0 24px rgba(230, 224, 240, 0.2)' : 'none',
            }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{algorithms[algoB].icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-platinum flex items-center gap-2">
                    {algorithms[algoB].name}
                    {doneB && <CheckCircle size={14} className="text-lavender" />}
                  </h3>
                  <p className="text-[11px] text-[#686765] font-mono">
                    Time: {algorithms[algoB].timeComplexity} · Space: {algorithms[algoB].spaceComplexity}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-lavender">
                  {Math.round(progB)}%
                </span>
                <p className="text-[10px] text-[#888] font-mono">
                  Step {stepB + 1}/{traceB.length}
                </p>
              </div>
            </div>

            {/* Visualizer Bars */}
            <div
              className="h-48 flex items-end justify-center gap-2 px-3 py-2 rounded-xl mb-4"
              style={{ background: '#0a0603', border: '1px solid rgba(110, 78, 55, 0.15)' }}
            >
              {currentStepB.array.map((val, idx) => {
                const isComparing = currentStepB.event === 'compare' && currentStepB.indices?.includes(idx);
                const isSwapping = currentStepB.event === 'swap' && currentStepB.indices?.includes(idx);
                const isComplete = currentStepB.event === 'complete';
                const heightPct = Math.max(12, Math.round(((val - minVal + 1) / (maxVal - minVal + 1)) * 95));

                let barBg = '#6F4E37';
                if (isComparing) barBg = '#E6E0F0';
                if (isSwapping) barBg = '#d4a882';
                if (isComplete) barBg = 'linear-gradient(to top, #6F4E37, #E6E0F0)';

                return (
                  <motion.div
                    key={idx}
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex-1 flex flex-col items-center justify-end rounded-t-lg relative"
                    style={{ height: `${heightPct}%`, background: barBg, maxWidth: 44 }}
                  >
                    <span className="text-[10px] font-mono font-bold mb-1" style={{ color: isComparing ? '#0d0804' : '#E5E4E2' }}>
                      {val}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#0e0905] border border-mocha-900/40 flex justify-between items-center">
                <span className="text-[#a8a7a5]">Comparisons:</span>
                <span className="text-platinum font-bold text-sm">{compB}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0e0905] border border-mocha-900/40 flex justify-between items-center">
                <span className="text-[#a8a7a5]">Swaps:</span>
                <span className="text-lavender font-bold text-sm">{swapB}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
