import React from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Layers, Clock, ListOrdered } from 'lucide-react';

export function LessonSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { currentLesson, currentStepIndex, trace, jumpToStep } = useLearningStore();

  if (!currentLesson) return null;

  const totalSteps = trace.length;

  return (
    <div
      className="flex flex-col h-full relative transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? 44 : 240,
        background: '#0d0804',
        borderRight: '1px solid rgba(110, 78, 55, 0.25)',
        overflow: 'hidden',
      }}
    >
      {/* ── COLLAPSED VIEW: Unmissable Clickable Strip ── */}
      {collapsed ? (
        <button
          onClick={onToggle}
          className="w-full h-full flex flex-col items-center pt-3 gap-3 transition-colors hover:bg-mocha-950/80 group cursor-pointer"
          title="Click arrow to bring back sidebar"
          aria-label="Expand sidebar"
        >
          {/* Big glowing arrow button to expand and bring back */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 shadow-lg ring-1 ring-lavender/30"
            style={{
              background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
              color: '#E5E4E2',
              border: '1px solid rgba(229, 228, 226, 0.4)',
              boxShadow: '0 0 16px rgba(110, 78, 55, 0.7)',
            }}
          >
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5 text-lavender-200" />
          </div>

          <span className="text-base mt-1">{currentLesson.icon}</span>

          {/* Rotated label so it's super clear */}
          <span
            className="text-[10px] font-bold uppercase tracking-widest transition-colors font-mono"
            style={{
              color: '#E6E0F0',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              letterSpacing: '0.15em',
            }}
          >
            Open Steps ➔
          </span>

          {/* Step indicator */}
          <div className="mt-auto mb-4 text-[10px] font-mono" style={{ color: '#686765' }}>
            {currentStepIndex + 1}/{totalSteps}
          </div>
        </button>
      ) : (
        /* ── EXPANDED VIEW ── */
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header with Title and Collapse Arrow */}
          <div
            className="px-4 pt-3.5 pb-3 flex items-start justify-between gap-2"
            style={{ borderBottom: '1px solid rgba(110, 78, 55, 0.15)' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl flex-shrink-0">{currentLesson.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight truncate" style={{ color: '#E5E4E2' }}>
                  {currentLesson.title}
                </p>
                <p className="text-[11px] truncate" style={{ color: '#686765' }}>
                  {currentLesson.category}
                </p>
              </div>
            </div>

            {/* Collapse Arrow Button */}
            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
              style={{
                background: 'rgba(110, 78, 55, 0.2)',
                border: '1px solid rgba(110, 78, 55, 0.35)',
                color: '#E5E4E2',
              }}
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Mini Progress */}
          <div className="px-4 py-2" style={{ borderBottom: '1px solid rgba(110, 78, 55, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(110, 78, 55, 0.2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentStepIndex / Math.max(1, totalSteps - 1)) * 100}%`,
                    background: 'linear-gradient(to right, #6F4E37, #E6E0F0)',
                  }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold" style={{ color: '#E6E0F0', minWidth: 32, textAlign: 'right' }}>
                {Math.round((currentStepIndex / Math.max(1, totalSteps - 1)) * 100)}%
              </span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="px-4 py-2.5 flex items-center justify-between text-xs" style={{ borderBottom: '1px solid rgba(110, 78, 55, 0.1)', color: '#686765' }}>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {currentLesson.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Layers size={11} />
              {totalSteps} steps
            </span>
          </div>

          {/* Step List */}
          <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
            <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#505050' }}>
              Execution Steps
            </p>
            {trace.map((step, i) => {
              const isCurrent = i === currentStepIndex;
              const isDone = i < currentStepIndex;
              return (
                <button
                  key={i}
                  onClick={() => jumpToStep(i)}
                  className="w-full text-left px-3 py-2 flex items-start gap-2.5 transition-all hover:bg-mocha-950/60 rounded-lg mx-1"
                  style={{
                    background: isCurrent ? 'rgba(110, 78, 55, 0.25)' : 'transparent',
                    borderLeft: isCurrent ? '3px solid #6F4E37' : '3px solid transparent',
                    marginBottom: 1,
                  }}
                >
                  <span className="mt-0.5 flex-shrink-0" style={{ color: isDone ? '#6F4E37' : isCurrent ? '#E6E0F0' : '#3a3a3a' }}>
                    {isDone ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: isCurrent ? '#E5E4E2' : isDone ? '#a8a7a5' : '#686765' }}
                    >
                      Step {i + 1}
                    </p>
                    <p
                      className="text-[10px] truncate mt-0.5 font-mono"
                      style={{ color: isCurrent ? '#E6E0F0' : '#505050' }}
                    >
                      {step.event.replace('_', ' ')} · L{step.line}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
