"use client";



import { useStudentStats } from "@/hooks/useStudent";

import { StudentLayout } from "@/components/student/StudentLayout";

import { AssignmentsList } from "@/components/student/AssignmentsList";

import { motion } from "framer-motion";

import Link from "next/link";





export default function StudentAssessmentsPage() {

  const { assignments, isLoading } = useStudentStats();



  if (isLoading) {

    return (

      <StudentLayout>

        <div className="flex h-[60vh] items-center justify-center">

          <div className="flex flex-col items-center gap-4">

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />

            <p className="text-sm text-slate-400">Loading assessments...</p>

          </div>

        </div>

      </StudentLayout>

    );

  }



  return (

    <StudentLayout>

      <div className="space-y-6">

        <div className="mb-8">

          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">

            My Assessments

          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">

            View all your assigned assessments and track your completion status.

          </p>

        </div>



        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.1 }}

        >

          {assignments.length > 0 ? (

            <div className="grid grid-cols-1" >
              <AssignmentsList assignments={assignments} />
            </div>

          ) : (

            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-3xl dark:border-white/10 dark:bg-white/5 border-black/5 bg-black/5">

              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">

                You have no assessments assigned at this time.

              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">

                Check back later when your instructor assigns new assessments.

              </p>

            </div>

          )}

        </motion.div>

      </div>

    </StudentLayout>

  );

}