import React, { useState } from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { Dna, Shuffle, TrendingDown, CheckCircle, Sparkles, PlusCircle } from 'lucide-react';

export function ArrayInputBar() {
  const { applyCustomArray, currentStep, currentLesson } = useLearningStore();
  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: 'Default', arr: [5, 2, 4, 1, 3], icon: <CheckCircle size={11} /> },
    { label: 'Reverse', arr: [9, 8, 7, 6, 5, 4, 3, 2, 1], icon: <TrendingDown size={11} /> },
    { label: 'Nearly Sorted', arr: [1, 2, 3, 5, 4, 6, 7], icon: <Sparkles size={11} /> },
    { label: 'Big Values', arr: [85, 12, 99, 43, 67, 24], icon: <PlusCircle size={11} /> },
  ];

  const handleRandomize = (count: number = 6) => {
    setError(null);
    const generated: number[] = [];
    while (generated.length < count) {
      const r = Math.floor(Math.random() * 95) + 5;
      if (!generated.includes(r)) generated.push(r);
    }
    applyCustomArray(generated);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nums = customInput
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);

    if (nums.length < 2) {
      setError('Enter at least 2 numbers');
      return;
    }
    if (nums.length > 25) {
      setError('Max 25 numbers for optimal display');
      return;
    }
    if (nums.some(isNaN)) {
      setError('Please enter valid numeric digits');
      return;
    }

    applyCustomArray(nums);
    setCustomInput('');
  };

  if (!currentStep?.array || currentStep.array.length === 0) return null;

  return (
    <div
      className="px-4 py-2 flex items-center justify-between gap-3 border-b flex-wrap flex-shrink-0"
      style={{
        background: 'rgba(26, 19, 12, 0.95)',
        borderColor: 'rgba(110, 78, 55, 0.25)',
      }}
    >
      {/* Left: Presets & Randomizers */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-bold uppercase tracking-wider mr-1" style={{ color: '#686765' }}>
          Array:
        </span>

        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setError(null);
              applyCustomArray(p.arr);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all hover:scale-105"
            style={{
              background: 'rgba(229, 228, 226, 0.05)',
              color: '#E5E4E2',
              border: '1px solid rgba(110, 78, 55, 0.25)',
            }}
          >
            <span style={{ color: '#6F4E37' }}>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}

        {/* Random 6 */}
        <button
          onClick={() => handleRandomize(6)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all hover:scale-105"
          style={{
            background: 'rgba(110, 78, 55, 0.2)',
            color: '#E6E0F0',
            border: '1px solid rgba(110, 78, 55, 0.4)',
          }}
          title="Random 6 numbers"
        >
          <Shuffle size={11} color="#E6E0F0" />
          <span>Rand 6</span>
        </button>

        {/* Random 10 */}
        <button
          onClick={() => handleRandomize(10)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all hover:scale-105"
          style={{
            background: 'rgba(110, 78, 55, 0.2)',
            color: '#E6E0F0',
            border: '1px solid rgba(110, 78, 55, 0.4)',
          }}
          title="Random 10 numbers"
        >
          <Shuffle size={11} color="#E6E0F0" />
          <span>Rand 10</span>
        </button>
      </div>

      {/* Right: Enter any numbers form */}
      <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 flex-1 max-w-sm justify-end">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type ANY numbers (e.g. 42, 7, 99, 15, 3)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full px-2.5 py-1 rounded-md text-xs font-mono outline-none transition-all"
            style={{
              background: '#0d0804',
              color: '#E5E4E2',
              border: '1px solid rgba(110, 78, 55, 0.4)',
            }}
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all hover:scale-105 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
            color: '#E5E4E2',
            border: '1px solid rgba(229, 228, 226, 0.2)',
          }}
        >
          <Dna size={12} />
          <span>Apply</span>
        </button>

        {error && (
          <span className="text-[10px] text-red-400 font-mono whitespace-nowrap ml-1">{error}</span>
        )}
      </form>
    </div>
  );
}
