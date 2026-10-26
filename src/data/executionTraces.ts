import type { ExecutionStep } from '../engine/types';

// ─────────────────────────────────────────────
//  Bubble Sort trace for [5, 2, 4, 1, 3]
// ─────────────────────────────────────────────
export const bubbleSortTrace: ExecutionStep[] = [
  {
    line: 1,
    variables: { n: 5, i: 0, j: 0 },
    array: [5, 2, 4, 1, 3],
    event: 'highlight',
    explanation: '🚀 Starting Bubble Sort with array [5, 2, 4, 1, 3]. We will compare adjacent elements and swap them if they are in the wrong order.',
  },
  // Pass 1
  { line: 3, variables: { n: 5, i: 0, j: 0 }, array: [5, 2, 4, 1, 3], event: 'compare', indices: [0, 1], explanation: '🔍 Pass 1 — Compare arr[0]=5 and arr[1]=2. Is 5 > 2? Yes → Swap!' },
  { line: 4, variables: { n: 5, i: 0, j: 0 }, array: [2, 5, 4, 1, 3], event: 'swap', indices: [0, 1], swapping: true, explanation: '🔄 Swapped! 5 moved right, 2 moved left. Array is now [2, 5, 4, 1, 3].' },
  { line: 3, variables: { n: 5, i: 0, j: 1 }, array: [2, 5, 4, 1, 3], event: 'compare', indices: [1, 2], explanation: '🔍 Compare arr[1]=5 and arr[2]=4. Is 5 > 4? Yes → Swap!' },
  { line: 4, variables: { n: 5, i: 0, j: 1 }, array: [2, 4, 5, 1, 3], event: 'swap', indices: [1, 2], swapping: true, explanation: '🔄 Swapped! 5 moved right, 4 moved left. Array is now [2, 4, 5, 1, 3].' },
  { line: 3, variables: { n: 5, i: 0, j: 2 }, array: [2, 4, 5, 1, 3], event: 'compare', indices: [2, 3], explanation: '🔍 Compare arr[2]=5 and arr[3]=1. Is 5 > 1? Yes → Swap!' },
  { line: 4, variables: { n: 5, i: 0, j: 2 }, array: [2, 4, 1, 5, 3], event: 'swap', indices: [2, 3], swapping: true, explanation: '🔄 Swapped! 5 moves right. Array is now [2, 4, 1, 5, 3].' },
  { line: 3, variables: { n: 5, i: 0, j: 3 }, array: [2, 4, 1, 5, 3], event: 'compare', indices: [3, 4], explanation: '🔍 Compare arr[3]=5 and arr[4]=3. Is 5 > 3? Yes → Swap!' },
  { line: 4, variables: { n: 5, i: 0, j: 3 }, array: [2, 4, 1, 3, 5], event: 'swap', indices: [3, 4], swapping: true, explanation: '🔄 Swapped! 5 "bubbled up" to its correct position at the end! 🎉' },
  // Pass 2
  { line: 3, variables: { n: 5, i: 1, j: 0 }, array: [2, 4, 1, 3, 5], event: 'compare', indices: [0, 1], explanation: '🔍 Pass 2 — Compare arr[0]=2 and arr[1]=4. Is 2 > 4? No → No swap.' },
  { line: 3, variables: { n: 5, i: 1, j: 1 }, array: [2, 4, 1, 3, 5], event: 'compare', indices: [1, 2], explanation: '🔍 Compare arr[1]=4 and arr[2]=1. Is 4 > 1? Yes → Swap!' },
  { line: 4, variables: { n: 5, i: 1, j: 1 }, array: [2, 1, 4, 3, 5], event: 'swap', indices: [1, 2], swapping: true, explanation: '🔄 Swapped! Array is now [2, 1, 4, 3, 5].' },
  { line: 3, variables: { n: 5, i: 1, j: 2 }, array: [2, 1, 4, 3, 5], event: 'compare', indices: [2, 3], explanation: '🔍 Compare arr[2]=4 and arr[3]=3. Is 4 > 3? Yes → Swap!' },
  { line: 4, variables: { n: 5, i: 1, j: 2 }, array: [2, 1, 3, 4, 5], event: 'swap', indices: [2, 3], swapping: true, explanation: '🔄 Swapped! 4 moves to its sorted position. Array: [2, 1, 3, 4, 5].' },
  // Pass 3
  { line: 3, variables: { n: 5, i: 2, j: 0 }, array: [2, 1, 3, 4, 5], event: 'compare', indices: [0, 1], explanation: '🔍 Pass 3 — Compare arr[0]=2 and arr[1]=1. Is 2 > 1? Yes → Swap!' },
  { line: 4, variables: { n: 5, i: 2, j: 0 }, array: [1, 2, 3, 4, 5], event: 'swap', indices: [0, 1], swapping: true, explanation: '🔄 Swapped! Array is now [1, 2, 3, 4, 5].' },
  { line: 3, variables: { n: 5, i: 2, j: 1 }, array: [1, 2, 3, 4, 5], event: 'compare', indices: [1, 2], explanation: '🔍 Compare arr[1]=2 and arr[2]=3. Is 2 > 3? No → No swap.' },
  { line: 3, variables: { n: 5, i: 2, j: 2 }, array: [1, 2, 3, 4, 5], event: 'compare', indices: [2, 3], explanation: '🔍 Compare arr[2]=3 and arr[3]=4. Is 3 > 4? No → No swap.' },
  // Pass 4
  { line: 3, variables: { n: 5, i: 3, j: 0 }, array: [1, 2, 3, 4, 5], event: 'compare', indices: [0, 1], explanation: '🔍 Pass 4 — Compare arr[0]=1 and arr[1]=2. Is 1 > 2? No → No swap.' },
  { line: 3, variables: { n: 5, i: 3, j: 1 }, array: [1, 2, 3, 4, 5], event: 'compare', indices: [1, 2], explanation: '🔍 Compare arr[1]=2 and arr[2]=3. Is 2 > 3? No → No swap.' },
  {
    line: 8,
    variables: { n: 5, i: 4, j: 0, sorted: true },
    array: [1, 2, 3, 4, 5],
    event: 'complete',
    explanation: '✅ Array fully sorted! [1, 2, 3, 4, 5] — Bubble Sort complete. Each element has "bubbled" to its correct position.',
  },
];

// ─────────────────────────────────────────────
//  Loop Tracing trace for sum 1..5
// ─────────────────────────────────────────────
export const loopTrace: ExecutionStep[] = [
  { line: 1, variables: { sum: 0, i: 1 }, array: [], event: 'highlight', explanation: '🚀 Starting loop trace. We\'ll sum numbers from 1 to 5. sum starts at 0.' },
  { line: 2, variables: { sum: 0, i: 1 }, array: [], event: 'loop_check', explanation: '🔄 Loop check — Is i=1 ≤ 5? Yes → Enter loop body.' },
  { line: 3, variables: { sum: 1, i: 1 }, array: [], event: 'update', explanation: '➕ sum = sum + i → 0 + 1 = 1. Variable sum updated!' },
  { line: 4, variables: { sum: 1, i: 2 }, array: [], event: 'update', explanation: '⬆️ i incremented: i = 1 + 1 = 2.' },
  { line: 2, variables: { sum: 1, i: 2 }, array: [], event: 'loop_check', explanation: '🔄 Loop check — Is i=2 ≤ 5? Yes → Continue.' },
  { line: 3, variables: { sum: 3, i: 2 }, array: [], event: 'update', explanation: '➕ sum = sum + i → 1 + 2 = 3. Variable sum updated!' },
  { line: 4, variables: { sum: 3, i: 3 }, array: [], event: 'update', explanation: '⬆️ i incremented: i = 2 + 1 = 3.' },
  { line: 2, variables: { sum: 3, i: 3 }, array: [], event: 'loop_check', explanation: '🔄 Loop check — Is i=3 ≤ 5? Yes → Continue.' },
  { line: 3, variables: { sum: 6, i: 3 }, array: [], event: 'update', explanation: '➕ sum = sum + i → 3 + 3 = 6. Variable sum updated!' },
  { line: 4, variables: { sum: 6, i: 4 }, array: [], event: 'update', explanation: '⬆️ i incremented: i = 3 + 1 = 4.' },
  { line: 2, variables: { sum: 6, i: 4 }, array: [], event: 'loop_check', explanation: '🔄 Loop check — Is i=4 ≤ 5? Yes → Continue.' },
  { line: 3, variables: { sum: 10, i: 4 }, array: [], event: 'update', explanation: '➕ sum = sum + i → 6 + 4 = 10. Variable sum updated!' },
  { line: 4, variables: { sum: 10, i: 5 }, array: [], event: 'update', explanation: '⬆️ i incremented: i = 4 + 1 = 5.' },
  { line: 2, variables: { sum: 10, i: 5 }, array: [], event: 'loop_check', explanation: '🔄 Loop check — Is i=5 ≤ 5? Yes → One more iteration.' },
  { line: 3, variables: { sum: 15, i: 5 }, array: [], event: 'update', explanation: '➕ sum = sum + i → 10 + 5 = 15. Variable sum updated!' },
  { line: 4, variables: { sum: 15, i: 6 }, array: [], event: 'update', explanation: '⬆️ i incremented: i = 5 + 1 = 6.' },
  { line: 2, variables: { sum: 15, i: 6 }, array: [], event: 'loop_check', explanation: '🔄 Loop check — Is i=6 ≤ 5? No → Exit loop.' },
  { line: 5, variables: { sum: 15, i: 6, result: 15 }, array: [], event: 'complete', explanation: '✅ Loop complete! sum = 15. The formula 1+2+3+4+5 = 15 ✓' },
];
