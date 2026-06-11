"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Home, Award } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/data-display/StatusBadge";

export default function AssessmentResultPage() {
  // Mock Result Data
  const mockResult = {
    title: "Mid-Term Evaluation",
    score: 85,
    totalPoints: 100,
    percentage: 85,
    passed: true,
    timeTaken: "24m 12s",
    completedAt: "2023-10-25T14:30:00Z",
    violations: 0,
    questions: [
      { id: "q1", text: "What is the capital of France?", points: 10, earned: 10, isCorrect: true, selected: "Paris", correctAnswer: "Paris" },
      { id: "q2", text: "Which element has the chemical symbol 'O'?", points: 5, earned: 5, isCorrect: true, selected: "Oxygen", correctAnswer: "Oxygen" },
      { id: "q3", text: "React is a framework.", points: 5, earned: 0, isCorrect: false, selected: "True", correctAnswer: "False" },
    ]
  };

  return (
    <div className="min-h-screen bg-[hsl(260,20%,98%)] dark:bg-[hsl(260,50%,4%)] pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/my-assessments" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Assessments
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-medium">
              <Home className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>

        {/* Hero Result Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={`rounded-3xl p-8 md:p-12 mb-8 text-center text-white relative overflow-hidden shadow-xl ${
            mockResult.passed 
              ? " bg-linear-to-br from-emerald-500 to-teal-600" 
              : " bg-linear-to-br from-red-500 to-orange-600"
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              {mockResult.passed ? <Award className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-2">
              {mockResult.passed ? "Congratulations!" : "Keep Trying!"}
            </h1>
            <p className="text-lg opacity-90 mb-8 font-medium">
              You scored {mockResult.percentage}% on {mockResult.title}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 bg-black/20 p-6 rounded-2xl w-full max-w-2xl backdrop-blur-sm">
              <div className="flex-1 min-w-[120px]">
                <p className="text-sm opacity-80 mb-1 uppercase tracking-wider font-bold">Total Score</p>
                <p className="text-3xl font-black">{mockResult.score} <span className="text-xl opacity-70">/ {mockResult.totalPoints}</span></p>
              </div>
              <div className="w-px bg-white/20 hidden md:block" />
              <div className="flex-1 min-w-[120px]">
                <p className="text-sm opacity-80 mb-1 uppercase tracking-wider font-bold">Time Taken</p>
                <p className="text-2xl font-bold pt-1">{mockResult.timeTaken}</p>
              </div>
              <div className="w-px bg-white/20 hidden md:block" />
              <div className="flex-1 min-w-[120px]">
                <p className="text-sm opacity-80 mb-1 uppercase tracking-wider font-bold">Violations</p>
                <p className="text-2xl font-bold pt-1">{mockResult.violations}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Breakdown */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Question Breakdown</h2>
        
        <div className="space-y-4">
          {mockResult.questions.map((q, index) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-white/5 border-l-4 rounded-r-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 ${
                q.isCorrect 
                  ? "border-emerald-500 border-t border-b border-r border-t-black/5 border-b-black/5 border-r-black/5 dark:border-t-white/5 dark:border-b-white/5 dark:border-r-white/5" 
                  : "border-red-500 border-t border-b border-r border-t-black/5 border-b-black/5 border-r-black/5 dark:border-t-white/5 dark:border-b-white/5 dark:border-r-white/5"
              }`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-gray-500">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{q.text}</h3>
                  <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                    q.isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {q.earned} / {q.points} PTS
                  </span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-black/5 dark:border-white/5">
                    <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Your Answer</p>
                    <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      {q.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      {q.selected || "No answer provided"}
                    </p>
                  </div>
                  
                  {!q.isCorrect && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-xs text-emerald-700 dark:text-emerald-500 mb-1 font-bold uppercase tracking-wider">Correct Answer</p>
                      <p className="flex items-center gap-2 font-medium text-emerald-900 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {q.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
