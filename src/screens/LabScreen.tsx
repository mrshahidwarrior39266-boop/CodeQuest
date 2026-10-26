import React, { useState } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { usePlayback } from '../engine/replay';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { CodeEditor } from '../components/editor/CodeEditor';
import { ArrayVisualizer } from '../components/visualizer/ArrayVisualizer';
import { ArrayInputBar } from '../components/visualizer/ArrayInputBar';
import { VariableInspector } from '../components/visualizer/VariableInspector';
import { MemoryHeapInspector } from '../components/visualizer/MemoryHeapInspector';
import { StepTimeline } from '../components/visualizer/StepTimeline';
import { ConsolePanel } from '../components/visualizer/ConsolePanel';
import { ExecutionToolbar } from '../components/editor/ExecutionToolbar';
import { StepExplanation } from '../components/feedback/StepExplanation';
import { PredictQuiz } from '../components/feedback/PredictQuiz';
import { TelemetryHUD } from '../components/visualizer/TelemetryHUD';
import { LessonSidebar } from '../components/layout/LessonSidebar';
import { motion } from 'framer-motion';
import { Database, Terminal, Sparkles, SlidersHorizontal, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

function ResizeHandle({ direction = 'vertical' }: { direction?: 'vertical' | 'horizontal' }) {
  return (
    <PanelResizeHandle
      className="group flex items-center justify-center transition-colors"
      style={{
        background: 'rgba(110,78,55,0.08)',
        width: direction === 'vertical' ? 5 : '100%',
        height: direction === 'vertical' ? '100%' : 5,
        cursor: direction === 'vertical' ? 'col-resize' : 'row-resize',
      }}
    >
      <div
        className="transition-all group-hover:opacity-100 opacity-0 rounded-full"
        style={{
          background: '#6F4E37',
          width: direction === 'vertical' ? 3 : 40,
          height: direction === 'vertical' ? 40 : 3,
        }}
      />
    </PanelResizeHandle>
  );
}

export function LabScreen() {
  usePlayback();
  const {
    currentLesson,
    currentStep,
    currentStepIndex,
    trace,
    isPlaying,
    setPlaying,
    reset,
    predictMode,
    setPredictMode,
  } = useLearningStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'variables' | 'memory' | 'console'>('variables');

  if (!currentLesson) return null;

  const hasArray = (currentStep?.array?.length ?? 0) > 0;
  const totalSteps = trace.length;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex >= totalSteps - 1;

  const handlePlayPause = () => {
    if (isLast) {
      reset();
      setPlaying(true);
      return;
    }
    setPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: '#0d0804' }}
    >
      {/* ── Top Header Bar with Play/Pause button on the left of Predict Mode ── */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: '#1a130c', borderBottom: '1px solid rgba(110,78,55,0.15)', minHeight: 46 }}
      >
        <div className="flex items-center gap-3">
          {/* Arrow button to collapse / bring back the sidebar */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            style={{
              background: sidebarCollapsed ? 'rgba(110, 78, 55, 0.45)' : 'rgba(110, 78, 55, 0.18)',
              border: `1px solid ${sidebarCollapsed ? '#E6E0F0' : 'rgba(110, 78, 55, 0.35)'}`,
              color: sidebarCollapsed ? '#E6E0F0' : '#E5E4E2',
              boxShadow: sidebarCollapsed ? '0 0 14px rgba(230, 224, 240, 0.35)' : 'none',
            }}
            title={sidebarCollapsed ? 'Click arrow to bring back sidebar' : 'Click arrow to collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Bring back sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <>
                <ChevronRight size={15} className="text-lavender-200 transition-transform group-hover:translate-x-0.5" />
                <span className="hidden sm:inline text-[11px] font-mono tracking-tight">Show Steps</span>
              </>
            ) : (
              <>
                <ChevronLeft size={15} className="text-platinum transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline text-[11px] font-mono tracking-tight text-[#a8a7a5]">Hide Steps</span>
              </>
            )}
          </button>

          <span className="text-xl">{currentLesson.icon}</span>
          <div>
            <h2 className="text-sm font-semibold leading-tight" style={{ color: '#E5E4E2' }}>
              {currentLesson.title}
            </h2>
            <p className="text-xs" style={{ color: '#686765' }}>
              {currentLesson.difficulty} · {currentLesson.category} · {currentLesson.steps} steps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Top Play/Pause and Reset Buttons (Directly to the left of Predict Mode) */}
          <div className="flex items-center gap-1.5 mr-1">
            <button
              onClick={handlePlayPause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                border: '1px solid rgba(229, 228, 226, 0.25)',
                boxShadow: '0 0 14px rgba(110, 78, 55, 0.45)',
              }}
              title={isPlaying ? 'Pause execution' : isLast ? 'Replay from start' : 'Play execution'}
            >
              {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
              <span>{isPlaying ? 'Pause' : isLast ? 'Replay' : 'Play'}</span>
            </button>

            <button
              onClick={reset}
              disabled={isFirst}
              className="p-1.5 rounded-lg text-xs transition-all hover:scale-105"
              style={{
                background: 'rgba(229, 228, 226, 0.05)',
                color: isFirst ? '#505050' : '#a8a7a5',
                border: '1px solid rgba(110, 78, 55, 0.25)',
                cursor: isFirst ? 'not-allowed' : 'pointer',
              }}
              title="Reset execution"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Predict Quiz Mode Toggle */}
          <button
            onClick={() => setPredictMode(!predictMode)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all hover:scale-105 font-medium"
            style={{
              background: predictMode ? 'rgba(230, 224, 240, 0.2)' : 'rgba(229, 228, 226, 0.04)',
              color: predictMode ? '#E6E0F0' : '#686765',
              border: `1px solid ${predictMode ? '#E6E0F0' : 'rgba(110,78,55,0.25)'}`,
            }}
          >
            <Sparkles size={11} color={predictMode ? '#E6E0F0' : '#686765'} />
            <span>Predict Mode: {predictMode ? 'ON' : 'OFF'}</span>
          </button>

          <StepTimeline />
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Lesson Sidebar */}
        <LessonSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

        {/* Floating Arrow Tab at the seam when collapsed so user can immediately bring it back */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-[44px] top-12 z-30 flex items-center gap-1.5 py-2 px-2.5 rounded-r-xl shadow-2xl transition-all hover:translate-x-1 hover:brightness-110 active:scale-95 cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, #6F4E37, #4e3524)',
              color: '#E5E4E2',
              border: '1px solid rgba(229, 228, 226, 0.4)',
              borderLeft: 'none',
              boxShadow: '4px 2px 20px rgba(110, 78, 55, 0.75)',
            }}
            title="Click arrow to bring back lesson sidebar"
            aria-label="Bring back sidebar"
          >
            <ChevronRight size={16} className="text-lavender transition-transform group-hover:translate-x-0.5 animate-pulse" />
            <span className="text-[11px] font-bold font-mono tracking-wider text-platinum">STEPS</span>
          </button>
        )}

        {/* Resizable Panel Group (Left Editor / Right Visualizer) */}
        <div className="flex-1 overflow-hidden">
          <PanelGroup direction="horizontal" className="h-full">
            {/* ── LEFT: Code Editor + Execution Toolbar ── */}
            <Panel defaultSize={42} minSize={28}>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-hidden">
                  <CodeEditor />
                </div>
                <div style={{ background: '#1a130c', borderTop: '1px solid rgba(110,78,55,0.15)', flexShrink: 0 }}>
                  <ExecutionToolbar />
                </div>
              </div>
            </Panel>

            <ResizeHandle direction="vertical" />

            {/* ── RIGHT: Visualizer Workspace (Permanently anchored at top) ── */}
            <Panel defaultSize={58} minSize={32}>
              <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0d0804' }}>
                {/* 1. Predict Mode Banner */}
                <PredictQuiz />

                {/* 1.5 Real-Time Telemetry HUD & Complexity Badges */}
                <TelemetryHUD />

                {/* 2. Array Input Generator & Visualizer (Always at top, never scrolled away) */}
                {hasArray && (
                  <div
                    className="flex flex-col flex-shrink-0"
                    style={{ borderBottom: '1px solid rgba(110,78,55,0.2)' }}
                  >
                    <ArrayInputBar />
                    <div style={{ height: 260 }}>
                      <ArrayVisualizer />
                    </div>
                  </div>
                )}

                {/* 3. Plain-English Step Explanation */}
                <div
                  className="flex-shrink-0"
                  style={{
                    background: '#120d08',
                    borderBottom: '1px solid rgba(110,78,55,0.15)',
                  }}
                >
                  <StepExplanation />
                </div>

                {/* 4. Tab Navigation for Bottom Inspector Area */}
                <div
                  className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
                  style={{ background: '#1a130c', borderBottom: '1px solid rgba(110,78,55,0.2)' }}
                >
                  <button
                    onClick={() => setActiveTab('variables')}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{
                      background: activeTab === 'variables' ? 'rgba(110,78,55,0.35)' : 'transparent',
                      color: activeTab === 'variables' ? '#E6E0F0' : '#686765',
                      border: activeTab === 'variables' ? '1px solid #6F4E37' : '1px solid transparent',
                    }}
                  >
                    <SlidersHorizontal size={12} />
                    <span>Variables</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('memory')}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{
                      background: activeTab === 'memory' ? 'rgba(110,78,55,0.35)' : 'transparent',
                      color: activeTab === 'memory' ? '#E6E0F0' : '#686765',
                      border: activeTab === 'memory' ? '1px solid #6F4E37' : '1px solid transparent',
                    }}
                  >
                    <Database size={12} />
                    <span>Call Stack & RAM</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('console')}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{
                      background: activeTab === 'console' ? 'rgba(110,78,55,0.35)' : 'transparent',
                      color: activeTab === 'console' ? '#E6E0F0' : '#686765',
                      border: activeTab === 'console' ? '1px solid #6F4E37' : '1px solid transparent',
                    }}
                  >
                    <Terminal size={12} />
                    <span>Terminal Console</span>
                  </button>
                </div>

                {/* 5. Lower Inspector Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {activeTab === 'variables' && <VariableInspector />}
                  {activeTab === 'memory' && <MemoryHeapInspector />}
                  {activeTab === 'console' && (
                    <div className="h-full min-h-[180px]">
                      <ConsolePanel />
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </motion.div>
  );
}
