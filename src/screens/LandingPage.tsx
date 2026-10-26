import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLearningStore } from '../store/useLearningStore';
import { lessons } from '../data/lessons';
import { useHeroCanvas } from '../components/landing/useHeroCanvas';
import {
  ArrowRight, Code2, Eye, Zap, Layers,
  ChevronDown, Play, GitBranch, BarChart3, Terminal
} from 'lucide-react';

// ── Feature card data ────────────────────────────────────────────────────────
const features = [
  {
    icon: <Eye size={22} />,
    title: 'Execution Visualizer',
    desc: 'Every line of code becomes a live animation. Watch variables change, arrays shuffle, loops iterate — all in sync.',
    badge: 'Core',
  },
  {
    icon: <GitBranch size={22} />,
    title: 'Time-Travel Debugger',
    desc: 'Step backward and forward through any execution state. Replay comparisons, swaps, and variable mutations frame by frame.',
    badge: 'Unique',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Array Visualizer',
    desc: 'Animated bars respond to comparisons and swaps with spring physics. Watching Bubble Sort has never felt this satisfying.',
    badge: 'Visual',
  },
  {
    icon: <Code2 size={22} />,
    title: 'Monaco Code Editor',
    desc: 'Professional-grade editor with syntax highlighting, active line tracking, and a custom dark theme tuned for learning.',
    badge: 'Editor',
  },
  {
    icon: <Terminal size={22} />,
    title: 'Live Console',
    desc: 'Real-time output panel that logs each execution step with contextual explanations tied to the current code line.',
    badge: 'Output',
  },
  {
    icon: <Zap size={22} />,
    title: 'Speed Controls',
    desc: 'Go 0.5× slow-motion to study each step, or blast through at 3× to overview the full algorithm in seconds.',
    badge: 'Control',
  },
];

// ── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl font-bold" style={{ color: '#E5E4E2' }}>{value}</span>
      <span className="text-xs uppercase tracking-widest" style={{ color: '#686765' }}>{label}</span>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, badge, index }: typeof features[0] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      className="feature-card rounded-2xl p-6 cursor-default"
      style={{
        background: 'linear-gradient(145deg, rgba(110,78,55,0.1) 0%, rgba(13,8,4,0.85) 100%)',
        border: '1px solid rgba(110,78,55,0.2)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(110,78,55,0.2)', border: '1px solid rgba(110,78,55,0.35)', color: '#E5E4E2' }}
        >
          {icon}
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(230,224,240,0.1)', color: '#E6E0F0', border: '1px solid rgba(230,224,240,0.2)' }}
        >
          {badge}
        </span>
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: '#E5E4E2' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#686765' }}>{desc}</p>
    </motion.div>
  );
}

// ── Preview card (floating mini mockup) ──────────────────────────────────────
function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -20, x: 40 }}
      whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#1a130c',
          border: '1px solid rgba(110,78,55,0.3)',
          boxShadow: '0 24px 80px rgba(13,8,4,0.8), 0 0 0 1px rgba(110,78,55,0.15)',
          maxWidth: 520,
        }}
      >
        {/* Mock traffic lights */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#0d0804', borderBottom: '1px solid rgba(110,78,55,0.15)' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#f97316' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#eab308' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
          <span className="ml-3 text-xs" style={{ color: '#686765', fontFamily: 'monospace' }}>bubble-sort.js</span>
        </div>

        {/* Mock code + bars */}
        <div className="p-5">
          {/* Array bars preview */}
          <div className="flex items-end gap-2 mb-5" style={{ height: 80 }}>
            {[5, 2, 8, 1, 6, 4, 7, 3].map((v, i) => (
              <motion.div
                key={i}
                animate={{ height: `${(v / 8) * 100}%` }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                className="flex-1 rounded-md"
                style={{
                  background: i === 2 || i === 5
                    ? 'linear-gradient(to top, #6F4E37, #8a6245)'
                    : 'rgba(110,78,55,0.2)',
                  border: `1px solid ${i === 2 || i === 5 ? '#6F4E37' : 'rgba(110,78,55,0.25)'}`,
                  boxShadow: i === 2 || i === 5 ? '0 0 12px rgba(110,78,55,0.5)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Mock code lines */}
          {[
            { l: 'function bubbleSort(arr) {', active: false },
            { l: '  for (let i = 0; i < n-1; i++) {', active: false },
            { l: '    if (arr[j] > arr[j + 1]) {', active: true },
            { l: '      [arr[j], arr[j+1]] = [arr[j+1], arr[j]];', active: false },
            { l: '    }', active: false },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-1 rounded-md mb-0.5"
              style={{
                background: row.active ? 'rgba(110,78,55,0.25)' : 'transparent',
                borderLeft: row.active ? '2px solid #6F4E37' : '2px solid transparent',
              }}
            >
              <span className="text-xs w-4" style={{ color: '#686765', fontFamily: 'monospace' }}>{i + 1}</span>
              <span className="text-xs font-mono" style={{ color: row.active ? '#E5E4E2' : '#686765' }}>
                {row.l}
              </span>
            </div>
          ))}
        </div>

        {/* Mock toolbar */}
        <div
          className="flex items-center gap-3 px-5 py-3"
          style={{ background: '#0d0804', borderTop: '1px solid rgba(110,78,55,0.15)' }}
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)', color: '#E5E4E2' }}
          >
            <Play size={11} fill="currentColor" /> Play
          </div>
          <span className="text-xs" style={{ color: '#686765', fontFamily: 'monospace' }}>Step 7 / 21</span>
          <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(110,78,55,0.2)' }}>
            <div className="h-full rounded-full" style={{ width: '33%', background: 'linear-gradient(to right, #6F4E37, #E6E0F0)' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
export function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { goToScreen, setLesson } = useLearningStore();

  useHeroCanvas(canvasRef);

  const handleEnterLab = () => {
    const sort = lessons.find((l) => l.id === 'bubble-sort');
    if (sort) setLesson(sort);
    else goToScreen('dashboard');
  };

  return (
    <div className="relative" style={{ background: '#0d0804' }}>

      {/* ════════════════════════════════
          HERO — full viewport
      ════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>

        {/* 3D canvas */}
        <canvas
          ref={canvasRef}
          className="hero-canvas"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(13,8,4,0.55) 65%, rgba(13,8,4,0.92) 100%)',
          }}
        />

        {/* Moving scanline */}
        <div className="scanline" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(110,78,55,0.15)',
              border: '1px solid rgba(110,78,55,0.4)',
              color: '#E5E4E2',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6F4E37' }} />
            <span className="text-sm font-medium">Visual Coding Playground · Hackathon Edition</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-black leading-none mb-6"
            style={{ fontSize: 'clamp(52px, 9vw, 110px)', letterSpacing: '-0.03em' }}
          >
            <span className="block text-gradient-mocha">Code</span>
            <span
              className="block"
              style={{
                color: '#E5E4E2',
                textShadow: '0 0 60px rgba(110,78,55,0.6), 0 0 120px rgba(230,224,240,0.15)',
              }}
            >
              Quest
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#a8a7a5' }}
          >
            Make{' '}
            <span style={{ color: '#E6E0F0', fontStyle: 'italic' }}>invisible program execution</span>{' '}
            visible. Watch every comparison, swap, and variable mutation animate in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            {/* Primary CTA */}
            <button
              onClick={handleEnterLab}
              className="btn-shimmer relative overflow-hidden flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                boxShadow: '0 0 40px rgba(110,78,55,0.5), 0 4px 24px rgba(13,8,4,0.6)',
                border: '1px solid rgba(229,228,226,0.15)',
              }}
            >
              <Play size={16} fill="currentColor" />
              Enter the Lab
              <ArrowRight size={15} />
            </button>

            {/* Secondary */}
            <button
              onClick={() => goToScreen('dashboard')}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(229,228,226,0.05)',
                color: '#E5E4E2',
                border: '1px solid rgba(229,228,226,0.15)',
              }}
            >
              <Layers size={15} />
              Browse Lessons
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center justify-center gap-4 sm:gap-10 mt-8 sm:mt-14 flex-wrap"
          >
            <StatPill value="240" label="Frame Perfect" />
            <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(110,78,55,0.3)' }} />
            <StatPill value="21" label="Execution Steps" />
            <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(110,78,55,0.3)' }} />
            <StatPill value="3×" label="Speed Modes" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: '#686765' }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          PRODUCT PREVIEW + COPY
      ════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(110,78,55,0.08) 0%, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: 'rgba(110,78,55,0.15)', color: '#E6E0F0', border: '1px solid rgba(110,78,55,0.3)' }}
            >
              <Eye size={12} /> Visual Execution Lab
            </div>
            <h2
              className="text-4xl font-bold mb-5 leading-tight"
              style={{ color: '#E5E4E2', letterSpacing: '-0.02em' }}
            >
              Every program step becomes{' '}
              <span className="text-gradient-lavender">observable</span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#686765' }}>
              Traditional tutorials show code and output but leave execution invisible. CodeQuest
              connects every line of source code to a live animated visualization — so students
              don't just see that Bubble Sort works, they understand{' '}
              <em style={{ color: '#a8a7a5' }}>why</em> each comparison and swap happens.
            </p>
            <div className="flex flex-col gap-3">
              {['Active line tracks execution in Monaco', 'Spring-animated array bars respond to swaps', 'Variable inspector shows old → new diffs', 'Clickable timeline scrubber for time-travel'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: '#a8a7a5' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#6F4E37' }} />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div className="flex justify-center lg:justify-end">
            <PreviewCard />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES GRID
      ════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: 'rgba(26,19,12,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#E5E4E2', letterSpacing: '-0.02em' }}>
              Everything you need to <span className="text-gradient-mocha">visualize code</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#686765' }}>
              Six tightly integrated components — all reading from one shared execution state.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FINAL CTA BANNER
      ════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto rounded-3xl overflow-hidden relative text-center p-6 sm:p-14"
          style={{
            background: 'linear-gradient(135deg, #2a1e13 0%, #1a130c 50%, #1a0f1a 100%)',
            border: '1px solid rgba(110,78,55,0.35)',
            boxShadow: '0 0 80px rgba(110,78,55,0.2)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(110,78,55,0.25) 0%, transparent 65%)' }}
          />
          <div className="relative">
            <div className="text-5xl mb-4">🫧</div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#E5E4E2', letterSpacing: '-0.02em' }}>
              Watch Bubble Sort come alive
            </h2>
            <p className="text-base mb-8" style={{ color: '#686765' }}>
              21 animated steps. Time-travel debugging. Variable inspector. All in 8 minutes.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={handleEnterLab}
                className="btn-shimmer relative overflow-hidden flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                  color: '#E5E4E2',
                  boxShadow: '0 0 40px rgba(110,78,55,0.45)',
                  border: '1px solid rgba(229,228,226,0.12)',
                }}
              >
                <Play size={15} fill="currentColor" />
                Start the Hero Demo
              </button>
              <button
                onClick={() => goToScreen('dashboard')}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(229,228,226,0.05)', color: '#a8a7a5', border: '1px solid rgba(229,228,226,0.12)' }}
              >
                <Layers size={14} />
                All Lessons
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 text-sm"
        style={{ color: '#3a3a3a', borderTop: '1px solid rgba(110,78,55,0.1)' }}
      >
        <span>CodeQuest · </span>
        <span style={{ color: '#6F4E37' }}>Mocha Brown</span>
        <span> · </span>
        <span style={{ color: '#E5E4E2' }}>Platinum Silver</span>
        <span> · </span>
        <span style={{ color: '#E6E0F0' }}>Pale Lavender</span>
        <span> · Hackathon 2026</span>
      </footer>
    </div>
  );
}
