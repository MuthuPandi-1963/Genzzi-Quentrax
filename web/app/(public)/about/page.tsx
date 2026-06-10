"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Users, Award, Activity, Trophy, Star, Sparkles } from "lucide-react";
import SpotlightCard from "../../../components/ui/SpotlightCard"; // adjust path

// Reuse the same variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

// Team Member Card – now with SpotlightCard wrapper and enhanced animations
const TeamCard = ({
  name,
  role,
  avatarColor,
  isDark,
}: {
  name: string;
  role: string;
  avatarColor: string;
  isDark: boolean;
}) => (
  <motion.div variants={fadeIn}>
    <SpotlightCard
      className={`${
        isDark
          ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
          : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"
      } p-8 text-center`}
    >
      <motion.div
        className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold ${avatarColor}`}
        whileHover={{ scale: 1.15, rotate: 8 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {name.charAt(0)}
      </motion.div>
      <h3 className="mt-4 text-lg font-bold">{name}</h3>
      <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>{role}</p>
    </SpotlightCard>
  </motion.div>
);

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const bgImage = isDark
    ? `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 20% / 0.3), transparent),
       radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 30% / 0.15), transparent),
       radial-gradient(ellipse 40% 60% at 20% 100%, hsl(217 90% 30% / 0.1), transparent)`
    : `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 60% / 0.08), transparent),
       radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 60% / 0.05), transparent)`;

  const teamMembers = [
    { name: "Alice Johnson", role: "Founder & CEO", avatarColor: "bg-indigo-500" },
    { name: "Brian Smith", role: "Lead Developer", avatarColor: "bg-green-500" },
    { name: "Carla Ruiz", role: "UX Designer", avatarColor: "bg-yellow-500" },
    { name: "David Kim", role: "Marketing Head", avatarColor: "bg-red-500" },
  ];

  const values = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Excellence",
      description: "We strive for the highest quality in every quiz and learning tool we create.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description: "Building a supportive, engaging community of learners is at our core.",
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Growth",
      description: "We empower learners to track their progress and achieve personal growth.",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Achievement",
      description: "Rewarding effort and progress motivates our users to aim higher every day.",
    },
  ];

  return (
    <main
      className={`min-h-screen transition-colors duration-700 ${
        isDark ? "bg-[hsl(260,50%,4%)] text-white" : "bg-[hsl(260,20%,96%)] text-[hsl(260,50%,10%)]"
      }`}
      style={{ backgroundImage: bgImage, backgroundAttachment: "fixed" }}
    >
      {/* ── Hero Section ── */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating ambient orbs */}
          <motion.div
            className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full ${
              isDark ? "bg-purple-500/10" : "bg-purple-500/5"
            } blur-3xl`}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full ${
              isDark ? "bg-pink-500/10" : "bg-pink-500/5"
            } blur-3xl`}
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <motion.div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 ${
              isDark ? "bg-white/10 border border-white/20 text-white/90" : "bg-black/5 border border-black/10 text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[hsl(263,70%,58%)]" />
            </motion.div>
            Our Vision
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black mb-6">
            About{" "}
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">
              Quentrax
            </span>
          </h1>
          <p className={`text-lg md:text-xl ${isDark ? "text-white/70" : "text-gray-600"} max-w-2xl mx-auto`}>
            Our mission is to make assessment creation engaging, intelligent, and enterprise-ready.
            From smart quizzes to performance tracking, Quentrax is designed to help teams evaluate
            with confidence.
          </p>
        </motion.div>
      </section>

      {/* ── Values Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Our Values
              </span>
            </h2>
            <p className={`text-lg ${isDark ? "text-white/60" : "text-gray-500"}`}>
              The principles that drive everything we do
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-4"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeIn}>
                <SpotlightCard
                  className={`${
                    isDark
                      ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
                      : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"
                  } p-8 text-center`}
                >
                  <motion.div
                    className={`flex items-center justify-center h-14 w-14 rounded-2xl mx-auto mb-5 ${
                      isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                    }`}
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-[hsl(263,70%,58%)]">{value.icon}</span>
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
                    {value.description}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Meet Our Team
              </span>
            </h2>
            <p className={`text-lg ${isDark ? "text-white/60" : "text-gray-500"} max-w-2xl mx-auto`}>
              A passionate team committed to transforming learning into an engaging and rewarding
              experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-8 md:grid-cols-4"
          >
            {teamMembers.map((member, idx) => (
              <TeamCard
                key={idx}
                name={member.name}
                role={member.role}
                avatarColor={member.avatarColor}
                isDark={isDark}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className={`${
              isDark
                ? "bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10"
                : "bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-xl"
            } p-10 md:p-14 relative overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full ${
                  isDark ? "bg-purple-500/15" : "bg-purple-500/8"
                } blur-3xl`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-4xl font-black mb-6">
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Our Story
                </span>
              </h2>
              <p className={`text-lg ${isDark ? "text-white/70" : "text-gray-600"} mb-4`}>
                Quentrax started with a simple idea: evaluation should be exciting, intelligent, and
                measurable. We combine assessment workflows, performance analytics, and candidate
                insights to help organizations achieve better outcomes.
              </p>
              <p className={`text-lg ${isDark ? "text-white/70" : "text-gray-600"}`}>
                From our humble beginnings to a thriving platform with thousands of active users, we
                continue to innovate and expand the way people learn.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}