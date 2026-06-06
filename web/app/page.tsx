"use client";

import React, { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   QUIZ APP — COMPLETE UI SAMPLE PAGE
   This file demonstrates every component, color, animation,
   and design token from the theme system.
   ═══════════════════════════════════════════════════════════════ */

export default function QuizAppDemo() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timerWidth, setTimerWidth] = useState(100);
  const [score, setScore] = useState(2450);
  const [streak, setStreak] = useState(12);
  const [isCorrect, setIsCorrect] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
    const interval = setInterval(() => {
      setTimerWidth((w) => {
        if (w <= 0) {
          clearInterval(interval);
          return 0;
        }
        return w - 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    setIsCorrect(index === 1);
    if (index === 1) {
      setScore((s) => s + 150);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const options = [
    "The Pacific Ocean",
    "The Atlantic Ocean",
    "The Indian Ocean",
    "The Arctic Ocean",
  ];

  return (
    <div className="min-h-screen w-full p-4 pb-20">
      {/* ═══════════════════════════════════════════════════════════
          1. LOGIN SCREEN (Glass Card + Gradient Button + Input)
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-8 text-center">
          {/* Logo */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 19h20L12 2zm0 3.5L17.5 17h-11L12 5.5z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Hey, Welcome back!</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Please enter your phone number in order to continue.
          </p>

          {/* Glass Input */}
          <div className="glass-input mb-4 flex items-center gap-3">
            <span className="text-lg">🇳🇱</span>
            <span className="text-sm text-white/60">+31</span>
            <input
              type="tel"
              defaultValue="970 1051 7493"
              className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm"
            />
          </div>

          {/* Gradient Primary Button */}
          <button className="gradient-primary w-full h-14 text-base mb-4">
            Login
          </button>

          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span className="text-gradient font-semibold cursor-pointer hover:opacity-80 transition-opacity">
              Sign up for free
            </span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. DASHBOARD / PROFILE CARD (Stats + Feature Card)
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 delay-100 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-6 glow-primary">
          {/* Header Stats */}
          <div className="flex justify-between mb-6 text-center">
            {[
              { label: "Credit", value: "38.2 $" },
              { label: "Points", value: score.toLocaleString() },
              { label: "Current Rank", value: "237" },
            ].map((stat, i) => (
              <div key={i} className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Feature Card with Image Overlay */}
          <div className="relative overflow-hidden rounded-3xl aspect-[4/5] mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/30" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white font-semibold text-lg">Tonight Show, 20 UTC</p>
              <p className="text-white/60 text-sm">Hosted by Alana</p>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="streak-badge">
              🔥 {streak}x Streak
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold bg-[hsl(var(--multiplier)/0.15)] text-[hsl(var(--multiplier))] border border-[hsl(var(--multiplier)/0.3)]">
              ⚡ 2x Multiplier
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. QUIZ QUESTION SCREEN (Timer + Options + States)
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 delay-200 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-6">
          {/* Category & Difficulty */}
          <div className="flex items-center justify-between mb-4">
            <span className="badge-geography rounded-full px-3 py-1 text-xs font-medium">
              🌍 Geography
            </span>
            <span className="text-xs font-medium difficulty-medium">
              ● Medium
            </span>
          </div>

          {/* Timer */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Time Remaining</span>
              <span className={timerWidth < 30 ? "text-[hsl(var(--timer-critical))] font-bold" : ""}>
                {Math.ceil(timerWidth / 10)}s
              </span>
            </div>
            <div className="timer-bar">
              <div
                className={`timer-bar-fill ${timerWidth < 30 ? "critical" : ""}`}
                style={{ width: `${timerWidth}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
            Which ocean is the largest by surface area on Earth?
          </h2>

          {/* Score Display */}
          <div className="flex items-center justify-center mb-6">
            <span className="score-counter">{score.toLocaleString()}</span>
            <span className="text-muted-foreground text-sm ml-2">pts</span>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 stagger-children">
            {options.map((option, index) => {
              let optionClass = "quiz-option";
              if (showResult) {
                if (index === 1) optionClass += " quiz-option-correct";
                else if (index === selectedOption && index !== 1) optionClass += " quiz-option-wrong";
                else optionClass += " opacity-50";
              } else if (selectedOption === index) {
                optionClass += " quiz-option-selected";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={optionClass}
                  disabled={showResult}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white/80 border border-white/10">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm font-medium text-white">{option}</span>
                  {showResult && index === 1 && (
                    <span className="ml-auto text-[hsl(var(--success))] text-lg">✓</span>
                  )}
                  {showResult && index === selectedOption && index !== 1 && (
                    <span className="ml-auto text-[hsl(var(--error))] text-lg">✕</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className={`mt-6 rounded-2xl p-4 text-center animate-bounce-in ${isCorrect ? 'bg-[hsl(var(--success)/0.15)] border border-[hsl(var(--success)/0.3)]' : 'bg-[hsl(var(--error)/0.15)] border border-[hsl(var(--error)/0.3)]'}`}>
              <p className={`text-lg font-bold ${isCorrect ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--error))]'}`}>
                {isCorrect ? "🎉 Correct! +150 pts" : "❌ Wrong! The answer is A. Pacific Ocean"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. LEADERBOARD / RANKINGS (Podium + List)
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white text-center mb-8">Rankings</h2>

          {/* Podium */}
          <div className="flex items-end justify-center gap-3 mb-8 h-44">
            {/* 2nd Place */}
            <div className="flex flex-col items-center gap-2 animate-fade-in-up stagger-2">
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 p-0.5">
                  <div className="h-full w-full rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                    X28
                  </div>
                </div>
                <div className="rank-badge-silver absolute -bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 text-xs flex items-center justify-center rounded-full font-bold">
                  2
                </div>
              </div>
              <div className="podium-silver w-20 h-24 rounded-t-2xl flex flex-col items-center justify-end pb-3">
                <p className="text-xs font-bold text-amber-950">Xian28</p>
                <p className="text-[10px] opacity-80 text-amber-950">2,812 pts</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center gap-2 -mt-4 animate-fade-in-up stagger-1">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 p-0.5 shadow-[0_0_30px_-5px_hsl(var(--gold)/0.5)]">
                  <div className="h-full w-full rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold">
                    Eliz
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-2xl">
                  🏆
                </div>
              </div>
              <div className="podium-gold w-24 h-32 rounded-t-2xl flex flex-col items-center justify-end pb-3">
                <p className="text-sm font-bold text-amber-950">Eliz</p>
                <p className="text-xs opacity-90 text-amber-950">3,458 pts</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center gap-2 animate-fade-in-up stagger-3">
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 p-0.5">
                  <div className="h-full w-full rounded-full bg-orange-800 flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                </div>
                <div className="rank-badge-bronze absolute -bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 text-xs flex items-center justify-center rounded-full font-bold">
                  3
                </div>
              </div>
              <div className="podium-bronze w-20 h-20 rounded-t-2xl flex flex-col items-center justify-end pb-3">
                <p className="text-xs font-bold text-orange-950">Mobi</p>
                <p className="text-[10px] opacity-80 text-orange-950">2,605 pts</p>
              </div>
            </div>
          </div>

          {/* Rank List */}
          <div className="space-y-3">
            {[
              { rank: 4, name: "Kathryn Murphy", pts: 2603, avatar: "KM" },
              { rank: 5, name: "Albert Flores", pts: 2450, avatar: "AF" },
              { rank: 6, name: "Arlene McCoy", pts: 2226, avatar: "AM" },
              { rank: 7, name: "Darlene Robertson", pts: 2100, avatar: "DR" },
              { rank: 8, name: "Jacob Jones", pts: 1985, avatar: "JJ" },
            ].map((user, i) => (
              <div
                key={user.rank}
                className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 border border-white/5 hover:bg-white/[0.08] transition-colors animate-fade-in-up"
                style={{ animationDelay: `${(i + 4) * 100}ms` }}
              >
                <span className="text-sm text-muted-foreground w-6 font-mono">
                  {user.rank}
                </span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-bold text-white/80 border border-white/10">
                  {user.avatar}
                </div>
                <span className="flex-1 text-sm text-white font-medium">{user.name}</span>
                <span className="text-sm text-muted-foreground font-mono">{user.pts.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. CATEGORY SELECTION (Badges + Cards)
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 delay-400 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-2">Choose Category</h2>
          <p className="text-sm text-muted-foreground mb-6">Select a topic to test your knowledge</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Science", badge: "badge-science", icon: "🔬", count: 124 },
              { name: "History", badge: "badge-history", icon: "📜", count: 98 },
              { name: "Sports", badge: "badge-sports", icon: "⚽", count: 76 },
              { name: "Arts", badge: "badge-arts", icon: "🎨", count: 54 },
              { name: "Tech", badge: "badge-tech", icon: "💻", count: 112 },
              { name: "Geography", badge: "badge-geography", icon: "🌍", count: 87 },
            ].map((cat, i) => (
              <button
                key={cat.name}
                className={`glass-card-sm p-4 text-left hover:scale-[1.02] transition-all duration-300 animate-fade-in-scale`}
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <p className="text-sm font-semibold text-white">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} questions</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. PROGRESS & STATS (XP Ring + Bars + Skeleton)
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 delay-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Your Progress</h2>

          {/* XP Ring */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative h-32 w-32">
              <svg className="progress-ring h-full w-full" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(263, 70%, 58%)" />
                    <stop offset="100%" stopColor="hsl(330, 80%, 60%)" />
                  </linearGradient>
                </defs>
                <circle
                  className="progress-ring-track"
                  cx="60"
                  cy="60"
                  r="52"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  className="progress-ring-fill"
                  cx="60"
                  cy="60"
                  r="52"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="327"
                  strokeDashoffset="82"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gradient">75%</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Level 12</span>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4 mb-6">
            {[
              { label: "Science", pct: 85, color: "hsl(var(--category-science))" },
              { label: "History", pct: 62, color: "hsl(var(--category-history))" },
              { label: "Sports", pct: 45, color: "hsl(var(--category-sports))" },
              { label: "Tech", pct: 91, color: "hsl(var(--category-tech))" },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/80">{bar.label}</span>
                  <span className="text-muted-foreground">{bar.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[hsl(var(--background-sunken))] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: pageLoaded ? `${bar.pct}%` : "0%",
                      backgroundColor: bar.color,
                      boxShadow: `0 0 12px ${bar.color}50`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Loading Demo */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Loading State</p>
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-3/4" />
            <div className="skeleton h-12 w-5/6" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. NOTIFICATION / TOAST (Success + Error + Warning)
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 delay-600 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>

          <div className="space-y-3">
            {/* Success Toast */}
            <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--success)/0.15)] border border-[hsl(var(--success)/0.3)] px-4 py-3 animate-fade-in-right">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--success)/0.3)] text-[hsl(var(--success))]">
                ✓
              </div>
              <div>
                <p className="text-sm font-medium text-white">Achievement Unlocked!</p>
                <p className="text-xs text-muted-foreground">You answered 50 questions correctly</p>
              </div>
            </div>

            {/* Warning Toast */}
            <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--warning)/0.15)] border border-[hsl(var(--warning)/0.3)] px-4 py-3 animate-fade-in-right stagger-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--warning)/0.3)] text-[hsl(var(--warning))]">
                ⚠
              </div>
              <div>
                <p className="text-sm font-medium text-white">Time Running Low</p>
                <p className="text-xs text-muted-foreground">Only 10 seconds remaining</p>
              </div>
            </div>

            {/* Error Toast */}
            <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--error)/0.15)] border border-[hsl(var(--error)/0.3)] px-4 py-3 animate-fade-in-right stagger-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--error)/0.3)] text-[hsl(var(--error))]">
                ✕
              </div>
              <div>
                <p className="text-sm font-medium text-white">Connection Lost</p>
                <p className="text-xs text-muted-foreground">Reconnecting in 3 seconds...</p>
              </div>
            </div>

            {/* Info Toast */}
            <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--info)/0.15)] border border-[hsl(var(--info)/0.3)] px-4 py-3 animate-fade-in-right stagger-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--info)/0.3)] text-[hsl(var(--info))]">
                ℹ
              </div>
              <div>
                <p className="text-sm font-medium text-white">Daily Challenge Available</p>
                <p className="text-xs text-muted-foreground">New questions are ready for you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. DIFFICULTY SELECTOR + ACTION BUTTONS
          ═══════════════════════════════════════════════════════════ */}
      <section className={`mx-auto max-w-sm mb-16 transition-all duration-700 delay-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Difficulty</h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="rounded-2xl border border-[hsl(var(--difficulty-easy)/0.3)] bg-[hsl(var(--difficulty-easy)/0.15)] px-4 py-3 text-sm font-semibold text-[hsl(var(--difficulty-easy))] hover:bg-[hsl(var(--difficulty-easy)/0.25)] transition-colors">
              🌱 Easy
            </button>
            <button className="rounded-2xl border border-[hsl(var(--difficulty-medium)/0.3)] bg-[hsl(var(--difficulty-medium)/0.15)] px-4 py-3 text-sm font-semibold text-[hsl(var(--difficulty-medium))] hover:bg-[hsl(var(--difficulty-medium)/0.25)] transition-colors">
              🔥 Medium
            </button>
            <button className="rounded-2xl border border-[hsl(var(--difficulty-hard)/0.3)] bg-[hsl(var(--difficulty-hard)/0.15)] px-4 py-3 text-sm font-semibold text-[hsl(var(--difficulty-hard))] hover:bg-[hsl(var(--difficulty-hard)/0.25)] transition-colors">
              ⚡ Hard
            </button>
            <button className="rounded-2xl border border-[hsl(var(--difficulty-expert)/0.3)] bg-[hsl(var(--difficulty-expert)/0.15)] px-4 py-3 text-sm font-semibold text-[hsl(var(--difficulty-expert))] hover:bg-[hsl(var(--difficulty-expert)/0.25)] transition-colors">
              👑 Expert
            </button>
          </div>

          <div className="space-y-3">
            <button className="gradient-success w-full h-14 text-base">
              ✓ Confirm Answer
            </button>
            <button className="gradient-danger w-full h-14 text-base">
              ✕ End Quiz
            </button>
            <button className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors">
              💡 Use Hint (-50 pts)
            </button>
            <button className="w-full h-14 rounded-2xl border border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.1)] text-[hsl(var(--info))] font-semibold hover:bg-[hsl(var(--info)/0.2)] transition-colors">
              🔄 Skip Question
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. FLOATING DECORATIVE PARTICLES
          ═══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="particle h-64 w-64 top-[-10%] left-[-10%] animate-float" />
        <div className="particle h-48 w-48 bottom-[20%] right-[-5%] animate-float" style={{ animationDelay: "2s" }} />
        <div className="particle h-32 w-32 top-[40%] left-[60%] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* SVG Gradients for Progress Ring */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(263, 70%, 58%)" />
            <stop offset="100%" stopColor="hsl(330, 80%, 60%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}