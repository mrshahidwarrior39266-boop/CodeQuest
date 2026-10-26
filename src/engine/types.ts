// Engine types for CodeQuest execution replay

export type EventType = 'compare' | 'swap' | 'update' | 'complete' | 'highlight' | 'loop_check';

export type CodeLanguage = 'javascript' | 'python' | 'cpp' | 'java';

export interface ExecutionStep {
  line: number;
  variables: Record<string, number | string | boolean>;
  array: number[];
  event: EventType;
  indices?: number[]; // indices involved in compare / swap
  swapping?: boolean;
  explanation: string;
  consoleLine?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
  xp: number;
  level: string;
  streak: number;
  completedLessons: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Variables' | 'Loops' | 'Algorithms';
  icon: string;
  estimatedTime: string;
  steps: number;
  code: string;
  languageCodes?: Record<CodeLanguage, string>;
  timeComplexity?: { best: string; average: string; worst: string };
  spaceComplexity?: string;
  loopInvariant?: string;
  trace: ExecutionStep[];
}
