import type { ExecutionStep } from './types';

/**
 * Dynamically generates a complete step-by-step execution trace
 * for Bubble Sort given any array of numbers.
 */
export function generateBubbleSortTrace(initialArr: number[]): ExecutionStep[] {
  const arr = [...initialArr];
  const n = arr.length;
  const trace: ExecutionStep[] = [];

  trace.push({
    line: 1,
    variables: { n, i: 0, j: 0 },
    array: [...arr],
    event: 'highlight',
    explanation: `🚀 Starting Bubble Sort with ${n} elements: [${arr.join(', ')}].`,
    consoleLine: `bubbleSort([${arr.join(', ')}]) initialized with length ${n}`,
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const valA = arr[j];
      const valB = arr[j + 1];
      const willSwap = valA > valB;

      // 1. Comparison Step
      trace.push({
        line: 3,
        variables: { n, i, j, valA, valB },
        array: [...arr],
        event: 'compare',
        indices: [j, j + 1],
        explanation: `🔍 Pass ${i + 1} · Compare arr[${j}]=${valA} and arr[${j + 1}]=${valB}. ${valA} ${willSwap ? '>' : '≤'} ${valB} → ${willSwap ? 'Swap required!' : 'Already ordered, no swap.'}`,
        consoleLine: `Compare arr[${j}]=${valA} with arr[${j + 1}]=${valB} → ${willSwap ? 'SWAP' : 'KEEP'}`,
      });

      // 2. Swap Step (if needed)
      if (willSwap) {
        arr[j] = valB;
        arr[j + 1] = valA;

        trace.push({
          line: 4,
          variables: { n, i, j, temp: valA },
          array: [...arr],
          event: 'swap',
          indices: [j, j + 1],
          swapping: true,
          explanation: `🔄 Swapped arr[${j}] and arr[${j + 1}]. Array is now [${arr.join(', ')}].`,
          consoleLine: `Swapped (${valA} ↔ ${valB}) at indices [${j}, ${j + 1}]`,
        });
      }
    }
  }

  // 3. Complete Step
  trace.push({
    line: 8,
    variables: { n, i: n - 1, j: 0, sorted: true },
    array: [...arr],
    event: 'complete',
    explanation: `✅ Array successfully sorted: [${arr.join(', ')}]! Bubble Sort complete in ${trace.length} steps.`,
    consoleLine: `Algorithm complete. Final sorted array: [${arr.join(', ')}]`,
  });

  return trace;
}

/**
 * Dynamically generates a complete step-by-step execution trace
 * for Selection Sort.
 */
export function generateSelectionSortTrace(initialArr: number[]): ExecutionStep[] {
  const arr = [...initialArr];
  const n = arr.length;
  const trace: ExecutionStep[] = [];

  trace.push({
    line: 1,
    variables: { n, i: 0, minIdx: 0 },
    array: [...arr],
    event: 'highlight',
    explanation: `🚀 Starting Selection Sort with [${arr.join(', ')}].`,
    consoleLine: `selectionSort([${arr.join(', ')}]) initialized`,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    trace.push({
      line: 3,
      variables: { n, i, minIdx, currentMin: arr[minIdx] },
      array: [...arr],
      event: 'highlight',
      indices: [i],
      explanation: `🎯 Pass ${i + 1}: Assume minimum is arr[${i}]=${arr[i]} at index ${i}.`,
      consoleLine: `Pass ${i + 1}: Starting search from index ${i}`,
    });

    for (let j = i + 1; j < n; j++) {
      const isSmaller = arr[j] < arr[minIdx];

      trace.push({
        line: 4,
        variables: { n, i, j, minIdx, candidate: arr[j], currentMin: arr[minIdx] },
        array: [...arr],
        event: 'compare',
        indices: [j, minIdx],
        explanation: `🔍 Compare arr[${j}]=${arr[j]} with current minimum arr[${minIdx}]=${arr[minIdx]}. ${isSmaller ? 'Found new smaller element!' : 'Not smaller.'}`,
        consoleLine: `Compare arr[${j}]=${arr[j]} < arr[${minIdx}]=${arr[minIdx]}? ${isSmaller}`,
      });

      if (isSmaller) {
        minIdx = j;
        trace.push({
          line: 5,
          variables: { n, i, j, minIdx, currentMin: arr[minIdx] },
          array: [...arr],
          event: 'update',
          indices: [minIdx],
          explanation: `📌 Updated new minimum index to ${minIdx} (value ${arr[minIdx]}).`,
          consoleLine: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      trace.push({
        line: 8,
        variables: { n, i, minIdx, temp },
        array: [...arr],
        event: 'swap',
        indices: [i, minIdx],
        swapping: true,
        explanation: `🔄 Swapped minimum element ${arr[i]} into position ${i}. Array: [${arr.join(', ')}].`,
        consoleLine: `Swapped index ${i} with minimum at index ${minIdx}`,
      });
    }
  }

  trace.push({
    line: 11,
    variables: { n, sorted: true },
    array: [...arr],
    event: 'complete',
    explanation: `✅ Selection Sort complete: [${arr.join(', ')}]!`,
    consoleLine: `Selection Sort complete. Result: [${arr.join(', ')}]`,
  });

  return trace;
}

/**
 * Dynamically generates a complete step-by-step execution trace
 * for Insertion Sort.
 */
export function generateInsertionSortTrace(initialArr: number[]): ExecutionStep[] {
  const arr = [...initialArr];
  const n = arr.length;
  const trace: ExecutionStep[] = [];

  trace.push({
    line: 1,
    variables: { n, i: 1 },
    array: [...arr],
    event: 'highlight',
    explanation: `🚀 Starting Insertion Sort with [${arr.join(', ')}]. We will insert each element into its sorted sub-array on the left.`,
    consoleLine: `insertionSort([${arr.join(', ')}]) initialized`,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    trace.push({
      line: 3,
      variables: { n, i, j, key },
      array: [...arr],
      event: 'highlight',
      indices: [i],
      explanation: `🃏 Pick key = arr[${i}] (${key}). Comparing backwards to find where ${key} fits in the sorted left section.`,
      consoleLine: `i = ${i}: Key picked = ${key}`,
    });

    while (j >= 0 && arr[j] > key) {
      trace.push({
        line: 5,
        variables: { n, i, j, key, comparedVal: arr[j] },
        array: [...arr],
        event: 'compare',
        indices: [j, j + 1],
        explanation: `🔍 Compare arr[${j}]=${arr[j]} > key (${key})? Yes → Shift ${arr[j]} right to index ${j + 1}.`,
        consoleLine: `arr[${j}]=${arr[j]} > ${key} → shift right`,
      });

      arr[j + 1] = arr[j];

      trace.push({
        line: 6,
        variables: { n, i, j, key },
        array: [...arr],
        event: 'swap',
        indices: [j, j + 1],
        swapping: true,
        explanation: `➡️ Shifted ${arr[j]} to index ${j + 1}.`,
        consoleLine: `Shifted value ${arr[j]} to index ${j + 1}`,
      });

      j--;
    }

    if (j >= 0) {
      trace.push({
        line: 5,
        variables: { n, i, j, key, comparedVal: arr[j] },
        array: [...arr],
        event: 'compare',
        indices: [j, j + 1],
        explanation: `🔍 Compare arr[${j}]=${arr[j]} > key (${key})? No → Found insertion slot!`,
        consoleLine: `arr[${j}]=${arr[j]} <= ${key} → position found`,
      });
    }

    arr[j + 1] = key;

    trace.push({
      line: 8,
      variables: { n, i, insertedAt: j + 1, key },
      array: [...arr],
      event: 'update',
      indices: [j + 1],
      explanation: `📥 Inserted key = ${key} into sorted position at index ${j + 1}. Array: [${arr.join(', ')}].`,
      consoleLine: `Inserted key ${key} at index ${j + 1}`,
    });
  }

  trace.push({
    line: 11,
    variables: { n, sorted: true },
    array: [...arr],
    event: 'complete',
    explanation: `✅ Insertion Sort complete: [${arr.join(', ')}]!`,
    consoleLine: `Insertion Sort complete. Final: [${arr.join(', ')}]`,
  });

  return trace;
}

/**
 * Dynamically generates a complete step-by-step execution trace
 * for QuickSort with Lomuto partitioning.
 */
export function generateQuickSortTrace(initialArr: number[]): ExecutionStep[] {
  const arr = [...initialArr];
  const n = arr.length;
  const trace: ExecutionStep[] = [];

  trace.push({
    line: 1,
    variables: { n, low: 0, high: n - 1 },
    array: [...arr],
    event: 'highlight',
    explanation: `⚡ Starting QuickSort with [${arr.join(', ')}]. Uses Divide-and-Conquer with in-place partitioning.`,
    consoleLine: `quickSort([${arr.join(', ')}]) initialized`,
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    trace.push({
      line: 9,
      variables: { low, high, pivot, pivotIdx: high, i },
      array: [...arr],
      event: 'highlight',
      indices: [high],
      explanation: `🎯 Partition range [${low}..${high}]: Chosen pivot arr[${high}] = ${pivot}.`,
      consoleLine: `Partition [${low}..${high}] with pivot = ${pivot}`,
    });

    for (let j = low; j < high; j++) {
      const isSmaller = arr[j] < pivot;

      trace.push({
        line: 11,
        variables: { low, high, pivot, j, currentVal: arr[j], i },
        array: [...arr],
        event: 'compare',
        indices: [j, high],
        explanation: `🔍 Compare arr[${j}]=${arr[j]} with pivot (${pivot}). ${arr[j]} ${isSmaller ? '<' : '≥'} ${pivot} → ${isSmaller ? 'Belongs in left partition!' : 'Remains in right partition.'}`,
        consoleLine: `arr[${j}]=${arr[j]} < pivot(${pivot})? ${isSmaller}`,
      });

      if (isSmaller) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          trace.push({
            line: 13,
            variables: { low, high, pivot, i, j },
            array: [...arr],
            event: 'swap',
            indices: [i, j],
            swapping: true,
            explanation: `🔄 Swapped arr[${i}] and arr[${j}] to group smaller element on the left.`,
            consoleLine: `Swapped (${arr[i]} ↔ ${arr[j]})`,
          });
        }
      }
    }

    const pivotFinal = i + 1;
    if (pivotFinal !== high) {
      const temp = arr[pivotFinal];
      arr[pivotFinal] = arr[high];
      arr[high] = temp;

      trace.push({
        line: 16,
        variables: { low, high, pivotFinal, pivot },
        array: [...arr],
        event: 'swap',
        indices: [pivotFinal, high],
        swapping: true,
        explanation: `🎯 Swapped pivot ${pivot} into its final sorted index ${pivotFinal}! Array: [${arr.join(', ')}].`,
        consoleLine: `Pivot ${pivot} placed at final index ${pivotFinal}`,
      });
    } else {
      trace.push({
        line: 16,
        variables: { low, high, pivotFinal, pivot },
        array: [...arr],
        event: 'update',
        indices: [pivotFinal],
        explanation: `🎯 Pivot ${pivot} is already in its sorted position index ${pivotFinal}.`,
        consoleLine: `Pivot ${pivot} already at sorted index ${pivotFinal}`,
      });
    }

    return pivotFinal;
  }

  function quick(low: number, high: number) {
    if (low < high) {
      const pIdx = partition(low, high);
      quick(low, pIdx - 1);
      quick(pIdx + 1, high);
    }
  }

  quick(0, n - 1);

  trace.push({
    line: 6,
    variables: { n, sorted: true },
    array: [...arr],
    event: 'complete',
    explanation: `✅ QuickSort complete! Array is fully partitioned and sorted: [${arr.join(', ')}].`,
    consoleLine: `QuickSort complete. Final: [${arr.join(', ')}]`,
  });

  return trace;
}
