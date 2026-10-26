import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExecutionStep, Lesson, UserProfile } from '../engine/types';
import { soundEngine } from '../engine/soundEngine';
import {
  generateBubbleSortTrace,
  generateSelectionSortTrace,
  generateInsertionSortTrace,
  generateQuickSortTrace,
} from '../engine/dynamicTrace';

interface QuizState {
  pending: boolean;
  question: string;
  indices: number[];
  values: [number, number];
  willSwap: boolean;
  userAnswer: boolean | null;
  isCorrect: boolean | null;
  score: number;
}

export function calculateLevel(xp: number): string {
  if (xp >= 1000) return 'Grandmaster Optimizer';
  if (xp >= 600) return 'Complexity Conqueror';
  if (xp >= 300) return 'Sorting Specialist';
  if (xp >= 100) return 'Algorithm Apprentice';
  return 'Novice Tracer';
}

interface LearningState {
  // Lesson management
  currentLesson: Lesson | null;
  completedLessons: string[];

  // User Profile & Gamification
  user: UserProfile | null;
  loginUser: (profile: Partial<UserProfile>) => void;
  logoutUser: () => void;
  addXP: (amount: number) => void;

  // Execution state
  trace: ExecutionStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;

  // UI state
  currentScreen: 'landing' | 'dashboard' | 'playground' | 'lab' | 'results' | 'race';

  // Computed current step
  currentStep: ExecutionStep | null;

  // Audio
  isSoundEnabled: boolean;
  toggleSound: () => void;

  // Breakpoints
  breakpoints: number[];
  toggleBreakpoint: (line: number) => void;
  clearBreakpoints: () => void;

  // Predict Quiz Mode
  predictMode: boolean;
  setPredictMode: (enabled: boolean) => void;
  quiz: QuizState;
  answerQuiz: (answerWillSwap: boolean) => void;
  dismissQuiz: () => void;

  // Custom Array Generation
  applyCustomArray: (arr: number[]) => void;

  // Actions
  setLesson: (lesson: Lesson) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  jumpToStep: (index: number) => void;
  completeLesson: () => void;
  goToScreen: (screen: LearningState['currentScreen']) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      currentLesson: null,
      completedLessons: [],

      // User & Leveling
      user: null,
      loginUser: (profile) => {
        const existing = get().user;
        const xp = profile.xp ?? existing?.xp ?? 150;
        const updated: UserProfile = {
          name: profile.name || existing?.name || 'Code Explorer',
          email: profile.email || existing?.email || 'explorer@codequest.dev',
          picture: profile.picture || existing?.picture,
          xp,
          level: calculateLevel(xp),
          streak: profile.streak ?? existing?.streak ?? 1,
          completedLessons: get().completedLessons,
        };
        set({ user: updated });
      },
      logoutUser: () => set({ user: null }),
      addXP: (amount: number) => {
        const { user } = get();
        if (!user) return;
        const newXP = user.xp + amount;
        set({
          user: {
            ...user,
            xp: newXP,
            level: calculateLevel(newXP),
          },
        });
      },

      trace: [],
      currentStepIndex: 0,
      isPlaying: false,
      speed: 800,
      currentScreen: 'landing',
      currentStep: null,

      // Sound
      isSoundEnabled: true,
      toggleSound: () => {
        const next = soundEngine.toggle();
        set({ isSoundEnabled: next });
      },

      // Breakpoints
      breakpoints: [],
      toggleBreakpoint: (line: number) => {
        const { breakpoints } = get();
        if (breakpoints.includes(line)) {
          set({ breakpoints: breakpoints.filter((l) => l !== line) });
        } else {
          set({ breakpoints: [...breakpoints, line] });
        }
      },
      clearBreakpoints: () => set({ breakpoints: [] }),

      // Predict Quiz Mode
      predictMode: false,
      setPredictMode: (enabled: boolean) => set({ predictMode: enabled }),
      quiz: {
        pending: false,
        question: '',
        indices: [],
        values: [0, 0],
        willSwap: false,
        userAnswer: null,
        isCorrect: null,
        score: 0,
      },

      answerQuiz: (answerWillSwap: boolean) => {
        const { quiz, nextStep, addXP } = get();
        const correct = answerWillSwap === quiz.willSwap;
        if (correct) {
          soundEngine.playCorrect();
          addXP(25);
        } else {
          soundEngine.playWrong();
        }

        set({
          quiz: {
            ...quiz,
            userAnswer: answerWillSwap,
            isCorrect: correct,
            score: correct ? quiz.score + 25 : quiz.score,
          },
        });

        setTimeout(() => {
          set((state) => ({
            quiz: { ...state.quiz, pending: false },
          }));
          nextStep();
        }, 1200);
      },

      dismissQuiz: () => {
        set((state) => ({ quiz: { ...state.quiz, pending: false } }));
      },

      // Custom Array Generator
      applyCustomArray: (arr: number[]) => {
        const { currentLesson } = get();
        let newTrace: ExecutionStep[] = [];

        if (currentLesson?.id === 'selection-sort') {
          newTrace = generateSelectionSortTrace(arr);
        } else if (currentLesson?.id === 'insertion-sort') {
          newTrace = generateInsertionSortTrace(arr);
        } else if (currentLesson?.id === 'quick-sort') {
          newTrace = generateQuickSortTrace(arr);
        } else {
          newTrace = generateBubbleSortTrace(arr);
        }

        const updatedLesson = currentLesson
          ? {
              ...currentLesson,
              trace: newTrace,
              steps: newTrace.length,
            }
          : null;

        set({
          currentLesson: updatedLesson,
          trace: newTrace,
          currentStepIndex: 0,
          currentStep: newTrace[0] ?? null,
          isPlaying: false,
          quiz: {
            pending: false,
            question: '',
            indices: [],
            values: [0, 0],
            willSwap: false,
            userAnswer: null,
            isCorrect: null,
            score: 0,
          },
        });
      },

      setLesson: (lesson) =>
        set({
          currentLesson: lesson,
          trace: lesson.trace,
          currentStepIndex: 0,
          currentStep: lesson.trace[0] ?? null,
          isPlaying: false,
          currentScreen: 'lab',
        }),

      nextStep: () => {
        const { currentStepIndex, trace, isSoundEnabled, breakpoints, predictMode } = get();
        if (currentStepIndex < trace.length - 1) {
          const nextIdx = currentStepIndex + 1;
          const nextStepObj = trace[nextIdx];

          // Audio feedback
          if (isSoundEnabled && nextStepObj.array && nextStepObj.array.length > 0) {
            const maxVal = Math.max(...nextStepObj.array);
            if (nextStepObj.event === 'compare' && nextStepObj.indices && nextStepObj.indices.length >= 2) {
              soundEngine.playCompare(
                nextStepObj.array[nextStepObj.indices[0]],
                nextStepObj.array[nextStepObj.indices[1]],
                maxVal
              );
            } else if (nextStepObj.event === 'swap' && nextStepObj.indices && nextStepObj.indices.length >= 2) {
              soundEngine.playSwap(
                nextStepObj.array[nextStepObj.indices[0]],
                nextStepObj.array[nextStepObj.indices[1]],
                maxVal
              );
            } else if (nextStepObj.event === 'complete') {
              soundEngine.playVictory();
            }
          }

          // Predict Mode Check
          let triggerQuiz = false;
          if (predictMode && nextStepObj.event === 'compare' && nextStepObj.indices && nextStepObj.indices.length >= 2) {
            const idxA = nextStepObj.indices[0];
            const idxB = nextStepObj.indices[1];
            const valA = nextStepObj.array[idxA];
            const valB = nextStepObj.array[idxB];
            const willSwap = nextIdx + 1 < trace.length && trace[nextIdx + 1].event === 'swap';

            set({
              currentStepIndex: nextIdx,
              currentStep: nextStepObj,
              isPlaying: false,
              quiz: {
                pending: true,
                question: `Compare arr[${idxA}] (${valA}) and arr[${idxB}] (${valB}). Will these elements swap?`,
                indices: [idxA, idxB],
                values: [valA, valB],
                willSwap,
                userAnswer: null,
                isCorrect: null,
                score: get().quiz.score,
              },
            });
            triggerQuiz = true;
          }

          const hitBreakpoint = breakpoints.includes(nextStepObj.line);

          if (!triggerQuiz) {
            set({
              currentStepIndex: nextIdx,
              currentStep: nextStepObj,
              isPlaying: hitBreakpoint ? false : get().isPlaying,
            });
          }
        } else {
          set({ isPlaying: false });
        }
      },

      prevStep: () => {
        const { currentStepIndex, trace } = get();
        if (currentStepIndex > 0) {
          const prev = currentStepIndex - 1;
          set({ currentStepIndex: prev, currentStep: trace[prev] });
        }
      },

      reset: () => {
        const { trace } = get();
        set({
          currentStepIndex: 0,
          currentStep: trace[0] ?? null,
          isPlaying: false,
          quiz: { ...get().quiz, pending: false },
        });
      },

      setPlaying: (playing) => set({ isPlaying: playing }),

      setSpeed: (speed) => set({ speed }),

      jumpToStep: (index) => {
        const { trace } = get();
        const clamped = Math.max(0, Math.min(index, trace.length - 1));
        set({ currentStepIndex: clamped, currentStep: trace[clamped], isPlaying: false });
      },

      completeLesson: () => {
        const { currentLesson, completedLessons, addXP } = get();
        if (currentLesson && !completedLessons.includes(currentLesson.id)) {
          addXP(50);
          set({
            completedLessons: [...completedLessons, currentLesson.id],
            currentScreen: 'results',
            isPlaying: false,
          });
        } else {
          set({ currentScreen: 'results', isPlaying: false });
        }
      },

      goToScreen: (screen) => set({ currentScreen: screen }),
    }),
    {
      name: 'codequest-v1-storage',
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        user: state.user,
        isSoundEnabled: state.isSoundEnabled,
        predictMode: state.predictMode,
      }),
    }
  )
);
