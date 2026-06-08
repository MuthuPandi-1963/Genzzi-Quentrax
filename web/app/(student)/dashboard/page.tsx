"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, CheckSquare, Library, Wallet, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import QuizCard from "@/components/data-display/QuizCard";

export default function StudentDashboardPage() {
  // Mock data
  const stats = [
    { label: "Quizzes Taken", value: 42, icon: Library, color: "blue" },
    { label: "Assessments Done", value: 12, icon: CheckSquare, color: "emerald" },
    { label: "Coin Balance", value: 1250, icon: Wallet, color: "amber" },
    { label: "Current Rank", value: "#14", icon: Trophy, color: "purple" },
  ];

  const recentActivity = [
    { id: 1, title: "React Navigation Basics", score: 90, date: "2 hours ago", type: "quiz" },
    { id: 2, title: "Mid-Term Evaluation", score: 85, date: "Yesterday", type: "assessment" },
    { id: 3, title: "Next.js Routing", score: 100, date: "3 days ago", type: "quiz" },
  ];

  const upcomingAssessments = [
    { id: "a1", title: "Final Frontend Exam", deadline: "Tomorrow, 10:00 AM", status: "PENDING" }
  ];

  const recommendedQuizzes = [
    { id: "q1", title: "Advanced React Patterns", description: "Test your knowledge on HOCs and Render Props.", status: "active" as const, timeLimit: 20, totalPoints: 150, _count: { questions: 15 }, topic: { name: "React" } },
    { id: "q2", title: "TypeScript Generics", description: "Master TS generics.", status: "active" as const, timeLimit: 10, totalPoints: 100, _count: { questions: 10 }, topic: { name: "TypeScript" } },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2">Welcome back, Alex! 👋</h1>
            <p className="text-purple-100">You're on a 5-day streak. Keep it up!</p>
          </div>
          <Link href="/quizzes" className="shrink-0 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-md flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            Take Random Quiz
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Assessments */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                Upcoming Assessments
              </h2>
              <Link href="/my-assessments" className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAssessments.map(assessment => (
                <div key={assessment.id} className="bg-white dark:bg-white/5 border border-red-200 dark:border-red-900/30 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{assessment.title}</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Due: {assessment.deadline}</p>
                  </div>
                  <Link href={`/assessments/${assessment.id}/take`} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-medium hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors w-full sm:w-auto text-center">
                    Start Now
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Quizzes */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Library className="w-5 h-5 text-blue-500" />
                Recommended For You
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {recommendedQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} actionText="Take Quiz" />
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {recentActivity.map((activity, i) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-900 bg-slate-100 dark:bg-gray-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {activity.type === 'quiz' ? <Library className="w-4 h-4 text-blue-500" /> : <CheckSquare className="w-4 h-4 text-emerald-500" />}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 dark:border-white/10 shadow bg-white dark:bg-white/5">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900 dark:text-white">{activity.title}</div>
                      <time className="font-caveat font-medium text-purple-500">{activity.score}%</time>
                    </div>
                    <div className="text-slate-500 text-xs">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
