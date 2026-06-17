"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface SubmitConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  answeredCount: number;
  totalCount: number;
  flaggedCount: number;
}

export default function SubmitConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  answeredCount,
  totalCount,
  flaggedCount,
}: SubmitConfirmationProps) {
  const unanswered = totalCount - answeredCount;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[var(--color-background)]/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass-card-lg p-8 max-w-md w-full"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-[var(--color-warning)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-foreground)] text-center mb-2">
              Submit Quiz?
            </h3>
            <p className="text-sm text-[var(--color-foreground-muted)] text-center mb-6">
              You have answered{" "}
              <span className="text-[var(--color-success)] font-bold">{answeredCount}</span> out of{" "}
              <span className="font-bold">{totalCount}</span> questions.
              {unanswered > 0 && (
                <span className="text-[var(--color-error)]"> {unanswered} unanswered.</span>
              )}
              {flaggedCount > 0 && (
                <span className="text-[var(--color-warning)]"> {flaggedCount} flagged for review.</span>
              )}
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex-1 glass-card-sm px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-foreground)]"
              >
                Keep Working
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 gradient-primary px-4 py-3 rounded-xl text-sm font-semibold"
              >
                Submit Now
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}