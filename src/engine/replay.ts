import { useEffect, useRef } from 'react';
import { useLearningStore } from '../store/useLearningStore';

/**
 * Autoplay controller: advances currentStep at the configured speed
 * while isPlaying is true. Uses a ref to avoid stale closures.
 */
export function usePlayback() {
  const { isPlaying, speed, currentStepIndex, trace, nextStep, setPlaying, completeLesson } =
    useLearningStore();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      if (currentStepIndex >= trace.length - 1) {
        setPlaying(false);
        completeLesson();
      } else {
        nextStep();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, speed, currentStepIndex, trace.length, nextStep, setPlaying, completeLesson]);
}
