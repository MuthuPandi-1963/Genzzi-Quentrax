"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Play,
  Sparkles,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  BarChart3,
  Tag,
} from "lucide-react";
import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
//  ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 16, duration: 0.6 },
  },
};

const heroImageVariants = {
  hidden: { opacity: 0, scale: 1.1, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 18 },
  },
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "text-[var(--color-difficulty-easy)] bg-[hsl(142_76%_45%_/_0.15)] border-[hsl(142_76%_45%_/_0.3)]";
    case "medium":
      return "text-[var(--color-difficulty-medium)] bg-[hsl(38_92%_55%_/_0.15)] border-[hsl(38_92%_55%_/_0.3)]";
    case "hard":
      return "text-[var(--color-difficulty-hard)] bg-[hsl(0_84%_60%_/_0.15)] border-[hsl(0_84%_60%_/_0.3)]";
    case "expert":
      return "text-[var(--color-difficulty-expert)] bg-[hsl(280_80%_55%_/_0.15)] border-[hsl(280_80%_55%_/_0.3)]";
    default:
      return "text-[var(--color-foreground-muted)] bg-[var(--color-muted)] border-[var(--color-border)]";
  }
};

const getDifficultyLabel = (difficulty: string) => {
  const map: Record<string, string> = {
    easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert",
  };
  return map[difficulty?.toLowerCase()] || difficulty || "Unknown";
};

// ═══════════════════════════════════════════════════════════════
//  SKELETON COMPONENTS
// ═══════════════════════════════════════════════════════════════
function TopicCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="h-6 w-3/4 rounded-lg skeleton" />
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full skeleton" />
        <div className="h-5 w-20 rounded-full skeleton" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-2/3 rounded skeleton" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-4 w-20 rounded skeleton" />
        <div className="h-4 w-16 rounded skeleton" />
      </div>
    </div>
  );
}

function CategoryDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <div className="absolute inset-0 skeleton" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <div className="h-4 w-32 rounded skeleton mb-4" />
          <div className="h-10 w-2/3 rounded-xl skeleton mb-3" />
          <div className="h-5 w-1/2 rounded skeleton" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="h-8 w-48 rounded-xl skeleton" />
          <div className="h-10 w-64 rounded-xl skeleton" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPTY STATE
// ═══════════════════════════════════════════════════════════════
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 16 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
          <Search className="w-10 h-10 text-[var(--color-foreground-subtle)]" />
        </div>
      </motion.div>
      <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
        No topics found
      </h3>
      <p className="text-[var(--color-foreground-muted)] max-w-md mb-6">
        Try adjusting your search or filters to find what you're looking for.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClear}
        className="gradient-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
      >
        Clear Filters
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TOPIC CARD
// ═══════════════════════════════════════════════════════════════
function TopicCard({ topic }: { topic: any }) {
  const router = useRouter();
  const difficultyColor = getDifficultyColor(topic.difficulty);
  const difficultyLabel = getDifficultyLabel(topic.difficulty);

  return (
    <motion.div variants={itemVariants} initial="rest" whileHover="hover" animate="rest" className="group">
      <motion.div
        variants={cardHover}
        className="glass-card h-full flex flex-col p-6 cursor-pointer relative overflow-hidden"
        onClick={() => router.push(`/topics/${topic.id}`)}
      >
        {/* Decorative gradient orb on hover */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-foreground)] text-lg leading-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
                {topic.name}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 ${difficultyColor}`}>
                <BarChart3 className="w-3 h-3" />
                {difficultyLabel}
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="w-4 h-4 text-[var(--color-primary)]" />
          </motion.div>
        </div>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
            {topic.tags.slice(0, 4).map((tag: string, i: number) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--color-secondary)] text-[var(--color-foreground-muted)] border border-[var(--color-border)]"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </motion.span>
            ))}
            {topic.tags.length > 4 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--color-foreground-subtle)]">
                +{topic.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-auto pt-4 border-t border-[var(--color-border)]/50 relative z-10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[var(--color-foreground-muted)]">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="font-medium">
                  {topic._count?.questions ?? topic.questionCount ?? 0}
                </span>
                <span className="text-xs">questions</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--color-foreground-muted)]">
                <Play className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="font-medium">
                  {topic._count?.quizzes ?? topic.quizCount ?? 0}
                </span>
                <span className="text-xs">quizzes</span>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-primary px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/topics/${topic.id}`);
              }}
            >
              View Quizzes
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const { getById } = useCategories();
  const { data: category, isLoading, isError, error } = getById(categoryId);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  // ── Filter topics ─────────────────────────────────────────────
  const filteredTopics = useMemo(() => {
    if (!category?.topics) return [];
    return category.topics.filter((topic: any) => {
      const matchesSearch =
        !searchQuery ||
        topic.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesDifficulty =
        difficultyFilter === "all" ||
        topic.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
      return matchesSearch && matchesDifficulty;
    });
  }, [category?.topics, searchQuery, difficultyFilter]);

  const difficulties = useMemo(() => {
    if (!category?.topics) return [];
    const diffs = new Set<string>();
    category.topics.forEach((t: any) => {
      if (t.difficulty) diffs.add(t.difficulty.toLowerCase());
    });
    return Array.from(diffs);
  }, [category?.topics]);

  // ── Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return <CategoryDetailSkeleton />;
  }

  // ── Error State ───────────────────────────────────────────────
  if (isError || !category) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 16 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center mx-auto mb-4"
          >
            <AlertCircle className="w-8 h-8 text-[var(--color-error)]" />
          </motion.div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
            Category Not Found
          </h2>
          <p className="text-[var(--color-foreground-muted)] mb-6">
            {error instanceof Error
              ? error.message
              : "The category you're looking for doesn't exist or has been removed."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/categories")}
            className="gradient-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Categories
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // ── Derived Stats ─────────────────────────────────────────────
  const topicCount = category.topics?.length ?? 0;
  const totalQuestions = category.topics?.reduce(
    (acc: number, t: any) => acc + (t._count?.questions ?? t.questionCount ?? 0),
    0
  );
  const totalQuizzes = category.topics?.reduce(
    (acc: number, t: any) => acc + (t._count?.quizzes ?? t.quizCount ?? 0),
    0
  );

  return (
    <div className="min-h-screen pb-20">
      {/* ═══ HERO SECTION ════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="relative h-72 md:h-[28rem] overflow-hidden"
      >
        {/* Background Image with blur-in animation */}
        <motion.div variants={heroImageVariants} initial="hidden" animate="visible" className="absolute inset-0">
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/30 via-[var(--color-accent)]/20 to-[var(--color-background)]" />
          )}
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/70 to-[var(--color-background)]/30" />
        <div className="absolute inset-0 bg-[var(--color-background)]/20" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{ width: 4 + i * 3, height: 4 + i * 3, left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{
                y: [0, -30 - i * 10, 0],
                x: [0, (i % 2 === 0 ? 1 : -1) * 15, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
          {/* Breadcrumb */}
          <motion.nav variants={fadeInUp} className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] mb-4">
            <motion.button whileHover={{ x: -3 }} onClick={() => router.push("/")} className="hover:text-[var(--color-primary)] transition-colors">
              Home
            </motion.button>
            <ChevronRight className="w-4 h-4" />
            <motion.button whileHover={{ x: -3 }} onClick={() => router.push("/categories")} className="hover:text-[var(--color-primary)] transition-colors">
              Categories
            </motion.button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--color-foreground)] font-medium truncate max-w-[200px]">
              {category.name}
            </span>
          </motion.nav>

          {/* Title */}
          <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-[var(--color-foreground)] mb-3 leading-tight">
            <span className="text-gradient">{category.name}</span>
          </motion.h1>

          {/* Description */}
          {category.description && (
            <motion.p variants={fadeInUp} className="text-[var(--color-foreground-muted)] text-base md:text-lg max-w-2xl mb-6 leading-relaxed">
              {category.description}
            </motion.p>
          )}

          {/* Stats Bar */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 glass-card-sm px-4 py-2">
              <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm font-semibold text-[var(--color-foreground)]">{topicCount}</span>
              <span className="text-xs text-[var(--color-foreground-muted)]">Topics</span>
            </div>
            <div className="flex items-center gap-2 glass-card-sm px-4 py-2">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-sm font-semibold text-[var(--color-foreground)]">{totalQuestions}</span>
              <span className="text-xs text-[var(--color-foreground-muted)]">Questions</span>
            </div>
            <div className="flex items-center gap-2 glass-card-sm px-4 py-2">
              <Play className="w-4 h-4 text-[var(--color-success)]" />
              <span className="text-sm font-semibold text-[var(--color-foreground)]">{totalQuizzes}</span>
              <span className="text-xs text-[var(--color-foreground-muted)]">Quizzes</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ TOPICS SECTION ══════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        {/* Section Header + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] mb-1">
              Topics
            </h2>
            <p className="text-[var(--color-foreground-muted)] text-sm">
              Explore {topicCount} topic{topicCount !== 1 ? "s" : ""} in this category
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10 pr-4 w-full sm:w-64"
              />
            </div>

            {/* Difficulty Filter */}
            {difficulties.length > 0 && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="glass-input pl-10 pr-8 appearance-none cursor-pointer w-full sm:w-44"
                >
                  <option value="all">All Difficulties</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{getDifficultyLabel(d)}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Topics Grid */}
        <AnimatePresence mode="wait">
          {filteredTopics.length === 0 ? (
            <EmptyState onClear={() => { setSearchQuery(""); setDifficultyFilter("all"); }} />
          ) : (
            <motion.div
              key={`${searchQuery}-${difficultyFilter}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTopics.map((topic: any) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══ CTA SECTION ═════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4"
      >
        <div className="glass-card-lg p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial-purple opacity-50" />
          <div className="relative z-10">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] mb-3"
            >
              Ready to test your knowledge?
            </motion.h3>
            <p className="text-[var(--color-foreground-muted)] mb-6 max-w-lg mx-auto">
              Browse all available quizzes or jump into a random topic to start learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/quizzes")}
                className="gradient-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Browse All Quizzes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/categories")}
                className="glass-card-sm px-8 py-3 rounded-xl font-semibold text-[var(--color-foreground)] inline-flex items-center justify-center gap-2 hover:bg-[var(--glass-surface-hover)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Categories
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}