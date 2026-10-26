import React from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { Database, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function MemoryHeapInspector() {
  const { currentStep, currentLesson } = useLearningStore();

  if (!currentStep) return null;

  const vars = currentStep.variables;
  const arr = currentStep.array || [];
  const j = typeof vars.j === 'number' ? vars.j : -1;
  const i = typeof vars.i === 'number' ? vars.i : -1;

  return (
    <div className="p-4" style={{ background: '#0d0804', borderTop: '1px solid rgba(110, 78, 55, 0.15)' }}>
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database size={13} color="#6F4E37" />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#686765' }}>
            Call Stack & Memory Heap
          </span>
        </div>
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded"
          style={{ background: 'rgba(110, 78, 55, 0.18)', color: '#E6E0F0', border: '1px solid rgba(110, 78, 55, 0.3)' }}
        >
          RAM Map
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* LEFT: Call Stack */}
        <div
          className="rounded-xl p-3"
          style={{
            background: 'rgba(26, 19, 12, 0.6)',
            border: '1px solid rgba(110, 78, 55, 0.25)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <Layers size={12} color="#E6E0F0" />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#E5E4E2' }}>
              Execution Call Stack
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Active Stack Frame */}
            <motion.div
              layout
              className="p-2.5 rounded-lg text-xs font-mono"
              style={{
                background: 'rgba(110, 78, 55, 0.25)',
                border: '1px solid #6F4E37',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold" style={{ color: '#E6E0F0' }}>
                  {currentLesson?.id === 'bubble-sort' ? 'bubbleSort(arr)' : 'main()'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded" style={{ background: '#6F4E37', color: '#E5E4E2' }}>
                  ACTIVE FRAME
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 text-[11px] mt-1 pt-1 border-t" style={{ borderColor: 'rgba(110, 78, 55, 0.25)' }}>
                <div>
                  <span style={{ color: '#686765' }}>i = </span>
                  <span style={{ color: '#E5E4E2' }}>{i >= 0 ? i : '0'}</span>
                </div>
                <div>
                  <span style={{ color: '#686765' }}>j = </span>
                  <span style={{ color: '#E5E4E2' }}>{j >= 0 ? j : '0'}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1 mt-0.5 text-[10px]">
                  <span style={{ color: '#686765' }}>arr_ptr → </span>
                  <span style={{ color: '#E6E0F0' }}>0x7FFE_4A10 (Heap)</span>
                </div>
              </div>
            </motion.div>

            {/* Parent Stack Frame */}
            <div
              className="p-2 rounded-lg text-xs font-mono opacity-60"
              style={{
                background: 'rgba(229, 228, 226, 0.03)',
                border: '1px solid rgba(229, 228, 226, 0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ color: '#a8a7a5' }}>Global Context</span>
                <span className="text-[10px]" style={{ color: '#505050' }}>0x7FFE_0000</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Heap Memory */}
        <div
          className="rounded-xl p-3"
          style={{
            background: 'rgba(26, 19, 12, 0.6)',
            border: '1px solid rgba(110, 78, 55, 0.25)',
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#E5E4E2' }}>
              Heap Array (0x7FFE_4A10)
            </span>
            <span className="text-[10px] font-mono" style={{ color: '#686765' }}>
              4 bytes/element
            </span>
          </div>

          {/* Heap Memory Cells */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {arr.map((val, idx) => {
              const isJ = idx === j;
              const isJ1 = idx === j + 1;
              const isActive = isJ || isJ1;

              return (
                <div key={idx} className="flex-1 min-w-[48px] text-center font-mono">
                  {/* Pointer arrow indicator */}
                  <div className="h-4 flex items-center justify-center text-[10px] font-bold">
                    {isJ && <span style={{ color: '#6F4E37' }}>j▼</span>}
                    {isJ1 && <span style={{ color: '#E6E0F0' }}>j+1▼</span>}
                  </div>

                  {/* Memory Cell */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      borderColor: isActive ? (isJ ? '#6F4E37' : '#E6E0F0') : 'rgba(110, 78, 55, 0.25)',
                      backgroundColor: isActive ? 'rgba(110, 78, 55, 0.3)' : 'rgba(13, 8, 4, 0.8)',
                    }}
                    className="p-1.5 rounded-lg border text-xs font-bold"
                    style={{ color: '#E5E4E2' }}
                  >
                    {val}
                  </motion.div>

                  {/* Offset Address */}
                  <div className="text-[9px] mt-1" style={{ color: '#505050' }}>
                    +{String(idx * 4).padStart(2, '0')}h
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
