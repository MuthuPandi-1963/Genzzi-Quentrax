"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import StatusBadge from "@/components/data-display/StatusBadge";
import Link from "next/link";

// Mock Data
const mockAssignments = [
  { id: "a1", assessmentId: "1", title: "Mid-Term Evaluation: React", topic: "React", status: "PENDING", deadline: "2023-11-01T10:00:00Z", assignedAt: "2023-10-25T08:00:00Z" },
  { id: "a2", assessmentId: "2", title: "Proctored Exam: Data Structures", topic: "Computer Science", status: "PENDING", deadline: "2023-11-15T14:00:00Z", assignedAt: "2023-10-25T08:00:00Z" },
];

const mockAttempts = [
  { id: "at1", assessmentId: "3", title: "Monthly Quiz: Algebra", status: "COMPLETED", score: 85, percentage: 85, passed: true, completedAt: "2023-09-30T15:30:00Z" },
  { id: "at2", assessmentId: "4", title: "Pop Quiz: Geography", status: "COMPLETED", score: 40, percentage: 40, passed: false, completedAt: "2023-09-15T11:20:00Z" },
];

export default function MyAssessmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2">My Assessments</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your assigned exams and review past performance.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "upcoming" 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "completed" 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {activeTab === "upcoming" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {mockAssignments.map((assignment) => {
            const isUrgent = new Date(assignment.deadline).getTime() - new Date().getTime() < 86400000 * 3; // Less than 3 days
            
            return (
              <div key={assignment.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                {isUrgent && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />}
                
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {assignment.topic}
                      </span>
                      {isUrgent && (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                          <AlertCircle className="w-3.5 h-3.5" /> Due Soon
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{assignment.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-gray-200">
                        <Clock className="w-4 h-4 text-amber-500" /> Deadline: {new Date(assignment.deadline).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center shrink-0">
                    <Link 
                      href={`/assessments/${assignment.assessmentId}/take`} 
                      className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors shadow-sm text-center"
                    >
                      Start Assessment
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {activeTab === "completed" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {mockAttempts.map((attempt) => (
            <div key={attempt.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${attempt.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{attempt.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {new Date(attempt.completedAt).toLocaleDateString()}
                  </div>
                  <StatusBadge status={attempt.passed ? "PASSED" : "FAILED"} size="sm" />
                </div>
              </div>
              
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{attempt.percentage}%</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                
                <Link 
                  href={`/assessments/${attempt.assessmentId}/result`} 
                  className="px-6 py-2.5 rounded-xl font-bold border border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
