import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { motion } from 'framer-motion';

export function StepTimeline() {
  const { currentStepIndex, trace, jumpToStep } = useLearningStore();
  const totalSteps = trace.length;
  const progress = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateTargetStep = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || totalSteps <= 1) return 0;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (totalSteps - 1));
    },
    [totalSteps]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    jumpToStep(calculateTargetStep(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    jumpToStep(calculateTargetStep(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="flex items-center gap-2.5" style={{ minWidth: 190 }}>
      {/* Step Drag Scrubber Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex-1 h-3 flex items-center cursor-ew-resize group select-none touch-none"
        title="Click or drag smoothly to scrub through execution steps"
      >
        {/* Background rail */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden transition-all group-hover:h-2"
          style={{ background: 'rgba(229, 228, 226, 0.1)' }}
        >
          {/* Progress fill */}
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(to right, #6F4E37, #E6E0F0)',
              boxShadow: '0 0 10px rgba(110, 78, 55, 0.5)',
            }}
          />
        </div>

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-transform group-hover:scale-125"
          style={{
            left: `calc(${progress}% - 8px)`,
            background: isDragging ? '#E6E0F0' : '#d4a882',
            border: '2px solid #6F4E37',
            boxShadow: isDragging ? '0 0 14px #E6E0F0' : '0 0 8px rgba(110, 78, 55, 0.7)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Step index badge & Percentage */}
      <div className="flex items-center gap-1 min-w-[70px] justify-end">
        <span className="text-[10px] font-mono font-medium text-[#a8a7a5]">
          {currentStepIndex + 1}/{totalSteps}
        </span>
        <span className="text-[11px] font-mono font-bold" style={{ color: '#E6E0F0' }}>
          ({Math.round(progress)}%)
        </span>
      </div>
    </div>
  );
}
