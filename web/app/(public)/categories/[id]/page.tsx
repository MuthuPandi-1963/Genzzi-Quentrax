"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import TopicCard from "@/components/data-display/TopicCard";
import { UseCategoryById } from "@/hooks/useCategories";
import { Topic } from "@/@types";

export default function CategoryDetailPage() {
  const params = useParams();

  const categoryId = params.id as string;

  const {
    data: category,
    isLoading,
    isError,
  } = UseCategoryById(categoryId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Loading category...
        </p>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">
          Category not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
        </div>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            border border-border rounded-3xl
            p-8 md:p-12 mb-12 relative overflow-hidden shadow-sm
            bg-background
          "
        >
          <div
            className="
              absolute top-0 right-0 w-64 h-64
              bg-linear-to-bl from-purple-500/20 to-transparent
              rounded-full blur-[80px] pointer-events-none
            "
          />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div
              className="
                w-16 h-16 rounded-2xl
                text-category-arts bg-category-arts/10
                flex items-center justify-center
              "
            >
              <BookOpen className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black">
                {category.name}
              </h1>

              <p className="text-category-arts font-medium">
                {category.topics?.length ?? 0} Topics Available
              </p>
            </div>
          </div>

          {category.description && (
            <p className="text-lg text-muted-foreground max-w-3xl relative z-10">
              {category.description}
            </p>
          )}
        </motion.div>

        {/* Topics */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Topics in {category.name}
          </h2>
        </div>

        {category.topics && category.topics.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="
              grid  md:grid-cols-1 xl:grid-cols-2 gap-6
            "
          >
            {category.topics.map((topic:Topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
              />
            ))}
          </motion.div>
        ) : (
          <div
            className="
              rounded-2xl border border-dashed border-border
              p-12 text-center
            "
          >
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />

            <h3 className="text-lg font-semibold mb-2">
              No topics found
            </h3>

            <p className="text-muted-foreground">
              This category doesn&apos;t contain any topics yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}