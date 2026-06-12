// "use client";

// import React, { useState, useEffect, useRef, createContext, useContext } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "next-themes";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   BookOpen,
//   ClipboardList,
//   Trophy,
//   Coins,
//   Settings,
//   ChevronRight,
//   ChevronDown,
//   Menu,
//   X,
//   LogOut,
//   Bell,
//   Search,
//   Sparkles,
//   Clock,
//   Award,
//   Moon,
//   Sun,
//   Zap,
//   PanelLeft,
//   PanelLeftClose,
//   Target,
//   TrendingUp,
//   Star,
//   CheckCircle2,
//   Circle,
//   BarChart2,
//   BookMarked,
//   Flame,
//   Medal,
//   Lock,
//   PlayCircle,
//   RotateCcw,
//   ChevronUp,
//   Layers,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// /* ═══════════════════════════════════════════════════════════════════════════
//    STUDENT DASHBOARD — QUENTRAX
//    Same design system as admin (Deep Purple Space + Neon), student-facing.
//    Signature element: animated radial progress ring on the dashboard hero.
//    ═══════════════════════════════════════════════════════════════════════════ */

// /* ──────────────────────────────────────────────────────────────────────────
//    SAMPLE DATA (shaped from Prisma schema)
//    ────────────────────────────────────────────────────────────────────────── */

// const SAMPLE_STUDENT = {
//   name: "Sarah Chen",
//   username: "sarah.chen",
//   email: "sarah.chen@email.com",
//   avatar: null,
//   coins: 2340,
//   streak: 7,
//   // UserProfile role
//   role: "STUDENT" as const,
// };

// // QuizHistory rows
// const SAMPLE_QUIZ_HISTORY = [
//   { id: "qh1", quizTitle: "Cell Biology Fundamentals", topicName: "Biology", score: 92, totalPoints: 100, completedAt: "2025-06-10T14:30:00Z", difficulty: "medium" as const },
//   { id: "qh2", quizTitle: "Newton's Laws of Motion", topicName: "Physics", score: 78, totalPoints: 100, completedAt: "2025-06-09T10:15:00Z", difficulty: "hard" as const },
//   { id: "qh3", quizTitle: "World War II Timeline", topicName: "History", score: 95, totalPoints: 100, completedAt: "2025-06-08T16:00:00Z", difficulty: "easy" as const },
//   { id: "qh4", quizTitle: "Algebra & Functions", topicName: "Mathematics", score: 65, totalPoints: 100, completedAt: "2025-06-07T11:00:00Z", difficulty: "hard" as const },
// ];

// // AssessmentAssignment rows (with Assessment data joined)
// const SAMPLE_ASSIGNMENTS = [
//   {
//     id: "aa1",
//     title: "Science Mid-Term 2025",
//     topicName: "Biology",
//     status: "PENDING" as const,
//     dueDate: "2025-06-15T23:59:00Z",
//     timeLimit: 90,
//     totalQuestions: 40,
//     passingScore: 70,
//   },
//   {
//     id: "aa2",
//     title: "Physics Final Exam",
//     topicName: "Physics",
//     status: "IN_PROGRESS" as const,
//     dueDate: "2025-06-18T23:59:00Z",
//     timeLimit: 120,
//     totalQuestions: 50,
//     passingScore: 60,
//   },
//   {
//     id: "aa3",
//     title: "History Unit 3 Quiz",
//     topicName: "History",
//     status: "COMPLETED" as const,
//     dueDate: "2025-06-05T23:59:00Z",
//     timeLimit: 45,
//     totalQuestions: 20,
//     passingScore: 65,
//     score: 88,
//   },
//   {
//     id: "aa4",
//     title: "Algebra Mastery Check",
//     topicName: "Mathematics",
//     status: "PENDING" as const,
//     dueDate: "2025-06-20T23:59:00Z",
//     timeLimit: 60,
//     totalQuestions: 30,
//     passingScore: 75,
//   },
// ];

// // CoinsHistory rows
// const SAMPLE_COINS_HISTORY = [
//   { id: "ch1", coins: 150, reason: "Completed Science Quiz #42", createdAt: "2025-06-10T14:31:00Z" },
//   { id: "ch2", coins: 50, reason: "7-day streak bonus", createdAt: "2025-06-10T00:00:00Z" },
//   { id: "ch3", coins: 100, reason: "Perfect score on History Quiz", createdAt: "2025-06-08T16:01:00Z" },
//   { id: "ch4", coins: -200, reason: "Unlocked Physics Study Pack", createdAt: "2025-06-06T09:00:00Z" },
// ];

// // Available Quizzes (Quiz table rows)
// const SAMPLE_AVAILABLE_QUIZZES = [
//   { id: "q1", title: "Organic Chemistry Basics", topicName: "Chemistry", totalPoints: 100, timeLimit: 30, questionCount: 20, difficulty: "medium" as const, tags: ["chemistry", "organic"] },
//   { id: "q2", title: "Shakespeare's Tragedies", topicName: "Literature", totalPoints: 80, timeLimit: 25, questionCount: 16, difficulty: "easy" as const, tags: ["literature", "english"] },
//   { id: "q3", title: "Quantum Mechanics Intro", topicName: "Physics", totalPoints: 120, timeLimit: 45, questionCount: 24, difficulty: "hard" as const, tags: ["physics", "quantum"] },
// ];

// /* ──────────────────────────────────────────────────────────────────────────
//    1. CONTEXT
//    ────────────────────────────────────────────────────────────────────────── */

// interface StudentSidebarCtx {
//   collapsed: boolean;
//   setCollapsed: (v: boolean) => void;
//   mobileOpen: boolean;
//   setMobileOpen: (v: boolean) => void;
// }

// const StudentSidebarContext = createContext<StudentSidebarCtx>({
//   collapsed: false, setCollapsed: () => {},
//   mobileOpen: false, setMobileOpen: () => {},
// });
// const useStudentSidebar = () => useContext(StudentSidebarContext);

// /* ──────────────────────────────────────────────────────────────────────────
//    2. NAVIGATION
//    ────────────────────────────────────────────────────────────────────────── */

// interface NavItem {
//   id: string;
//   label: string;
//   icon: React.ElementType;
//   href: string;
//   badge?: number | string;
//   badgeColor?: string;
//   children?: NavItem[];
// }

// const STUDENT_NAV: NavItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/student" },
//   { id: "quizzes", label: "Quizzes", icon: BookOpen, href: "/student/quizzes", badge: 3, badgeColor: "bg-[hsl(263,70%,58%)]" },
//   {
//     id: "assessments", label: "Assessments", icon: ClipboardList, href: "/student/assessments",
//     badge: 2, badgeColor: "bg-[hsl(330,80%,60%)]",
//   },
//   {
//     id: "progress", label: "My Progress", icon: TrendingUp, href: "/student/progress",
//     children: [
//       { id: "history", label: "Quiz History", icon: RotateCcw, href: "/student/progress/history" },
//       { id: "stats", label: "Performance", icon: BarChart2, href: "/student/progress/stats" },
//     ],
//   },
//   { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/student/leaderboard" },
//   { id: "achievements", label: "Achievements", icon: Award, href: "/student/achievements" },
//   { id: "coins", label: "My Coins", icon: Coins, href: "/student/coins" },
//   { id: "topics", label: "Browse Topics", icon: Layers, href: "/student/topics" },
//   { id: "settings", label: "Settings", icon: Settings, href: "/student/settings" },
// ];

// /* ──────────────────────────────────────────────────────────────────────────
//    3. TOOLTIP (identical fix pattern from admin: fixed pos, inline z)
//    ────────────────────────────────────────────────────────────────────────── */

// function Tooltip({
//   children, content, side = "right", show = true,
// }: {
//   children: React.ReactNode; content: string;
//   side?: "left" | "right" | "top" | "bottom"; show?: boolean;
// }) {
//   const [visible, setVisible] = useState(false);
//   const [coords, setCoords] = useState({ top: 0, left: 0 });
//   const ref = useRef<HTMLDivElement>(null);
//   const { resolvedTheme } = useTheme();
//   const isDark = resolvedTheme === "dark";

//   if (!show) return <>{children}</>;

//   const updateCoords = () => {
//     if (!ref.current) return;
//     const r = ref.current.getBoundingClientRect();
//     const GAP = 8;
//     const map = {
//       right:  { top: r.top + r.height / 2, left: r.right + GAP },
//       left:   { top: r.top + r.height / 2, left: r.left - GAP },
//       top:    { top: r.top - GAP,           left: r.left + r.width / 2 },
//       bottom: { top: r.bottom + GAP,        left: r.left + r.width / 2 },
//     };
//     setCoords(map[side]);
//   };

//   const transform = {
//     right:  "translateY(-50%)",
//     left:   "translateX(-100%) translateY(-50%)",
//     top:    "translateX(-50%) translateY(-100%)",
//     bottom: "translateX(-50%)",
//   }[side];

//   return (
//     <div ref={ref} className="relative flex items-center"
//       onMouseEnter={() => { updateCoords(); setVisible(true); }}
//       onMouseLeave={() => setVisible(false)}>
//       {children}
//       <AnimatePresence>
//         {visible && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.92 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.92 }}
//             transition={{ duration: 0.12 }}
//             className={cn(
//               "fixed whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold pointer-events-none border shadow-lg",
//               isDark ? "bg-[hsl(260,45%,9%)] border-white/15 text-white" : "bg-white border-black/10 text-[hsl(260,40%,10%)]"
//             )}
//             style={{ zIndex: 9999, top: coords.top, left: coords.left, transform,
//               boxShadow: isDark ? "0 8px 32px -4px rgba(139,92,246,0.25)" : "0 8px 32px -4px rgba(139,92,246,0.12)" }}
//           >
//             {content}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    4. NAV ITEM (handles both leaf + collapsible)
//    ────────────────────────────────────────────────────────────────────────── */

// function StudentNavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
//   const pathname = usePathname();
//   const { resolvedTheme } = useTheme();
//   const isDark = resolvedTheme === "dark";
//   const [expanded, setExpanded] = useState(false);
//   const flyoutRef = useRef<HTMLDivElement>(null);

//   const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
//   const hasActiveChild = item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + "/"));

//   useEffect(() => { if (hasActiveChild) setExpanded(true); }, [hasActiveChild]);
//   useEffect(() => { if (!collapsed) setExpanded(false); }, [collapsed]);

//   useEffect(() => {
//     if (!expanded || !collapsed || !item.children) return;
//     const handler = (e: MouseEvent) => {
//       if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setExpanded(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [expanded, collapsed, item.children]);

//   const activeStyle = isDark
//     ? "bg-[hsl(263,70%,58%)]/12 border-[hsl(263,70%,58%)]/35 text-[hsl(263,70%,58%)]"
//     : "bg-[hsl(263,70%,58%)]/8 border-[hsl(263,70%,58%)]/25 text-[hsl(263,70%,58%)]";
//   const inactiveStyle = isDark
//     ? "bg-transparent border-transparent text-white/65 hover:bg-white/5 hover:text-white"
//     : "bg-transparent border-transparent text-gray-500 hover:bg-black/5 hover:text-gray-800";

//   const Icon = item.icon;

//   // Collapsed + has children → flyout
//   if (collapsed && item.children) {
//     return (
//       <Tooltip content={item.label} side="right" show={!expanded}>
//         <div className="relative" ref={flyoutRef}>
//           <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
//             onClick={() => setExpanded(!expanded)}
//             className={cn(
//               "relative w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-1 border transition-all duration-200",
//               isActive || hasActiveChild ? activeStyle : inactiveStyle
//             )}>
//             <Icon className="w-[18px] h-[18px]" />
//           </motion.button>
//           <AnimatePresence>
//             {expanded && (
//               <motion.div initial={{ opacity: 0, x: -8, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
//                 exit={{ opacity: 0, x: -8, scale: 0.95 }} transition={{ duration: 0.18 }}
//                 className={cn("absolute left-full top-0 ml-3 min-w-[200px] rounded-2xl p-2 border shadow-xl",
//                   isDark ? "bg-[hsl(260,45%,9%)] border-white/10" : "bg-white border-black/10")}
//                 style={{ zIndex: 9998, boxShadow: isDark ? "0 16px 48px -8px rgba(139,92,246,0.3)" : "0 16px 48px -8px rgba(139,92,246,0.15)" }}>
//                 <div className={cn("px-3 py-2 text-xs font-bold uppercase tracking-wider mb-1", isDark ? "text-white/40" : "text-gray-400")}>
//                   {item.label}
//                 </div>
//                 {item.children.map(child => (
//                   <Link key={child.id} href={child.href} onClick={() => setExpanded(false)}
//                     className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
//                       pathname === child.href ? (isDark ? "text-[hsl(263,70%,58%)]" : "text-[hsl(263,70%,58%)]") : (isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-black/5"))}>
//                     <child.icon className="w-4 h-4" />
//                     {child.label}
//                   </Link>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </Tooltip>
//     );
//   }

//   // Collapsed leaf
//   if (collapsed) {
//     return (
//       <Tooltip content={item.label} side="right">
//         <Link href={item.href} className="block">
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
//             className={cn("relative w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-1 border transition-all duration-200",
//               isActive ? activeStyle : inactiveStyle)}>
//             <Icon className="w-5 h-5" />
//             {item.badge && (
//               <span className={cn("absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white",
//                 item.badgeColor || "bg-[hsl(330,80%,60%)]")}>
//                 {typeof item.badge === "number" ? (item.badge > 9 ? "9+" : item.badge) : item.badge}
//               </span>
//             )}
//           </motion.div>
//         </Link>
//       </Tooltip>
//     );
//   }

//   // Expanded with children
//   if (item.children) {
//     return (
//       <div>
//         <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
//           onClick={() => setExpanded(!expanded)}
//           className={cn("w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium border transition-all duration-200",
//             isActive || hasActiveChild ? activeStyle : inactiveStyle)}>
//           <Icon className="w-[18px] h-[18px] flex-shrink-0" />
//           <span className="flex-1 text-left">{item.label}</span>
//           <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
//             <ChevronDown className="w-3.5 h-3.5 opacity-50" />
//           </motion.div>
//         </motion.button>
//         <AnimatePresence>
//           {expanded && (
//             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
//               className="overflow-hidden">
//               <div className="pt-1 pb-1 space-y-0.5">
//                 {item.children.map(child => (
//                   <Link key={child.id} href={child.href} className="block">
//                     <motion.div whileHover={{ x: 2 }}
//                       className={cn("flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium border transition-all duration-200",
//                         "ml-6",
//                         pathname === child.href
//                           ? activeStyle
//                           : isDark ? "bg-transparent border-transparent text-white/55 hover:bg-white/5 hover:text-white/90" : "bg-transparent border-transparent text-gray-400 hover:bg-black/5 hover:text-gray-700")}>
//                       <child.icon className="w-[15px] h-[15px] flex-shrink-0" />
//                       <span className="flex-1">{child.label}</span>
//                     </motion.div>
//                   </Link>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   }

//   // Expanded leaf
//   return (
//     <Link href={item.href} className="block">
//       <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
//         className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium border transition-all duration-200",
//           isActive ? activeStyle : inactiveStyle)}>
//         <Icon className="w-[18px] h-[18px] flex-shrink-0" />
//         <span className="flex-1">{item.label}</span>
//         {item.badge && (
//           <span className={cn("px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white",
//             item.badgeColor || "bg-[hsl(330,80%,60%)]")}>
//             {item.badge}
//           </span>
//         )}
//       </motion.div>
//     </Link>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    5. SIDEBAR CONTENT
//    ────────────────────────────────────────────────────────────────────────── */

// function StudentSidebarContent({
//   collapsed, setCollapsed, setMobileOpen, isMobile,
// }: { collapsed: boolean; setCollapsed: (v: boolean) => void; setMobileOpen: (v: boolean) => void; isMobile: boolean }) {
//   const { resolvedTheme } = useTheme();
//   const isDark = resolvedTheme === "dark";

//   return (
//     <div className="relative flex flex-col h-full w-full">
//       {/* Header */}
//       <div className={cn("flex items-center h-16 px-4 border-b flex-shrink-0", isDark ? "border-white/10" : "border-black/10")}>
//         <AnimatePresence mode="wait">
//           {!collapsed ? (
//             <motion.div key="exp" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
//               transition={{ duration: 0.18 }} className="flex items-center gap-3 flex-1 min-w-0">
//               <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center shadow-lg shadow-[hsl(263,70%,58%)]/20 flex-shrink-0">
//                 <Zap className="w-5 h-5 text-white" />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="text-lg font-black tracking-tight"><span className="text-gradient">Quentrax</span></h1>
//                 <p className={cn("text-[10px] font-semibold uppercase tracking-widest truncate", isDark ? "text-white/40" : "text-gray-400")}>
//                   Student Portal
//                 </p>
//               </div>
//             </motion.div>
//           ) : (
//             <motion.div key="col" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.18 }} className="mx-auto">
//               <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center">
//                 <Zap className="w-5 h-5 text-white" />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Coins + streak pill (visible when expanded) */}
//       <AnimatePresence>
//         {!collapsed && (
//           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
//             className={cn("mx-3 mt-3 rounded-2xl px-3 py-2.5 flex items-center gap-3 border",
//               isDark ? "bg-white/4 border-white/8" : "bg-black/3 border-black/8")}>
//             <div className="flex items-center gap-1.5">
//               <Coins className="w-4 h-4 text-[hsl(45,95%,55%)]" />
//               <span className="text-sm font-bold text-[hsl(45,95%,55%)]">{SAMPLE_STUDENT.coins.toLocaleString()}</span>
//             </div>
//             <div className={cn("w-px h-4", isDark ? "bg-white/10" : "bg-black/10")} />
//             <div className="flex items-center gap-1.5">
//               <Flame className="w-4 h-4 text-[hsl(25,95%,55%)]" />
//               <span className="text-sm font-bold text-[hsl(25,95%,55%)]">{SAMPLE_STUDENT.streak} day streak</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Nav */}
//       <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 no-scrollbar">
//         {STUDENT_NAV.map(item => (
//           <StudentNavItem key={item.id} item={item} collapsed={collapsed} />
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className={cn("p-3 border-t shrink-0", isDark ? "border-white/10" : "border-black/10")}>
//         {!collapsed ? (
//           <div className={cn("rounded-2xl p-3 border flex items-center gap-3",
//             isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10")}>
//             <div className="w-9 h-9 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//               SC
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold truncate">{SAMPLE_STUDENT.name}</p>
//               <p className={cn("text-xs truncate", isDark ? "text-white/50" : "text-gray-500")}>{SAMPLE_STUDENT.email}</p>
//             </div>
//             <Tooltip content="Logout" side="top">
//               <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//                 className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
//                   isDark ? "text-white/50 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10" : "text-gray-400 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10")}>
//                 <LogOut className="w-4 h-4" />
//               </motion.button>
//             </Tooltip>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center gap-2">
//             <Tooltip content={SAMPLE_STUDENT.name} side="right">
//               <div className="w-10 h-10 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold cursor-pointer">
//                 SC
//               </div>
//             </Tooltip>
//             <Tooltip content="Logout" side="right">
//               <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//                 className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
//                   isDark ? "text-white/50 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10" : "text-gray-400 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10")}>
//                 <LogOut className="w-4 h-4" />
//               </motion.button>
//             </Tooltip>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    6. SIDEBAR (desktop + mobile, same pattern as admin fixes)
//    ────────────────────────────────────────────────────────────────────────── */

// export function StudentSidebar() {
//   const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useStudentSidebar();
//   const { resolvedTheme } = useTheme();
//   const isDark = resolvedTheme === "dark";

//   const bgStyle = {
//     backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
//     backgroundColor: isDark ? "hsla(260,50%,4%,0.88)" : "hsla(260,30%,98%,0.88)",
//     borderRight: isDark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.09)",
//     boxShadow: isDark ? "4px 0 24px -4px rgba(139,92,246,0.15)" : "4px 0 24px -4px rgba(139,92,246,0.08)",
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 lg:hidden" style={{ zIndex: 200, backdropFilter: "blur(4px)" }}
//             onClick={() => setMobileOpen(false)} />
//         )}
//       </AnimatePresence>

//       {/* Desktop */}
//       <motion.aside initial={false} animate={{ width: collapsed ? 80 : 272 }}
//         transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
//         className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0" style={{ zIndex: 50 }}>
//         <div className="absolute inset-0" style={bgStyle} />
//         <StudentSidebarContent collapsed={collapsed} setCollapsed={setCollapsed} setMobileOpen={setMobileOpen} isMobile={false} />
//       </motion.aside>

//       {/* Mobile */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
//             transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
//             className="fixed left-0 top-0 h-screen flex flex-col lg:hidden"
//             style={{ width: 272, zIndex: 300, ...bgStyle }}>
//             <StudentSidebarContent collapsed={false} setCollapsed={setCollapsed} setMobileOpen={setMobileOpen} isMobile={true} />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    7. TOPBAR
//    ────────────────────────────────────────────────────────────────────────── */



// export function Notification({setNotifOpen,notifOpen,isDark}:{
//   setNotifOpen : (val:boolean)=>void;
//   notifOpen: boolean;
//   isDark: boolean;
  
// }){
//   // Sample notifications (Assessment deadlines + coin events)
//   const notifs = [
//     { id: 1, title: "Assessment due soon", desc: "Science Mid-Term due in 3 days", time: "just now", color: "bg-[hsl(330,80%,60%)]" },
//     { id: 2, title: "Coins earned!", desc: "You earned 150 coins from Science Quiz", time: "2h ago", color: "bg-[hsl(45,95%,55%)]" },
//     { id: 3, title: "Streak milestone", desc: "7-day streak! Keep it up 🔥", time: "1d ago", color: "bg-[hsl(25,95%,55%)]" },
//   ];
//   return (
//     <div className="relative">
//           <Tooltip content="Notifications" side="bottom">
//             <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
//               onClick={() => setNotifOpen(!notifOpen)}
//               className={cn("relative w-9 h-9 rounded-xl flex items-center justify-center border transition-colors",
//                 isDark ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
//                   : "bg-black/5 border-black/10 text-gray-500 hover:bg-black/10 hover:text-gray-900")}>
//               <Bell className="w-4 h-4" />
//               <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[hsl(330,80%,60%)] text-white text-[9px] font-bold flex items-center justify-center">
//                 {notifs.length}
//               </span>
//             </motion.button>
//           </Tooltip>
//           <AnimatePresence>
//             {notifOpen && (
//               <>
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                   className="fixed inset-0" style={{ zIndex: 9990 }} onClick={() => setNotifOpen(false)} />
//                 <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.18 }}
//                   className={cn("absolute right-0 top-full mt-2 w-72 rounded-2xl border overflow-hidden",
//                     isDark ? "bg-[hsl(260,45%,9%)] border-white/10" : "bg-white border-black/10")}
//                   style={{ zIndex: 9991, backdropFilter: "blur(16px)", boxShadow: isDark ? "0 16px 48px -8px rgba(139,92,246,0.28)" : "0 16px 48px -8px rgba(139,92,246,0.14)" }}>
//                   <div className={cn("flex items-center justify-between px-4 py-3 border-b", isDark ? "border-white/10" : "border-black/10")}>
//                     <h3 className="text-sm font-bold">Notifications</h3>
//                     <button className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">Clear all</button>
//                   </div>
//                   {notifs.map((n, i) => (
//                     <motion.div key={n.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: i * 0.05 }}
//                       className={cn("flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-black/5")}>
//                       <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.color)} />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold truncate">{n.title}</p>
//                         <p className={cn("text-xs truncate mt-0.5", isDark ? "text-white/50" : "text-gray-500")}>{n.desc}</p>
//                         <p className={cn("text-[10px] mt-1", isDark ? "text-white/30" : "text-gray-400")}>{n.time}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               </>
//             )}
//           </AnimatePresence>
//         </div>
//   )
// }


// /* ──────────────────────────────────────────────────────────────────────────
//    9. DASHBOARD PAGE
//    ────────────────────────────────────────────────────────────────────────── */

// export function StudentDashboard() {
//   const { resolvedTheme } = useTheme();
//   const isDark = resolvedTheme === "dark";

//   const avgScore = Math.round(SAMPLE_QUIZ_HISTORY.reduce((a, q) => a + q.score, 0) / SAMPLE_QUIZ_HISTORY.length);
//   const completedAssessments = SAMPLE_ASSIGNMENTS.filter(a => a.status === "COMPLETED").length;
//   const pendingAssessments = SAMPLE_ASSIGNMENTS.filter(a => a.status === "PENDING").length;

//   const card = cn(
//     "rounded-3xl border transition-all duration-300",
//     isDark ? "bg-white/4 border-white/8 hover:border-white/14" : "bg-white/80 border-black/5 shadow-md hover:shadow-lg"
//   );

//   const diffColor = { easy: "text-[hsl(142,76%,45%)]", medium: "text-[hsl(45,95%,55%)]", hard: "text-[hsl(0,84%,60%)]" };
//   const diffBg = { easy: "bg-[hsl(142,76%,45%)]/12", medium: "bg-[hsl(45,95%,55%)]/12", hard: "bg-[hsl(0,84%,60%)]/12" };
//   const statusColor = {
//     PENDING: { text: "text-[hsl(45,95%,55%)]", bg: "bg-[hsl(45,95%,55%)]/12", label: "Pending" },
//     IN_PROGRESS: { text: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/12", label: "In Progress" },
//     COMPLETED: { text: "text-[hsl(142,76%,45%)]", bg: "bg-[hsl(142,76%,45%)]/12", label: "Completed" },
//     EXEMPTED: { text: "text-white/40", bg: "bg-white/8", label: "Exempted" },
//   };

//   const formatDate = (iso: string) => {
//     const d = new Date(iso);
//     return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   };

//   const daysUntil = (iso: string) => {
//     const diff = new Date(iso).getTime() - Date.now();
//     return Math.ceil(diff / (1000 * 60 * 60 * 24));
//   };

//   return (
//     <div className="space-y-6">
//       {/* ── HERO: progress + welcome ── */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
//         className={cn("rounded-3xl border overflow-hidden relative",
//           isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-black/5 shadow-md")}>
//         {/* Ambient glow */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
//           <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[hsl(263,70%,58%)]/10 blur-3xl" />
//           <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[hsl(330,80%,60%)]/8 blur-3xl" />
//         </div>

//         <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
//           {/* Welcome text */}
//           <div className="flex-1">
//             <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 border",
//               isDark ? "bg-[hsl(142,76%,45%)]/10 border-[hsl(142,76%,45%)]/25 text-[hsl(142,76%,45%)]"
//                 : "bg-[hsl(142,76%,45%)]/8 border-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)]")}>
//               <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142,76%,45%)] animate-pulse inline-block" />
//               Active learner
//             </div>
//             <h1 className="text-3xl lg:text-4xl font-black mb-2">
//               Hey, <span className="text-gradient">Sarah</span> 👋
//             </h1>
//             <p className={cn("text-sm lg:text-base mb-6", isDark ? "text-white/55" : "text-gray-500")}>
//               You've completed {SAMPLE_QUIZ_HISTORY.length} quizzes this week. Keep that streak alive!
//             </p>

//             {/* Quick stats row */}
//             <div className="flex flex-wrap gap-4">
//               {[
//                 { label: "Avg score", value: `${avgScore}%`, icon: Target, color: "hsl(263,70%,58%)" },
//                 { label: "Quizzes done", value: SAMPLE_QUIZ_HISTORY.length, icon: CheckCircle2, color: "hsl(142,76%,45%)" },
//                 { label: "Assessments due", value: pendingAssessments, icon: ClipboardList, color: "hsl(330,80%,60%)" },
//                 { label: "Coins", value: SAMPLE_STUDENT.coins.toLocaleString(), icon: Coins, color: "hsl(45,95%,55%)" },
//               ].map((s, i) => (
//                 <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 + i * 0.06 }}
//                   className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl border",
//                     isDark ? "bg-white/5 border-white/10" : "bg-black/3 border-black/8")}>
//                   <div className="w-8 h-8 rounded-xl flex items-center justify-center"
//                     style={{ backgroundColor: `${s.color}18` }}>
//                     <s.icon className="w-4 h-4" style={{ color: s.color }} />
//                   </div>
//                   <div>
//                     <p className="text-base font-black leading-none" style={{ color: s.color }}>{s.value}</p>
//                     <p className={cn("text-[11px] mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>{s.label}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* Progress rings — the signature element */}
//           <div className={cn("flex gap-6 lg:gap-8 p-5 rounded-2xl border flex-shrink-0",
//             isDark ? "bg-white/3 border-white/8" : "bg-black/2 border-black/6")}>
//             <ProgressRing percent={avgScore} size={110} stroke={9} label="Avg Score" sublabel="this week" />
//             <div className={cn("w-px", isDark ? "bg-white/8" : "bg-black/8")} />
//             <ProgressRing
//               percent={Math.round((completedAssessments / SAMPLE_ASSIGNMENTS.length) * 100)}
//               size={110} stroke={9} label="Assessments" sublabel="completed" />
//           </div>
//         </div>
//       </motion.div>

//       {/* ── MAIN GRID ── */}
//       <div className="grid lg:grid-cols-3 gap-5">

//         {/* Left col: Upcoming assessments */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
//           className={cn(card, "lg:col-span-2 p-5")}>
//           <div className="flex items-center justify-between mb-5">
//             <div>
//               <h2 className="text-base font-bold">Upcoming Assessments</h2>
//               <p className={cn("text-xs mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>
//                 {pendingAssessments} pending · {SAMPLE_ASSIGNMENTS.filter(a => a.status === "IN_PROGRESS").length} in progress
//               </p>
//             </div>
//             <Link href="/student/assessments"
//               className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium flex items-center gap-1">
//               View all <ChevronRight className="w-3 h-3" />
//             </Link>
//           </div>

//           <div className="space-y-3">
//             {SAMPLE_ASSIGNMENTS.map((a, i) => {
//               const s = statusColor[a.status];
//               const days = daysUntil(a.dueDate);
//               return (
//                 <motion.div key={a.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 + i * 0.07 }}
//                   className={cn("flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 group cursor-pointer",
//                     isDark ? "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/14"
//                       : "bg-black/2 border-black/6 hover:bg-black/4 hover:border-black/10")}>
//                   {/* Status icon */}
//                   <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0", s.bg)}>
//                     {a.status === "COMPLETED" ? <CheckCircle2 className={cn("w-5 h-5", s.text)} /> :
//                       a.status === "IN_PROGRESS" ? <PlayCircle className={cn("w-5 h-5", s.text)} /> :
//                         <Circle className={cn("w-5 h-5", s.text)} />}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className="text-sm font-semibold truncate">{a.title}</p>
//                       <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold", s.bg, s.text)}>{s.label}</span>
//                     </div>
//                     <div className={cn("flex items-center gap-3 mt-1 text-xs", isDark ? "text-white/45" : "text-gray-500")}>
//                       <span>{a.topicName}</span>
//                       <span>·</span>
//                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.timeLimit}m</span>
//                       <span>·</span>
//                       <span>{a.totalQuestions} questions</span>
//                     </div>
//                   </div>

//                   <div className="text-right flex-shrink-0">
//                     {a.status === "COMPLETED" && a.score !== undefined ? (
//                       <div>
//                         <p className={cn("text-sm font-black", a.score >= a.passingScore ? "text-[hsl(142,76%,45%)]" : "text-[hsl(0,84%,60%)]")}>
//                           {a.score}%
//                         </p>
//                         <p className={cn("text-[10px]", isDark ? "text-white/35" : "text-gray-400")}>score</p>
//                       </div>
//                     ) : (
//                       <div>
//                         <p className={cn("text-xs font-bold",
//                           days <= 2 ? "text-[hsl(0,84%,60%)]" : days <= 5 ? "text-[hsl(45,95%,55%)]" : isDark ? "text-white/60" : "text-gray-500")}>
//                           {days <= 0 ? "Overdue" : `${days}d left`}
//                         </p>
//                         <p className={cn("text-[10px]", isDark ? "text-white/35" : "text-gray-400")}>
//                           {formatDate(a.dueDate)}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </motion.div>

//         {/* Right col: Coins + recent activity */}
//         <div className="flex flex-col gap-5">
//           {/* Coins widget */}
//           <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
//             className={cn(card, "p-5")}>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-base font-bold">Coin Wallet</h2>
//               <Link href="/student/coins" className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">History</Link>
//             </div>
//             {/* Balance */}
//             <div className={cn("rounded-2xl p-4 border mb-4 flex items-center gap-4",
//               isDark ? "bg-[hsl(45,95%,55%)]/8 border-[hsl(45,95%,55%)]/20"
//                 : "bg-[hsl(45,95%,55%)]/6 border-[hsl(45,95%,55%)]/15")}>
//               <div className="w-12 h-12 rounded-2xl bg-[hsl(45,95%,55%)]/15 flex items-center justify-center">
//                 <Coins className="w-6 h-6 text-[hsl(45,95%,55%)]" />
//               </div>
//               <div>
//                 <p className="text-2xl font-black text-[hsl(45,95%,55%)]">{SAMPLE_STUDENT.coins.toLocaleString()}</p>
//                 <p className={cn("text-xs", isDark ? "text-white/45" : "text-gray-500")}>total balance</p>
//               </div>
//             </div>
//             {/* Recent transactions */}
//             <div className="space-y-2">
//               {SAMPLE_COINS_HISTORY.slice(0, 3).map((ch, i) => (
//                 <motion.div key={ch.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                   transition={{ delay: 0.3 + i * 0.05 }}
//                   className="flex items-center gap-3">
//                   <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black",
//                     ch.coins > 0 ? "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]" : "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)]")}>
//                     {ch.coins > 0 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-medium truncate">{ch.reason}</p>
//                     <p className={cn("text-[10px]", isDark ? "text-white/35" : "text-gray-400")}>{formatDate(ch.createdAt)}</p>
//                   </div>
//                   <span className={cn("text-xs font-bold flex-shrink-0",
//                     ch.coins > 0 ? "text-[hsl(142,76%,45%)]" : "text-[hsl(0,84%,60%)]")}>
//                     {ch.coins > 0 ? "+" : ""}{ch.coins}
//                   </span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Streak card */}
//           <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
//             className={cn(card, "p-5 relative overflow-hidden")}>
//             <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[hsl(25,95%,55%)]/12 blur-2xl pointer-events-none" />
//             <div className="relative">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-11 h-11 rounded-2xl bg-[hsl(25,95%,55%)]/15 flex items-center justify-center">
//                   <Flame className="w-5 h-5 text-[hsl(25,95%,55%)]" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-black text-[hsl(25,95%,55%)]">{SAMPLE_STUDENT.streak}</p>
//                   <p className={cn("text-xs", isDark ? "text-white/45" : "text-gray-500")}>day streak</p>
//                 </div>
//               </div>
//               {/* Mini streak dots */}
//               <div className="flex gap-1.5">
//                 {Array.from({ length: 7 }).map((_, i) => (
//                   <div key={i} className={cn("flex-1 h-2 rounded-full transition-all",
//                     i < SAMPLE_STUDENT.streak
//                       ? "bg-[hsl(25,95%,55%)]"
//                       : isDark ? "bg-white/10" : "bg-black/8")} />
//                 ))}
//               </div>
//               <p className={cn("text-xs mt-2", isDark ? "text-white/40" : "text-gray-400")}>
//                 Quiz daily to extend your streak
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* ── RECENT QUIZ HISTORY ── */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
//         className={cn(card, "p-5")}>
//         <div className="flex items-center justify-between mb-5">
//           <div>
//             <h2 className="text-base font-bold">Recent Quizzes</h2>
//             <p className={cn("text-xs mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>Your last {SAMPLE_QUIZ_HISTORY.length} attempts</p>
//           </div>
//           <Link href="/student/progress/history" className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium flex items-center gap-1">
//             Full history <ChevronRight className="w-3 h-3" />
//           </Link>
//         </div>

//         <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
//           {SAMPLE_QUIZ_HISTORY.map((q, i) => (
//             <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.35 + i * 0.07 }}
//               whileHover={{ y: -3, scale: 1.015 }}
//               className={cn("p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
//                 isDark ? "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/14"
//                   : "bg-black/2 border-black/6 hover:bg-black/4")}>
//               {/* Score ring mini */}
//               <div className="flex items-center justify-between mb-3">
//                 <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold", diffBg[q.difficulty], diffColor[q.difficulty])}>
//                   {q.difficulty}
//                 </span>
//                 <span className={cn("text-xl font-black",
//                   q.score >= 90 ? "text-[hsl(142,76%,45%)]" : q.score >= 70 ? "text-[hsl(263,70%,58%)]" : "text-[hsl(45,95%,55%)]")}>
//                   {q.score}%
//                 </span>
//               </div>
//               <p className="text-sm font-semibold leading-snug mb-1">{q.quizTitle}</p>
//               <div className={cn("flex items-center gap-2 text-[11px]", isDark ? "text-white/40" : "text-gray-400")}>
//                 <BookMarked className="w-3 h-3" />
//                 <span>{q.topicName}</span>
//                 <span>·</span>
//                 <span>{formatDate(q.completedAt)}</span>
//               </div>
//               {/* Score bar */}
//               <div className={cn("mt-3 h-1 rounded-full overflow-hidden", isDark ? "bg-white/8" : "bg-black/8")}>
//                 <motion.div className="h-full rounded-full"
//                   initial={{ width: 0 }} animate={{ width: `${q.score}%` }}
//                   transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: "easeOut" }}
//                   style={{ background: q.score >= 90 ? "hsl(142,76%,45%)" : q.score >= 70 ? "hsl(263,70%,58%)" : "hsl(45,95%,55%)" }} />
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>

//       {/* ── AVAILABLE QUIZZES ── */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
//         className={cn(card, "p-5")}>
//         <div className="flex items-center justify-between mb-5">
//           <div>
//             <h2 className="text-base font-bold">Available Quizzes</h2>
//             <p className={cn("text-xs mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>Jump in anytime</p>
//           </div>
//           <Link href="/student/quizzes" className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium flex items-center gap-1">
//             Browse all <ChevronRight className="w-3 h-3" />
//           </Link>
//         </div>

//         <div className="grid sm:grid-cols-3 gap-3">
//           {SAMPLE_AVAILABLE_QUIZZES.map((q, i) => (
//             <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.42 + i * 0.07 }}
//               whileHover={{ y: -3, scale: 1.01 }}
//               className={cn("p-4 rounded-2xl border transition-all duration-200 group cursor-pointer",
//                 isDark ? "bg-white/3 border-white/8 hover:border-[hsl(263,70%,58%)]/30 hover:bg-[hsl(263,70%,58%)]/6"
//                   : "bg-black/2 border-black/6 hover:border-[hsl(263,70%,58%)]/25 hover:bg-[hsl(263,70%,58%)]/4")}>
//               <div className="flex items-center justify-between mb-3">
//                 <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold", diffBg[q.difficulty], diffColor[q.difficulty])}>
//                   {q.difficulty}
//                 </span>
//                 <div className="flex items-center gap-1 text-[hsl(263,70%,58%)]">
//                   <Star className="w-3.5 h-3.5 fill-current" />
//                   <span className="text-xs font-bold">{q.totalPoints}</span>
//                 </div>
//               </div>
//               <p className="text-sm font-semibold mb-1 leading-snug">{q.title}</p>
//               <p className={cn("text-xs mb-3", isDark ? "text-white/45" : "text-gray-500")}>{q.topicName}</p>
//               <div className={cn("flex items-center gap-3 text-[11px] mb-4", isDark ? "text-white/40" : "text-gray-400")}>
//                 <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{q.timeLimit}m</span>
//                 <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{q.questionCount} Qs</span>
//               </div>
//               <button className={cn(
//                 "w-full py-2 rounded-xl text-xs font-bold border transition-all duration-200",
//                 "text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/30 bg-[hsl(263,70%,58%)]/8",
//                 "hover:bg-[hsl(263,70%,58%)]/15 hover:border-[hsl(263,70%,58%)]/50 group-hover:shadow-[0_0_12px_-2px_hsl(263,70%,58%/0.2)]"
//               )}>
//                 Start Quiz
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    10. LAYOUT WRAPPER
//    ────────────────────────────────────────────────────────────────────────── */

// export function StudentLayout({ children }: { children: React.ReactNode }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { resolvedTheme } = useTheme();
//   const isDark = resolvedTheme === "dark";

//   useEffect(() => {
//     const saved = localStorage.getItem("student-sidebar-collapsed");
//     if (saved !== null) setCollapsed(saved === "true");
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("student-sidebar-collapsed", String(collapsed));
//   }, [collapsed]);

//   return (
//     <StudentSidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
//       <div className={cn("min-h-screen flex transition-colors duration-500",
//         isDark ? "bg-[hsl(260,50%,4%)] text-white" : "bg-[hsl(260,30%,98%)] text-[hsl(260,40%,10%)]")}>
//         <StudentSidebar />
//         <div className="flex-1 flex flex-col min-w-0">
//           <StudentTopbar />
//           <main className="flex-1 p-4 lg:p-6 overflow-auto">
//             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, ease: "easeOut" }}>
//               {children}
//             </motion.div>
//           </main>
//         </div>
//       </div>
//     </StudentSidebarContext.Provider>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    DEFAULT EXPORT: full demo
//    ────────────────────────────────────────────────────────────────────────── */

// export default function StudentDashboardPage({children} : {children: React.ReactNode}) {
//   return (
//     <StudentLayout>
//       {children}
//     </StudentLayout>
//   );
// }

