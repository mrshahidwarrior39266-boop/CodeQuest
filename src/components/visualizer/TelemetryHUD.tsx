import React, { useState } from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { Activity, ShieldCheck, Cpu, HardDrive, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TelemetryHUD() {
  const { currentLesson, trace, currentStepIndex } = useLearningStore();
  const [showInvariantInfo, setShowInvariantInfo] = useState(false);

  if (!currentLesson) return null;

  // Compute live cumulative comparisons and swaps up to currentStepIndex
  const activeSteps = trace.slice(0, currentStepIndex + 1);
  const comparisonsCount = activeSteps.filter((s) => s.event === 'compare').length;
  const swapsCount = activeSteps.filter((s) => s.event === 'swap').length;

  const currentArray = trace[currentStepIndex]?.array ?? [];
  const n = currentArray.length || 5;
  const worstCaseComparisons = Math.max(1, (n * (n - 1)) / 2);
  const efficiencyPercent = Math.min(100, Math.round(((comparisonsCount + swapsCount) / worstCaseComparisons) * 100));

  const timeComp = currentLesson.timeComplexity || { best: 'Ω(n)', average: 'Θ(n²)', worst: 'O(n²)' };
  const spaceComp = currentLesson.spaceComplexity || 'O(1) In-Place';
  const invariant = currentLesson.loopInvariant || 'Elements in partition maintain relative order.';

  return (
    <div
      className="px-4 py-2.5 flex-shrink-0 flex flex-col gap-2 relative"
      style={{
        background: 'linear-gradient(180deg, #160e08 0%, #100a06 100%)',
        borderBottom: '1px solid rgba(110, 78, 55, 0.25)',
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        {/* Left: Live Counters */}
        <div className="flex items-center gap-3">
          {/* Comparisons */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-semibold"
            style={{
              background: 'rgba(110, 78, 55, 0.25)',
              border: '1px solid rgba(110, 78, 55, 0.4)',
              color: '#E5E4E2',
            }}
            title="Total comparisons executed so far"
          >
            <Activity size={12} className="text-lavender-300" />
            <span style={{ color: '#a8a7a5' }}>C:</span>
            <span className="text-platinum font-bold">{comparisonsCount}</span>
          </div>

          {/* Swaps / Writes */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-semibold"
            style={{
              background: 'rgba(230, 224, 240, 0.08)',
              border: '1px solid rgba(230, 224, 240, 0.25)',
              color: '#E6E0F0',
            }}
            title="Total element swaps / writes so far"
          >
            <Cpu size={12} className="text-lavender" />
            <span style={{ color: '#a8a7a5' }}>S:</span>
            <span className="text-lavender font-bold">{swapsCount}</span>
          </div>

          {/* Efficiency Gauge */}
          <div className="hidden sm:flex items-center gap-2 text-[11px]" style={{ color: '#a8a7a5' }}>
            <span>Ops Stress:</span>
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(110, 78, 55, 0.3)' }}>
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(5, efficiencyPercent))}%`,
                  background: 'linear-gradient(90deg, #6F4E37, #E6E0F0)',
                }}
              />
            </div>
            <span className="font-mono text-[10px]" style={{ color: '#E5E4E2' }}>{efficiencyPercent}%</span>
          </div>
        </div>

        {/* Right: Big-O Complexity Badges */}
        <div className="flex items-center gap-2">
          {/* Time Complexity Badge */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-mono font-medium"
            style={{
              background: 'rgba(110, 78, 55, 0.15)',
              border: '1px solid rgba(110, 78, 55, 0.3)',
            }}
            title={`Time Complexity: Best ${timeComp.best}, Average ${timeComp.average}, Worst ${timeComp.worst}`}
          >
            <span style={{ color: '#a8a7a5' }}>Time:</span>
            <span style={{ color: '#E6E0F0' }}>{timeComp.worst}</span>
          </div>

          {/* Space Complexity Badge */}
          <div
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono"
            style={{
              background: 'rgba(229, 228, 226, 0.04)',
              border: '1px solid rgba(229, 228, 226, 0.15)',
              color: '#a8a7a5',
            }}
            title={`Auxiliary Memory Footprint: ${spaceComp}`}
          >
            <HardDrive size={11} />
            <span>{spaceComp}</span>
          </div>

          {/* Mathematical Invariant Button */}
          <button
            onClick={() => setShowInvariantInfo(!showInvariantInfo)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: showInvariantInfo ? 'rgba(230, 224, 240, 0.25)' : 'rgba(110, 78, 55, 0.2)',
              border: `1px solid ${showInvariantInfo ? '#E6E0F0' : 'rgba(110, 78, 55, 0.35)'}`,
              color: showInvariantInfo ? '#E6E0F0' : '#E5E4E2',
            }}
            title="Click to view formal loop invariant"
          >
            <ShieldCheck size={12} className="text-lavender-300" />
            <span className="hidden sm:inline">Invariant</span>
          </button>
        </div>
      </div>

      {/* Invariant Explanation Drawer */}
      <AnimatePresence>
        {showInvariantInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg p-2.5 text-xs flex items-start gap-2.5"
            style={{
              background: 'rgba(26, 19, 12, 0.95)',
              border: '1px solid rgba(230, 224, 240, 0.25)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            }}
          >
            <Sparkles size={14} className="text-lavender-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-platinum text-[11px] mb-0.5 uppercase tracking-wide">
                Formal Algorithm Invariant:
              </p>
              <p className="text-lavender-200 text-xs leading-relaxed font-mono">
                {invariant}
              </p>
            </div>
            <button
              onClick={() => setShowInvariantInfo(false)}
              className="text-[#a8a7a5] hover:text-white px-1 text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
