import React from 'react';
import { lessons } from '../data/lessons';
import { useLearningStore } from '../store/useLearningStore';
import { ArrowRight, Clock, Layers, Star, Zap, Trophy, Flame, Compass, Play } from 'lucide-react';
import type { Lesson } from '../engine/types';
import { motion } from 'framer-motion';

const difficultyColor: Record<string, string> = {
  Beginner: '#E6E0F0',
  Intermediate: '#d4a882',
  Advanced: '#6F4E37',
};

function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const { setLesson, completedLessons } = useLearningStore();
  const isCompleted = completedLessons.includes(lesson.id);
  const isLocked = lesson.trace.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.15, duration: 0.4, ease: 'easeOut' }}
      onClick={() => !isLocked && setLesson(lesson)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #1a130c 0%, #120d08 100%)',
        border: '1px solid rgba(110, 78, 55, 0.25)',
        opacity: isLocked ? 0.6 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
      whileHover={!isLocked ? { scale: 1.02, borderColor: 'rgba(110, 78, 55, 0.7)', boxShadow: '0 8px 30px rgba(13,8,4,0.8), 0 0 20px rgba(110,78,55,0.3)' } : {}}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: 'linear-gradient(to right, #6F4E37, #E6E0F0, transparent)' }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{lesson.icon}</span>
            <div>
              <h3 className="font-semibold text-base" style={{ color: '#E5E4E2' }}>{lesson.title}</h3>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{
                  background: 'rgba(110, 78, 55, 0.2)',
                  color: difficultyColor[lesson.difficulty] || '#E5E4E2',
                  border: '1px solid rgba(110, 78, 55, 0.35)',
                }}
              >
                {lesson.difficulty}
              </span>
            </div>
          </div>
          {isCompleted && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(110, 78, 55, 0.3)', border: '1px solid #6F4E37' }}
            >
              <Trophy size={13} color="#E6E0F0" />
            </div>
          )}
          {isLocked && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(229,228,226,0.06)', color: '#686765' }}>
              Coming soon
            </span>
          )}
        </div>

        <p className="text-sm mb-5 leading-relaxed" style={{ color: '#a8a7a5' }}>
          {lesson.description}
        </p>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'rgba(110, 78, 55, 0.15)' }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: '#686765' }}>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {lesson.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Layers size={11} />
              {lesson.steps} steps
            </span>
            <span
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'rgba(230, 224, 240, 0.08)', color: '#E6E0F0' }}
            >
              {lesson.category}
            </span>
          </div>

          {!isLocked && (
            <div
              className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
              style={{ color: '#E6E0F0' }}
            >
              <span>Launch</span>
              <ArrowRight size={12} color="#E6E0F0" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const { completedLessons, goToScreen, setLesson } = useLearningStore();

  const handleLaunchHero = () => {
    const sortLesson = lessons.find(l => l.id === 'bubble-sort');
    if (sortLesson) setLesson(sortLesson);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0d0804' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header Navigation link back to 3D */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(110, 78, 55, 0.2)',
                color: '#E6E0F0',
                border: '1px solid rgba(110, 78, 55, 0.35)',
              }}
            >
              <Flame size={12} color="#6F4E37" />
              Mission Control
            </div>
          </div>

          <button
            onClick={() => goToScreen('landing')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{
              background: 'rgba(229, 228, 226, 0.06)',
              color: '#E5E4E2',
              border: '1px solid rgba(229, 228, 226, 0.15)',
            }}
          >
            <Compass size={13} color="#E6E0F0" />
            <span>View 3D Live Experience</span>
          </button>
        </div>

        {/* Hero title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight" style={{ color: '#E5E4E2' }}>
            Interactive <span className="text-gradient-mocha">Execution Playground</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: '#a8a7a5' }}>
            Choose a challenge to step inside the engine. Every line of code is synchronized with variable cards,
            spring-animated arrays, and time-travel replay.
          </p>

          {/* Stats Bar */}
          <div className="flex items-center gap-8 mt-6">
            {[
              { label: 'Available Modules', value: lessons.filter(l => l.trace.length > 0).length, icon: <Layers size={14} color="#6F4E37" /> },
              { label: 'Completed', value: completedLessons.length, icon: <Trophy size={14} color="#E6E0F0" /> },
              { label: 'XP Earned', value: completedLessons.length * 120, icon: <Star size={14} color="#d4a882" /> },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span>{stat.icon}</span>
                <span className="font-bold text-xl" style={{ color: '#E5E4E2' }}>{stat.value}</span>
                <span className="text-xs uppercase tracking-wider" style={{ color: '#686765' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Featured Card: Bubble Sort */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mb-12 rounded-3xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #2a1e13 0%, #1a130c 60%, #120d08 100%)',
            border: '1px solid rgba(110, 78, 55, 0.4)',
            boxShadow: '0 0 50px rgba(110, 78, 55, 0.25)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 85% 50%, rgba(110, 78, 55, 0.4) 0%, transparent 60%)',
            }}
          />
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={15} color="#E6E0F0" />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#E6E0F0' }}>
                  Hero Demonstration
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#E5E4E2' }}>
                Bubble Sort Visualizer
              </h2>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: '#a8a7a5' }}>
                Trace 21 animated execution steps with live array comparisons, spring swaps,
                and real-time variable mutations.
              </p>
            </div>

            <button
              onClick={handleLaunchHero}
              className="btn-shimmer relative overflow-hidden flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                boxShadow: '0 0 30px rgba(110, 78, 55, 0.5)',
                border: '1px solid rgba(229, 228, 226, 0.2)',
              }}
            >
              <Play size={15} fill="currentColor" />
              <span>Launch Execution Lab</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>

        {/* Learning Paths Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight" style={{ color: '#E5E4E2' }}>
              Select Lesson
            </h2>
            <span className="text-xs" style={{ color: '#686765' }}>
              Choose a track to start interactive code tracing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lessons.map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
