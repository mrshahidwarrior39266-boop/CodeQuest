import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '../../store/useLearningStore';

type VarValue = number | string | boolean;

function VarCard({
  name,
  value,
  prevValue,
  changed,
}: {
  name: string;
  value: VarValue;
  prevValue: VarValue | undefined;
  changed: boolean;
}) {
  const isBoolean = typeof value === 'boolean';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: changed ? 'rgba(110, 78, 55, 0.25)' : 'rgba(26, 19, 12, 0.65)',
        border: changed ? '1px solid #6F4E37' : '1px solid rgba(110, 78, 55, 0.2)',
        boxShadow: changed ? '0 0 16px rgba(110, 78, 55, 0.4)' : 'none',
      }}
    >
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Identifier */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-bold"
            style={{ color: '#E6E0F0' }}
          >
            {name}
          </span>
          <span className="text-[10px] uppercase font-mono" style={{ color: '#686765' }}>
            {typeof value}
          </span>
        </div>

        {/* Value change display */}
        <div className="flex items-center gap-2 flex-1 justify-end font-mono">
          {changed && prevValue !== undefined && prevValue !== value && (
            <span
              className="text-xs line-through"
              style={{ color: '#686765' }}
            >
              {String(prevValue)}
            </span>
          )}

          {changed && prevValue !== undefined && prevValue !== value && (
            <span style={{ color: '#a8a7a5', fontSize: 11 }}>→</span>
          )}

          <motion.span
            key={String(value)}
            initial={changed ? { scale: 1.25, color: '#E6E0F0' } : {}}
            animate={{ scale: 1, color: changed ? '#E6E0F0' : '#E5E4E2' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-xs md:text-sm font-bold"
          >
            {isBoolean ? (value ? 'true' : 'false') : String(value)}
          </motion.span>

          {/* Change pulse dot */}
          {changed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#E6E0F0', boxShadow: '0 0 8px #E6E0F0' }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function VariableInspector() {
  const { currentStep, currentStepIndex, trace } = useLearningStore();
  const prevStep = currentStepIndex > 0 ? trace[currentStepIndex - 1] : null;
  const prevVars = prevStep?.variables ?? {};

  if (!currentStep) return null;

  const vars = currentStep.variables;
  const entries = Object.entries(vars);

  if (entries.length === 0) return null;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: '#686765' }}
        >
          Variable Inspector
        </span>
        <span
          className="text-[11px] font-mono px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(110, 78, 55, 0.25)', color: '#E5E4E2', border: '1px solid rgba(110, 78, 55, 0.3)' }}
        >
          {entries.length} active
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="sync">
          {entries.map(([name, value]) => {
            const prevValue = prevVars[name];
            const changed = prevValue !== undefined && prevValue !== value;
            return (
              <VarCard
                key={name}
                name={name}
                value={value}
                prevValue={prevValue}
                changed={changed}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
