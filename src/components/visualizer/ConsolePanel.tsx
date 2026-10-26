import React, { useEffect, useRef, useState } from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Trash2 } from 'lucide-react';

interface ConsoleLine {
  step: number;
  line: number;
  event: string;
  text: string;
}

const EVENT_ICON: Record<string, string> = {
  compare:    '🔍',
  swap:       '🔄',
  update:     '📝',
  complete:   '✅',
  highlight:  '▶',
  loop_check: '🔁',
};

export function ConsolePanel() {
  const { trace, currentStepIndex } = useLearningStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cleared, setCleared] = useState(0);

  // Build log lines up to current step
  const lines: ConsoleLine[] = trace.slice(0, currentStepIndex + 1).map((step, i) => ({
    step: i,
    line: step.line,
    event: step.event,
    text: step.consoleLine ?? step.explanation.replace(/^[^\w]+ ?/, '').slice(0, 90),
  }));

  // Auto-scroll ONLY inside this container, NEVER scroll the window or parent page
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [currentStepIndex]);

  const visible = lines.slice(cleared);

  return (
    <div className="h-full flex flex-col" style={{ background: '#0d0804' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: '#1a130c', borderBottom: '1px solid rgba(110,78,55,0.15)' }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={13} style={{ color: '#6F4E37' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#686765' }}>
            Live Execution Console
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'rgba(110,78,55,0.2)', color: '#E6E0F0' }}
          >
            {visible.length} entries
          </span>
        </div>
        <button
          onClick={() => setCleared(lines.length)}
          className="flex items-center gap-1 text-xs transition-colors hover:text-red-400"
          style={{ color: '#686765' }}
          title="Clear console view"
        >
          <Trash2 size={11} />
          Clear
        </button>
      </div>

      {/* Internal Scrollable Output Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence initial={false}>
          {visible.map((entry, idx) => {
            const isLatest = idx === visible.length - 1;
            return (
              <motion.div
                key={`${entry.step}-${entry.text}-${idx}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="console-line flex items-start gap-2 py-1 px-2 rounded-md mb-0.5"
                style={{
                  background: isLatest ? 'rgba(110,78,55,0.15)' : 'transparent',
                  borderLeft: isLatest ? '2px solid #6F4E37' : '2px solid transparent',
                }}
              >
                {/* Step + line */}
                <span className="flex-shrink-0 mt-px" style={{ color: '#505050', minWidth: 46 }}>
                  [{String(entry.step + 1).padStart(2, '0')}:{String(entry.line).padStart(2, '0')}]
                </span>
                {/* Event icon */}
                <span className="flex-shrink-0">{EVENT_ICON[entry.event] ?? '▸'}</span>
                {/* Message */}
                <span
                  style={{
                    color: isLatest ? '#E5E4E2' : '#a8a7a5',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {entry.text}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <div className="flex items-center justify-center h-full" style={{ color: '#505050' }}>
            <span>Console output will appear here as the program runs</span>
          </div>
        )}
      </div>

      {/* Terminal prompt bar */}
      <div
        className="px-3 py-1.5 flex items-center gap-2 flex-shrink-0 font-mono text-[11px]"
        style={{ borderTop: '1px solid rgba(110,78,55,0.1)', background: '#0d0804' }}
      >
        <span style={{ color: '#6F4E37' }}>›</span>
        <span style={{ color: '#686765' }}>
          {currentStepIndex < trace.length - 1
            ? `Ready · Step ${currentStepIndex + 1} of ${trace.length}`
            : 'Execution finished.'}
        </span>
      </div>
    </div>
  );
}
