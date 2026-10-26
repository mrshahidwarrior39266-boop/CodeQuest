import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '../../store/useLearningStore';
import { HelpCircle, ArrowLeftRight, Check, X, Award } from 'lucide-react';

export function PredictQuiz() {
  const { quiz, answerQuiz, dismissQuiz } = useLearningStore();

  if (!quiz.pending) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        className="mx-4 my-2 p-4 rounded-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2a1e13 0%, #1a130c 100%)',
          border: '2px solid #6F4E37',
          boxShadow: '0 8px 32px rgba(110, 78, 55, 0.4), 0 0 20px rgba(230, 224, 240, 0.15)',
        }}
      >
        {/* Top bar with Quiz header and Score */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)' }}
            >
              <HelpCircle size={14} color="#E6E0F0" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#E6E0F0' }}>
              Predict Challenge Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold"
              style={{ background: 'rgba(230, 224, 240, 0.15)', color: '#E6E0F0', border: '1px solid rgba(230, 224, 240, 0.25)' }}
            >
              <Award size={12} color="#E6E0F0" />
              <span>{quiz.score} XP</span>
            </div>

            <button
              onClick={dismissQuiz}
              className="text-xs px-2 py-0.5 rounded hover:text-white"
              style={{ color: '#686765' }}
            >
              Skip
            </button>
          </div>
        </div>

        {/* Question */}
        <p className="text-sm font-semibold mb-4 leading-relaxed" style={{ color: '#E5E4E2' }}>
          {quiz.question}
        </p>

        {/* Answers or Result */}
        {quiz.userAnswer === null ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => answerQuiz(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                border: '1px solid rgba(229, 228, 226, 0.25)',
                boxShadow: '0 0 16px rgba(110, 78, 55, 0.35)',
              }}
            >
              <ArrowLeftRight size={13} color="#E6E0F0" />
              <span>Yes, they will swap!</span>
            </button>

            <button
              onClick={() => answerQuiz(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105"
              style={{
                background: 'rgba(229, 228, 226, 0.06)',
                color: '#E5E4E2',
                border: '1px solid rgba(110, 78, 55, 0.35)',
              }}
            >
              <span>No, keep current order</span>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold"
            style={{
              background: quiz.isCorrect ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${quiz.isCorrect ? '#4ade80' : '#ef4444'}`,
              color: quiz.isCorrect ? '#86efac' : '#fca5a5',
            }}
          >
            {quiz.isCorrect ? <Check size={16} /> : <X size={16} />}
            <span>
              {quiz.isCorrect
                ? `🎉 Correct prediction! +25 XP awarded. Advancing...`
                : `Incorrect: ${quiz.values[0]} is ${quiz.willSwap ? 'greater than' : 'not greater than'} ${quiz.values[1]}.`}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
