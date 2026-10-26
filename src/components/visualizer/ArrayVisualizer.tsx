import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useLearningStore } from '../../store/useLearningStore';

interface BarProps {
  value: number;
  index: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  minValue: number;
  maxValue: number;
  totalBars: number;
}

function ArrayBar({
  value,
  index,
  isComparing,
  isSwapping,
  isSorted,
  minValue,
  maxValue,
  totalBars,
}: BarProps) {
  // Compute normalized height percentage between 16% and 88%
  const range = maxValue - minValue;
  const heightPct = range === 0 ? 50 : Math.max(16, 16 + ((value - minValue) / range) * 72);

  let barBg = 'linear-gradient(to top, #2a1e13, #1a130c)';
  let borderColor = 'rgba(110, 78, 55, 0.35)';
  let glowColor = 'none';
  let labelColor = '#686765';

  if (isSorted) {
    barBg = 'linear-gradient(to top, rgba(229, 228, 226, 0.15), rgba(110, 78, 55, 0.3))';
    borderColor = '#E5E4E2';
    glowColor = '0 0 16px rgba(229, 228, 226, 0.3)';
    labelColor = '#E5E4E2';
  } else if (isSwapping) {
    barBg = 'linear-gradient(to top, rgba(230, 224, 240, 0.3), rgba(110, 78, 55, 0.4))';
    borderColor = '#E6E0F0';
    glowColor = '0 0 24px rgba(230, 224, 240, 0.5)';
    labelColor = '#E6E0F0';
  } else if (isComparing) {
    barBg = 'linear-gradient(to top, #6F4E37, #5a3e2b)';
    borderColor = '#6F4E37';
    glowColor = '0 0 20px rgba(110, 78, 55, 0.6)';
    labelColor = '#E6E0F0';
  }

  // Dynamic bar width according to array density
  let barWidth = 68;
  let fontSize = 13;
  if (totalBars > 16) {
    barWidth = 26;
    fontSize = 10;
  } else if (totalBars > 12) {
    barWidth = 36;
    fontSize = 11;
  } else if (totalBars > 8) {
    barWidth = 48;
    fontSize = 12;
  } else if (totalBars > 5) {
    barWidth = 58;
    fontSize = 13;
  }

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="flex flex-col items-center flex-shrink-0"
      style={{ width: barWidth, userSelect: 'none' }}
    >
      {/* Value label above bar */}
      <motion.span
        animate={{ color: labelColor }}
        transition={{ duration: 0.2 }}
        style={{
          fontSize: fontSize,
          fontWeight: 700,
          fontFamily: '"JetBrains Mono", monospace',
          marginBottom: 6,
          lineHeight: 1,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {value}
      </motion.span>

      {/* The animated Bar */}
      <motion.div
        animate={{
          background: barBg,
          borderColor: borderColor,
          boxShadow: glowColor,
          height: `${heightPct}%`,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          width: '100%',
          minHeight: 26,
          borderRadius: totalBars > 14 ? 5 : 8,
          border: `2px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Shimmer line when active */}
        {(isComparing || isSwapping) && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, transparent, rgba(230, 224, 240, 0.25), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.div>

      {/* Index label below */}
      <span
        style={{
          fontSize: totalBars > 14 ? 8 : 10,
          color: '#505050',
          marginTop: 6,
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        [{index}]
      </span>
    </motion.div>
  );
}

export function ArrayVisualizer() {
  const { currentStep } = useLearningStore();

  if (!currentStep || !currentStep.array || currentStep.array.length === 0) {
    return null;
  }

  const arr = currentStep.array;
  const comparing = currentStep.indices ?? [];
  const isSwapping = currentStep.event === 'swap';
  const isComplete = currentStep.event === 'complete';

  const maxValue = Math.max(...arr);
  const minValue = Math.min(...arr);

  return (
    <div className="h-full flex flex-col p-3" style={{ background: '#0d0804' }}>
      {/* Header with live count & legend */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#686765' }}>
            Array State ({arr.length} items)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-[11px]" style={{ color: '#a8a7a5' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#6F4E37', border: '1px solid rgba(229, 228, 226, 0.2)' }} />
            Comparing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#E6E0F0', border: '1px solid #E6E0F0' }} />
            Swapping
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#E5E4E2', border: '1px solid #E5E4E2' }} />
            Sorted
          </span>
        </div>
      </div>

      {/* Bars Canvas: horizontally scrollable if dense, perfectly centered */}
      <div
        className="flex-1 flex items-end justify-center gap-2.5 rounded-xl px-4 py-3 overflow-x-auto no-scrollbar"
        style={{
          background: 'linear-gradient(180deg, rgba(26, 19, 12, 0.6) 0%, rgba(13, 8, 4, 0.95) 100%)',
          border: '1px solid rgba(110, 78, 55, 0.2)',
          minHeight: 180,
        }}
      >
        <LayoutGroup>
          <AnimatePresence>
            {arr.map((value, index) => (
              <ArrayBar
                key={`bar-${index}-${value}`}
                value={value}
                index={index}
                isComparing={comparing.includes(index) && !isSwapping}
                isSwapping={comparing.includes(index) && isSwapping}
                isSorted={isComplete}
                minValue={minValue}
                maxValue={maxValue}
                totalBars={arr.length}
              />
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}
