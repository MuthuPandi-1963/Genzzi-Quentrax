"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Moon,
  Sun,
  Grid3X3,
  List,
  Sparkles,
  Loader2,
  AlertCircle,
  FileQuestion,
  BrainCircuit,
  Lightbulb,
  Atom,
  Microscope,
  Calculator,
  Music,
  Clapperboard,
  Map,
  Trophy,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTopics } from "../../hooks/useTopics";
import { useCategories } from "../../hooks/useCategories";

/* ═══════════════════════════════════════════════════════════════
   QUENTRAX — CATEGORY TOPICS PAGE
   Shows all topics for a specific category. Deep Purple + Neon + Glassmorphism.
   ═══════════════════════════════════════════════════════════════ */

interface Topic {
  id: string;
  name: string;
  description: string;
  quizCount: number;
  categoryId: string;
  color?: string;
  icon?: React.ReactNode;
}

// Rotating icon set for deterministic topic visuals
const TOPIC_ICONS = [
  FileQuestion, BrainCircuit, Lightbulb, Atom, Microscope, Calculator,
  Music, Clapperboard, Map, Trophy, Gamepad2, BookOpen, Sparkles, Globe,
];

const getTopicMeta = (id: string, index: number) => {
  const hue = (id.charCodeAt(0) * 137 + index * 47) % 360;
  const color = `hsl(${hue}, 75%, 60%)`;
  const Icon = TOPIC_ICONS[index % TOPIC_ICONS.length];
  return { color, Icon };
};

export default function CategoryTopicsPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const [theme, setTheme] = useState<<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<<"grid" | "list">("grid");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { getByCategoryId } = useTopics();
  const { getById } = useCategories();

  const topicsQuery = getByCategoryId(categoryId);
  const categoryQuery = getById(categoryId);

  const rawTopics = topicsQuery.data || [];
  const category = categoryQuery.data;
  const isLoading = topicsQuery.isLoading || categoryQuery.isLoading;
  const isError = topicsQuery.isError || categoryQuery.isError;

  const isDark = theme === "dark");
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Enrich topics with deterministic color + icon
  const topics: Topic[] = useMemo(() => {
    return rawTopics.map((topic: any, index: number) => {
      const meta = getTopicMeta(topic.id, index);
      return {
        ...topic,
        color: meta.color,
        icon: <meta.Icon className="w-8 h-8" />,
      };
    });
  }, [rawTopics]);

  // Particles
  const particles = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(n) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 12 }).map((_, i) => {
      const r1 = rand(i + 1);
      const r2 = rand(i + 101);
      const r3 = rand(i + 201);
      const r4 = rand(i + 301);
      return {
        width: r1 * 3 + 1,
        height: r2 * 3 + 1,
        left: `${r3 * 100}%`,
        top: `${r4 * 100}%`,
        duration: r2 * 5 + 5,
        delay: rand(i + 401) * 3,
      };
    });
  }, []);

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        isDark
          ? "bg-[hsl(260,50%,4%)] text-white"
          : "bg-[hsl(260,20%,96%)] text-[hsl(260,50%,10%)]"
      }`}
      style={{
        backgroundImage: isDark
          ? `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 20% / 0.3), transparent),
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 30% / 0.15), transparent),
             radial-gradient(ellipse 40% 60% at 20% 100%, hsl(217 90% 30% / 0.1), transparent)`
          : `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 60% / 0.08), transparent),
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 60% / 0.05), transparent)`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              top: p.top,
              background: isDark
                ? "radial-gradient(circle, hsl(263 70% 58% / 0.3) 0%, transparent 70%)"
                : "radial-gradient(circle, hsl(263 70% 58% / 0.1) 0%, transparent 70%)",
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-xl transition-all ${
          isDark
            ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
            : "bg-white/80 hover:bg-white text-gray-700 border border-black/10 shadow-lg"
        }`}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? <Moon key="moon" className="w-5 h-5" /> : <Sun key="sun" className="w-5 h-5" />}
        </AnimatePresence>
      </motion.button>

      {/* Header Section */}
      <section className="relative pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/categories"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all mb-6 ${
                isDark
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-800 hover:bg-black/5"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 ${
                isDark
                  ? "bg-white/10 border border-white/20 text-white/90"
                  : "bg-black/5 border border-black/10 text-gray-700"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[hsl(263,70%,58%)]" />
              {isLoading ? "Loading..." : `${topics.length} Topics`}
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              <span className="text-gradient">
                {category?.name || "Category"} Topics
              </span>
            </h1>
            <p className={`text-lg max-w-xl mx-auto ${isDark ? "text-white/60" : "text-gray-500"}`}>
              {category?.description || "Explore topics and start quizzing to test your knowledge."}
            </p>
          </motion.div>

          {/* Search & Controls Bar */}
          <motion.div
            className={`flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto ${
              isDark ? "glass-card" : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"
            } p-2`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative flex-1 w-full">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-white/30" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className={`w-full py-3 pl-12 pr-4 rounded-2xl text-sm font-medium outline-none transition-all ${
                  isDark
                    ? "bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10"
                    : "bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-gray-100"
                }`}
              />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? isDark
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-800"
                    : isDark
                    ? "text-white/40 hover:text-white/70"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? isDark
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-800"
                    : isDark
                    ? "text-white/40 hover:text-white/70"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid/List */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                className="flex flex-col items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className={`w-10 h-10 animate-spin ${isDark ? "text-white/30" : "text-gray-400"}`} />
                <p className={`mt-4 text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>Loading topics...</p>
              </motion.div>
            ) : isError ? (
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-red-500/10" : "bg-red-50"}`}>
                  <AlertCircle className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-500"}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">Failed to load</h3>
                <p className={`text-sm max-w-md mb-6 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                  Something went wrong while fetching topics. Please try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-black/5"
                  }`}
                >
                  Retry
                </button>
              </motion.div>
            ) : filteredTopics.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                    isDark ? "bg-white/5" : "bg-gray-100"
                  }`}
                >
                  <Search className={`w-10 h-10 ${isDark ? "text-white/20" : "text-gray-300"}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">No topics found</h3>
                <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
                  Try adjusting your search query
                </p>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredTopics.map((topic, i) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={i}
                    isDark={isDark}
                    isHovered={hoveredId === topic.id}
                    onHover={() => setHoveredId(topic.id)}
                    onLeave={() => setHoveredId(null)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredTopics.map((topic, i) => (
                  <TopicListItem
                    key={topic.id}
                    topic={topic}
                    index={i}
                    isDark={isDark}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          {!isLoading && !isError && (
            <motion.p
              className={`text-center text-sm mt-10 ${isDark ? "text-white/40" : "text-gray-400"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Showing {filteredTopics.length} of {topics.length} topics
            </motion.p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDark ? "border-white/10" : "border-black/5"} py-8 px-6`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Quentrax" className="w-6 h-6 object-contain" />
            <span className="text-sm font-bold text-gradient">Quentrax</span>
          </div>
          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
            © 2026 Quentrax. Secured by Genzzi Identity Protocol v2.1
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOPIC CARD (Grid View)
   ═══════════════════════════════════════════════════════════════ */
function TopicCard({
  topic,
  index,
  isDark,
  isHovered,
  onHover,
  onLeave,
}: {
  topic: Topic;
  index: number;
  isDark: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link href={`/topics/${topic.id}`}>
        <motion.div
          className={`relative overflow-hidden cursor-pointer ${
            isDark
              ? "glass-card"
              : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"
          } p-6 h-full`}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Glow on Hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${topic.color}15, transparent 70%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Top Color Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{ background: `linear-gradient(90deg, ${topic.color}, transparent)` }}
          />

          {/* Icon */}
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative"
            style={{
              background: `${topic.color}15`,
              color: topic.color,
              border: `1px solid ${topic.color}30`,
            }}
            animate={isHovered ? { rotate: [0, -5, 5, 0], scale: 1.1 } : {}}
            transition={{ duration: 0.5 }}
          >
            {topic.icon}
          </motion.div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
          <p className={`text-sm mb-5 line-clamp-2 ${isDark ? "text-white/60" : "text-gray-500"}`}>
            {topic.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
              <span className="font-bold text-white/80">{topic.quizCount}</span> Quizzes
            </div>
          </div>

          {/* CTA */}
          <div
            className={`flex items-center gap-2 text-sm font-semibold transition-all ${
              isHovered ? "translate-x-1" : ""
            }`}
            style={{ color: topic.color }}
          >
            Start Quiz
            <motion.div
              animate={isHovered ? { x: [0, 4, 0] } : {}}
              transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOPIC LIST ITEM (List View)
   ═══════════════════════════════════════════════════════════════ */
function TopicListItem({
  topic,
  index,
  isDark,
}: {
  topic: Topic;
  index: number;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/topics/${topic.id}`}>
        <motion.div
          className={`flex items-center gap-5 p-4 cursor-pointer ${
            isDark
              ? "glass-card-sm"
              : "bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 shadow-sm"
          }`}
          whileHover={{ x: 4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${topic.color}15`,
              color: topic.color,
              border: `1px solid ${topic.color}30`,
            }}
          >
            {topic.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold">{topic.name}</h3>
            <p className={`text-sm truncate ${isDark ? "text-white/50" : "text-gray-500"}`}>
              {topic.description}
            </p>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-black" style={{ color: topic.color }}>
                {topic.quizCount}
              </div>
              <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>Quizzes</div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight
            className={`w-5 h-5 flex-shrink-0 ${isDark ? "text-white/30" : "text-gray-300"}`}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}