import React from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { lessons } from '../data/lessons';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, RotateCcw, CheckCircle2, Zap, Layers, Compass, Star } from 'lucide-react';

const RECAPS: Record<string, string> = {
  'bubble-sort':
    'Bubble Sort repeatedly compares adjacent items and swaps them if out of order. With each outer pass, the largest remaining unsorted element "bubbles" up to its final index. Time complexity: O(n²).',
  'selection-sort':
    'Selection Sort searches the unsorted portion of the array to find the minimum element, then places it at the front with a single swap. It minimizes write operations with only O(n) total swaps.',
  'insertion-sort':
    'Insertion Sort builds the final sorted array one element at a time. It picks a key and shifts larger elements to the right until the key finds its sorted slot. Highly efficient on nearly sorted data (O(n) best-case).',
  'quick-sort':
    'Quick Sort is a divide-and-conquer powerhouse. It selects a pivot, partitions elements into smaller and larger halves in-place, and recursively sorts each sub-array with average O(n log n) time complexity.',
  'loop-sum':
    'Loop tracing proves how variables evolve step-by-step in memory. The accumulator variable collects state through each iteration until the boundary guard condition fails, exiting cleanly.',
  'variables-101':
    'Variables represent named slots in memory. Swapping variables requires a temporary storage variable to avoid overwriting values prematurely.',
};

export function ResultsScreen() {
  const { currentLesson, currentStepIndex, trace, goToScreen, setLesson } = useLearningStore();

  if (!currentLesson) {
    goToScreen('dashboard');
    return null;
  }

  const accuracy = 100;
  const stepsUsed = currentStepIndex + 1;
  const totalSteps = trace.length;
  const xpEarned = Math.round((stepsUsed / totalSteps) * 120);

  // Correct sequential next lesson lookup
  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : lessons[0];

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-y-auto py-8 sm:py-12 px-4 sm:px-6"
      style={{ background: '#0d0804' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-xl"
      >
        {/* Celebration Card */}
        <div
          className="rounded-3xl overflow-hidden mb-6 relative"
          style={{
            background: 'linear-gradient(145deg, #2a1e13 0%, #1a130c 60%, #120d08 100%)',
            border: '1px solid rgba(110, 78, 55, 0.4)',
            boxShadow: '0 0 60px rgba(110, 78, 55, 0.3)',
          }}
        >
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(110, 78, 55, 0.35) 0%, transparent 70%)',
            }}
          />

          <div className="relative p-8 md:p-10 text-center">
            {/* Trophy badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                border: '1px solid rgba(229, 228, 226, 0.25)',
                boxShadow: '0 0 30px rgba(110, 78, 55, 0.6)',
              }}
            >
              <Trophy size={40} color="#E5E4E2" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <span
                className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-3 inline-block"
                style={{ background: 'rgba(230, 224, 240, 0.1)', color: '#E6E0F0', border: '1px solid rgba(230, 224, 240, 0.25)' }}
              >
                Challenge Completed
              </span>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#E5E4E2' }}>
                {currentLesson.icon} {currentLesson.title}
              </h1>
              <p className="text-sm" style={{ color: '#a8a7a5' }}>
                You have successfully traced every execution step from start to finish!
              </p>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8 grid grid-cols-3 gap-3.5"
            >
              {[
                { label: 'Accuracy', value: `${accuracy}%`, icon: <CheckCircle2 size={16} color="#E6E0F0" /> },
                { label: 'Steps Traced', value: `${stepsUsed}/${totalSteps}`, icon: <Zap size={16} color="#6F4E37" /> },
                { label: 'XP Awarded', value: `+${xpEarned}`, icon: <Star size={16} color="#E5E4E2" /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-3.5 text-center"
                  style={{
                    background: 'rgba(26, 19, 12, 0.6)',
                    border: '1px solid rgba(110, 78, 55, 0.25)',
                  }}
                >
                  <div className="flex justify-center mb-1.5">{stat.icon}</div>
                  <div className="text-lg font-bold font-mono" style={{ color: '#E5E4E2' }}>{stat.value}</div>
                  <div className="text-[11px] uppercase tracking-wider" style={{ color: '#686765' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Concept Recap Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl p-6 mb-6"
          style={{
            background: '#1a130c',
            border: '1px solid rgba(110, 78, 55, 0.25)',
          }}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2.5" style={{ color: '#E6E0F0' }}>
            Concept Recap: {currentLesson.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: '#a8a7a5' }}>
            {RECAPS[currentLesson.id] || currentLesson.description}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col gap-3"
        >
          {nextLesson && (
            <button
              onClick={() => setLesson(nextLesson)}
              className="btn-shimmer relative overflow-hidden w-full flex items-center justify-between px-6 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                border: '1px solid rgba(229, 228, 226, 0.2)',
                boxShadow: '0 0 25px rgba(110, 78, 55, 0.45)',
              }}
            >
              <span>Next Challenge: {nextLesson.icon} {nextLesson.title}</span>
              <ArrowRight size={16} />
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <button
              onClick={() => setLesson(currentLesson)}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs transition-all hover:scale-105"
              style={{
                background: 'rgba(229, 228, 226, 0.05)',
                color: '#E5E4E2',
                border: '1px solid rgba(110, 78, 55, 0.3)',
              }}
            >
              <RotateCcw size={13} />
              Replay
            </button>

            <button
              onClick={() => goToScreen('dashboard')}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs transition-all hover:scale-105"
              style={{
                background: 'rgba(229, 228, 226, 0.05)',
                color: '#E5E4E2',
                border: '1px solid rgba(110, 78, 55, 0.3)',
              }}
            >
              <Layers size={13} />
              Mission Control
            </button>

            <button
              onClick={() => goToScreen('landing')}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs transition-all hover:scale-105"
              style={{
                background: 'rgba(229, 228, 226, 0.05)',
                color: '#E5E4E2',
                border: '1px solid rgba(110, 78, 55, 0.3)',
              }}
            >
              <Compass size={13} />
              3D Showcase
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
