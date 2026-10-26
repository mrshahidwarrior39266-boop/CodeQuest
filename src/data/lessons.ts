import type { Lesson } from '../engine/types';
import {
  generateBubbleSortTrace,
  generateSelectionSortTrace,
  generateInsertionSortTrace,
  generateQuickSortTrace,
} from '../engine/dynamicTrace';
import { loopTrace } from './executionTraces';

const sampleArray = [5, 2, 4, 1, 3];

export const lessons: Lesson[] = [
  // 1. Bubble Sort
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Repeatedly compares and swaps adjacent elements until the largest values bubble to the top.',
    difficulty: 'Beginner',
    category: 'Algorithms',
    icon: '🫧',
    estimatedTime: '6 min',
    steps: generateBubbleSortTrace(sampleArray).length,
    timeComplexity: { best: 'Ω(n)', average: 'Θ(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1) Auxiliary',
    loopInvariant: 'After iteration i, the largest i elements are permanently locked in sorted order at array tail.',
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap adjacent elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

bubbleSort([5, 2, 4, 1, 3]);`,
    languageCodes: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
bubbleSort([5, 2, 4, 1, 3]);`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

bubble_sort([5, 2, 4, 1, 3])`,
      cpp: `#include <vector>
#include <utility>

std::vector<int> bubbleSort(std::vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
    return arr;
}`,
      java: `public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
    },
    trace: generateBubbleSortTrace(sampleArray),
  },

  // 2. Selection Sort
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'Finds the minimum element from the unsorted section and swaps it into its final sorted position.',
    difficulty: 'Beginner',
    category: 'Algorithms',
    icon: '🎯',
    estimatedTime: '7 min',
    steps: generateSelectionSortTrace(sampleArray).length,
    timeComplexity: { best: 'Ω(n²)', average: 'Θ(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1) In-Place',
    loopInvariant: 'At step i, subarray arr[0..i-1] consists of the i smallest elements strictly in sorted order.',
    code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j; // Found new minimum
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}

selectionSort([5, 2, 4, 1, 3]);`,
    languageCodes: {
      javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}
selectionSort([5, 2, 4, 1, 3]);`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

selection_sort([5, 2, 4, 1, 3])`,
      cpp: `#include <vector>
#include <utility>

std::vector<int> selectionSort(std::vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) std::swap(arr[i], arr[minIdx]);
    }
    return arr;
}`,
      java: `public class SelectionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }
}`,
    },
    trace: generateSelectionSortTrace(sampleArray),
  },

  // 3. Insertion Sort
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'Builds the sorted array one item at a time by picking a key and shifting larger elements to the right.',
    difficulty: 'Intermediate',
    category: 'Algorithms',
    icon: '🃏',
    estimatedTime: '8 min',
    steps: generateInsertionSortTrace(sampleArray).length,
    timeComplexity: { best: 'Ω(n)', average: 'Θ(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1) In-Place',
    loopInvariant: 'Subarray arr[0..i] is continually sorted by shifting larger elements one position ahead.',
    code: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    // Shift elements of arr[0..i-1] that are > key
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

insertionSort([5, 2, 4, 1, 3]);`,
    languageCodes: {
      javascript: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}
insertionSort([5, 2, 4, 1, 3]);`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

insertion_sort([5, 2, 4, 1, 3])`,
      cpp: `#include <vector>

std::vector<int> insertionSort(std::vector<int> arr) {
    int n = arr.size();
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            --j;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
      java: `public class InsertionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}`,
    },
    trace: generateInsertionSortTrace(sampleArray),
  },

  // 4. Quick Sort
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'Divide-and-conquer algorithm that partitions the array around a pivot element into smaller sub-arrays.',
    difficulty: 'Advanced',
    category: 'Algorithms',
    icon: '⚡',
    estimatedTime: '10 min',
    steps: generateQuickSortTrace(sampleArray).length,
    timeComplexity: { best: 'Ω(n log n)', average: 'Θ(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n) Call Stack',
    loopInvariant: 'Partition guarantees arr[low..pivot-1] <= pivot and arr[pivot+1..high] >= pivot.',
    code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

quickSort([5, 2, 4, 1, 3]);`,
    languageCodes: {
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
quickSort([5, 2, 4, 1, 3]);`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      cpp: `#include <vector>
#include <utility>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) {
            ++i;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}`,
      java: `public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int p = partition(arr, low, high);
            sort(arr, low, p - 1);
            sort(arr, p + 1, high);
        }
    }
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}`,
    },
    trace: generateQuickSortTrace(sampleArray),
  },

  // 5. Loop Tracing
  {
    id: 'loop-sum',
    title: 'Loop Tracing',
    description: 'Trace a for-loop that accumulates a sum. Watch how the loop guard and counter control flow.',
    difficulty: 'Beginner',
    category: 'Loops',
    icon: '🔄',
    estimatedTime: '5 min',
    steps: loopTrace.length,
    timeComplexity: { best: 'Ω(n)', average: 'Θ(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1) Scalar',
    loopInvariant: 'Sum equals the arithmetic series sum(1..i-1) before each iteration.',
    code: `let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum = sum + i;
  // i increments each iteration
}
console.log(sum); // 15`,
    languageCodes: {
      javascript: `let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum = sum + i;
}
console.log(sum);`,
      python: `total_sum = 0
for i in range(1, 6):
    total_sum += i
print(total_sum)`,
      cpp: `#include <iostream>

int main() {
    int sum = 0;
    for (int i = 1; i <= 5; ++i) {
        sum += i;
    }
    std::cout << sum << std::endl;
    return 0;
}`,
      java: `public class LoopSum {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println(sum);
    }
}`,
    },
    trace: loopTrace,
  },

  // 6. Variable Mutations
  {
    id: 'variables-101',
    title: 'Variable Mutations',
    description: 'Explore how variables swap and assign in memory line by line.',
    difficulty: 'Beginner',
    category: 'Variables',
    icon: '📦',
    estimatedTime: '4 min',
    steps: 5,
    timeComplexity: { best: 'Ω(1)', average: 'Θ(1)', worst: 'O(1)' },
    spaceComplexity: 'O(1) Registers',
    loopInvariant: 'Temp holds original x value to preserve data during destructive overwrite.',
    code: `let x = 10;
let y = 20;
let temp = x;
x = y;
y = temp;
console.log(x, y); // 20, 10`,
    languageCodes: {
      javascript: `let x = 10;
let y = 20;
let temp = x;
x = y;
y = temp;
console.log(x, y);`,
      python: `x = 10
y = 20
temp = x
x = y
y = temp
print(x, y)`,
      cpp: `#include <iostream>

int main() {
    int x = 10;
    int y = 20;
    int temp = x;
    x = y;
    y = temp;
    std::cout << x << " " << y << std::endl;
    return 0;
}`,
      java: `public class Swap {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        int temp = x;
        x = y;
        y = temp;
        System.out.println(x + " " + y);
    }
}`,
    },
    trace: [
      { line: 1, variables: { x: 10 }, array: [], event: 'update', explanation: 'Declared x = 10' },
      { line: 2, variables: { x: 10, y: 20 }, array: [], event: 'update', explanation: 'Declared y = 20' },
      { line: 3, variables: { x: 10, y: 20, temp: 10 }, array: [], event: 'update', explanation: 'Saved x into temp = 10' },
      { line: 4, variables: { x: 20, y: 20, temp: 10 }, array: [], event: 'update', explanation: 'Overwrote x with y (x = 20)' },
      { line: 5, variables: { x: 20, y: 10, temp: 10 }, array: [], event: 'complete', explanation: 'Assigned temp to y (y = 10). Swap complete!' },
    ],
  },
];
