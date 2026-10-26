import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '../../store/useLearningStore';
import { ArrowLeftRight, Search, RefreshCcw, CheckCircle2, Info, Repeat } from 'lucide-react';

const EVENT_META = {
  compare:    { label: 'Comparison', icon: <Search size={13} />,         bg: 'rgba(110, 78, 55, 0.25)',  border: '#6F4E37', color: '#E5E4E2' },
  swap:       { label: 'Array Swap', icon: <ArrowLeftRight size={13} />, bg: 'rgba(230, 224, 240, 0.15)', border: '#E6E0F0', color: '#E6E0F0' },
  update:     { label: 'Mutation',   icon: <RefreshCcw size={13} />,     bg: 'rgba(110, 78, 55, 0.2)',   border: 'rgba(110, 78, 55, 0.5)', color: '#E5E4E2' },
  complete:   { label: 'Finished',   icon: <CheckCircle2 size={13} />,   bg: 'rgba(229, 228, 226, 0.15)', border: '#E5E4E2', color: '#E5E4E2' },
  highlight:  { label: 'Execution',  icon: <Info size={13} />,           bg: 'rgba(110, 78, 55, 0.2)',   border: 'rgba(110, 78, 55, 0.4)', color: '#E6E0F0' },
  loop_check: { label: 'Loop Guard', icon: <Repeat size={13} />,         bg: 'rgba(230, 224, 240, 0.1)', border: 'rgba(230, 224, 240, 0.3)', color: '#E6E0F0' },
};

export function StepExplanation() {
  const { currentStep, currentStepIndex } = useLearningStore();

  if (!currentStep) return null;

  const meta = EVENT_META[currentStep.event] ?? EVENT_META.highlight;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStepIndex}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="px-5 py-3"
      >
        {/* Badge & Line */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <span
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: meta.bg,
              border: `1px solid ${meta.border}`,
              color: meta.color,
            }}
          >
            {meta.icon}
            {meta.label}
          </span>

          <span className="text-xs font-mono" style={{ color: '#686765' }}>
            Line {currentStep.line}
          </span>

          {currentStep.indices && currentStep.indices.length > 0 && (
            <span className="text-xs font-mono" style={{ color: '#a8a7a5' }}>
              indices [{currentStep.indices.join(', ')}]
            </span>
          )}
        </div>

        {/* Text */}
        <p className="text-sm font-medium leading-relaxed" style={{ color: '#E5E4E2' }}>
          {currentStep.explanation}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
