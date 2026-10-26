import React from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw,
  ChevronLeft, ChevronRight, Gauge, Trophy,
  Volume2, VolumeX, Sparkles, Flag
} from 'lucide-react';

const SPEEDS = [
  { label: '0.5×', value: 1600 },
  { label: '1×',   value: 800  },
  { label: '2×',   value: 400  },
  { label: '3×',   value: 200  },
];

function ControlBtn({
  onClick,
  disabled = false,
  title,
  children,
  variant = 'default',
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary';
}) {
  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        flexShrink: 0,
        background: isPrimary
          ? disabled
            ? '#3d2a1c'
            : 'linear-gradient(135deg, #6F4E37, #5a3e2b)'
          : 'rgba(229, 228, 226, 0.05)',
        color: disabled ? '#505050' : isPrimary ? '#E5E4E2' : '#a8a7a5',
        border: isPrimary ? '1px solid rgba(229, 228, 226, 0.2)' : '1px solid rgba(110, 78, 55, 0.25)',
        boxShadow: isPrimary && !disabled ? '0 0 16px rgba(110, 78, 55, 0.4)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
          if (!isPrimary) (e.currentTarget as HTMLButtonElement).style.borderColor = '#6F4E37';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        if (!isPrimary) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(110, 78, 55, 0.25)';
      }}
    >
      {children}
    </button>
  );
}

export function ExecutionToolbar() {
  const {
    isPlaying, setPlaying,
    currentStepIndex, trace,
    nextStep, prevStep, reset,
    speed, setSpeed,
    completeLesson,
    jumpToStep,
    isSoundEnabled, toggleSound,
    predictMode, setPredictMode,
    goToScreen,
  } = useLearningStore();

  const totalSteps = trace.length;
  const isFirst = currentStepIndex === 0;
  const isLast  = currentStepIndex >= totalSteps - 1;

  const handlePlayPause = () => {
    if (isLast) {
      completeLesson();
      return;
    }
    setPlaying(!isPlaying);
  };

  return (
    <div className="px-4 py-2.5 flex items-center gap-3 flex-wrap justify-between" style={{ minHeight: 52 }}>
      {/* Left: Step counter & playback controls */}
      <div className="flex items-center gap-2">
        <div className="text-xs font-mono pr-1.5" style={{ color: '#686765', minWidth: 64 }}>
          Step{' '}
          <span style={{ color: '#E6E0F0', fontWeight: 700 }}>
            {currentStepIndex + 1}
          </span>
          <span> / {totalSteps}</span>
        </div>

        {/* Buttons */}
        <ControlBtn onClick={reset} disabled={isFirst} title="Reset">
          <RotateCcw size={14} />
        </ControlBtn>
        <ControlBtn onClick={() => jumpToStep(0)} disabled={isFirst} title="First Step">
          <SkipBack size={14} />
        </ControlBtn>
        <ControlBtn onClick={prevStep} disabled={isFirst} title="Previous Step">
          <ChevronLeft size={15} />
        </ControlBtn>

        {/* Play/Pause Toggle */}
        <ControlBtn
          onClick={handlePlayPause}
          variant="primary"
          title={isPlaying ? 'Pause execution' : isLast ? 'Finish lesson' : 'Play execution'}
        >
          {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
        </ControlBtn>

        <ControlBtn onClick={nextStep} disabled={isLast} title="Next Step">
          <ChevronRight size={15} />
        </ControlBtn>
        <ControlBtn onClick={() => jumpToStep(totalSteps - 1)} disabled={isLast} title="Last Step">
          <SkipForward size={14} />
        </ControlBtn>

        {/* Audio Sound Toggle */}
        <button
          onClick={toggleSound}
          title={isSoundEnabled ? 'Mute audio' : 'Unmute audio'}
          className="p-2 rounded-lg text-xs transition-all hover:scale-105"
          style={{
            background: isSoundEnabled ? 'rgba(110, 78, 55, 0.25)' : 'rgba(229, 228, 226, 0.04)',
            color: isSoundEnabled ? '#E6E0F0' : '#686765',
            border: isSoundEnabled ? '1px solid #6F4E37' : '1px solid rgba(110, 78, 55, 0.2)',
          }}
        >
          {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>

        {/* Predict Mode Toggle */}
        <button
          onClick={() => setPredictMode(!predictMode)}
          title="Predict next step challenge mode"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{
            background: predictMode ? 'rgba(230, 224, 240, 0.18)' : 'rgba(229, 228, 226, 0.04)',
            color: predictMode ? '#E6E0F0' : '#686765',
            border: predictMode ? '1px solid #E6E0F0' : '1px solid rgba(110, 78, 55, 0.2)',
          }}
        >
          <Sparkles size={12} color={predictMode ? '#E6E0F0' : '#686765'} />
          <span className="hidden sm:inline">Predict Mode:</span>
          <span>{predictMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Right: Speed, Race Mode & Finish CTA */}
      <div className="flex items-center gap-2.5">
        {/* Race Mode Shortcut */}
        <button
          onClick={() => goToScreen('race')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{
            background: 'rgba(110, 78, 55, 0.2)',
            color: '#E5E4E2',
            border: '1px solid rgba(110, 78, 55, 0.35)',
          }}
          title="Open Algorithm Race"
        >
          <Flag size={12} color="#E6E0F0" />
          <span className="hidden md:inline">Algorithm Race</span>
        </button>

        {/* Speed knobs */}
        <div className="flex items-center gap-1">
          <Gauge size={13} color="#686765" />
          <div className="flex gap-1">
            {SPEEDS.map((s) => {
              const active = speed === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setSpeed(s.value)}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: active ? 'rgba(110, 78, 55, 0.4)' : 'rgba(229, 228, 226, 0.04)',
                    color: active ? '#E6E0F0' : '#686765',
                    border: active ? '1px solid #6F4E37' : '1px solid rgba(229, 228, 226, 0.06)',
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Complete button if at end */}
        {isLast && (
          <button
            onClick={completeLesson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
              color: '#E5E4E2',
              border: '1px solid rgba(229, 228, 226, 0.25)',
              boxShadow: '0 0 16px rgba(110, 78, 55, 0.5)',
            }}
          >
            <Trophy size={13} color="#E6E0F0" />
            <span>Finish</span>
          </button>
        )}
      </div>
    </div>
  );
}
