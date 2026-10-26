import React, { useState, useEffect } from 'react';
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
import {
  Database,
  Terminal,
  Sparkles,
  SlidersHorizontal,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Code,
  BarChart2,
} from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'visualizer' | 'editor'>('visualizer');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Reusable Visualizer Component
  const visualizerContent = (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0d0804' }}>
      {/* 1. Predict Mode Banner */}
      <PredictQuiz />

      {/* 1.5 Real-Time Telemetry HUD & Complexity Badges */}
      <TelemetryHUD />

      {/* 2. Array Input Generator & Visualizer */}
      {hasArray && (
        <div
          className="flex flex-col flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(110,78,55,0.2)' }}
        >
          <ArrayInputBar />
          <div style={{ height: isMobile ? 210 : 260 }}>
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
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0 overflow-x-auto no-scrollbar"
        style={{ background: '#1a130c', borderBottom: '1px solid rgba(110,78,55,0.2)' }}
      >
        <button
          onClick={() => setActiveTab('variables')}
          className="flex items-center gap-1 text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all flex-shrink-0"
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
          className="flex items-center gap-1 text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all flex-shrink-0"
          style={{
            background: activeTab === 'memory' ? 'rgba(110,78,55,0.35)' : 'transparent',
            color: activeTab === 'memory' ? '#E6E0F0' : '#686765',
            border: activeTab === 'memory' ? '1px solid #6F4E37' : '1px solid transparent',
          }}
        >
          <Database size={12} />
          <span className="hidden sm:inline">Call Stack &</span> RAM
        </button>

        <button
          onClick={() => setActiveTab('console')}
          className="flex items-center gap-1 text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all flex-shrink-0"
          style={{
            background: activeTab === 'console' ? 'rgba(110,78,55,0.35)' : 'transparent',
            color: activeTab === 'console' ? '#E6E0F0' : '#686765',
            border: activeTab === 'console' ? '1px solid #6F4E37' : '1px solid transparent',
          }}
        >
          <Terminal size={12} />
          <span>Console</span>
        </button>
      </div>

      {/* 5. Lower Inspector Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'variables' && <VariableInspector />}
        {activeTab === 'memory' && <MemoryHeapInspector />}
        {activeTab === 'console' && (
          <div className="h-full min-h-[160px]">
            <ConsolePanel />
          </div>
        )}
      </div>
    </div>
  );

  // Reusable Editor Component
  const editorContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <CodeEditor />
      </div>
      <div style={{ background: '#1a130c', borderTop: '1px solid rgba(110,78,55,0.15)', flexShrink: 0 }}>
        <ExecutionToolbar />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: '#0d0804' }}
    >
      {/* ── Top Header Bar ── */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-2 flex-shrink-0 gap-2 border-b"
        style={{ background: '#1a130c', borderColor: 'rgba(110,78,55,0.15)', minHeight: 46 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Arrow button to collapse / bring back the sidebar */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95 group cursor-pointer flex-shrink-0"
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
                <span className="hidden sm:inline text-[11px] font-mono tracking-tight">Steps</span>
              </>
            ) : (
              <>
                <ChevronLeft size={15} className="text-platinum transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline text-[11px] font-mono tracking-tight text-[#a8a7a5]">Hide</span>
              </>
            )}
          </button>

          <span className="text-lg sm:text-xl flex-shrink-0">{currentLesson.icon}</span>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold leading-tight truncate" style={{ color: '#E5E4E2' }}>
              {currentLesson.title}
            </h2>
            <p className="text-[10px] sm:text-xs truncate" style={{ color: '#686765' }}>
              {currentLesson.difficulty} · {currentLesson.steps} steps
            </p>
          </div>
        </div>

        {/* Center / Mobile View Switcher (Visible on screens < 768px) */}
        {isMobile && (
          <div className="flex items-center bg-[#0d0804] p-0.5 rounded-lg border border-mocha-800/60 flex-shrink-0">
            <button
              onClick={() => setMobileView('visualizer')}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all"
              style={{
                background: mobileView === 'visualizer' ? '#6F4E37' : 'transparent',
                color: mobileView === 'visualizer' ? '#E5E4E2' : '#888',
              }}
            >
              <BarChart2 size={12} />
              <span>Vis</span>
            </button>
            <button
              onClick={() => setMobileView('editor')}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all"
              style={{
                background: mobileView === 'editor' ? '#6F4E37' : 'transparent',
                color: mobileView === 'editor' ? '#E5E4E2' : '#888',
              }}
            >
              <Code size={12} />
              <span>Code</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Top Play/Pause and Reset Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePlayPause}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                border: '1px solid rgba(229, 228, 226, 0.25)',
                boxShadow: '0 0 14px rgba(110, 78, 55, 0.45)',
              }}
              title={isPlaying ? 'Pause execution' : isLast ? 'Replay from start' : 'Play execution'}
            >
              {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : isLast ? 'Replay' : 'Play'}</span>
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
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Predict Quiz Mode Toggle (hidden on very narrow mobile headers to prevent overflow) */}
          <button
            onClick={() => setPredictMode(!predictMode)}
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all hover:scale-105 font-medium flex-shrink-0"
            style={{
              background: predictMode ? 'rgba(230, 224, 240, 0.2)' : 'rgba(229, 228, 226, 0.04)',
              color: predictMode ? '#E6E0F0' : '#686765',
              border: `1px solid ${predictMode ? '#E6E0F0' : 'rgba(110,78,55,0.25)'}`,
            }}
          >
            <Sparkles size={11} color={predictMode ? '#E6E0F0' : '#686765'} />
            <span>Predict: {predictMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Fluid Scrubber */}
          <div className="hidden md:block">
            <StepTimeline />
          </div>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Lesson Sidebar */}
        <LessonSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

        {/* Floating Arrow Tab at the seam on desktop when collapsed */}
        {sidebarCollapsed && !isMobile && (
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

        {/* Responsive Content Area */}
        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            /* MOBILE LAYOUT: Full-Width Active View with Bottom Control Toolbar */
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-hidden">
                {mobileView === 'visualizer' ? visualizerContent : editorContent}
              </div>
              {/* On mobile in visualizer mode, render execution toolbar at the bottom so steps can be advanced easily */}
              {mobileView === 'visualizer' && (
                <div style={{ background: '#1a130c', borderTop: '1px solid rgba(110,78,55,0.2)', flexShrink: 0 }}>
                  <ExecutionToolbar />
                </div>
              )}
            </div>
          ) : (
            /* DESKTOP LAYOUT: Horizontal Resizable Panel Group */
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={42} minSize={28}>
                {editorContent}
              </Panel>

              <ResizeHandle direction="vertical" />

              <Panel defaultSize={58} minSize={32}>
                {visualizerContent}
              </Panel>
            </PanelGroup>
          )}
        </div>
      </div>
    </motion.div>
  );
}
