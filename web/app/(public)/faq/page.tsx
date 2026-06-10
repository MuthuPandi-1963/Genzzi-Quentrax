"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, HelpCircle, MessageCircle, Mail, Phone,
  MapPin, Search, Sparkles, BookOpen, Shield, Coins,
  Lock, Zap, Send, CheckCircle2,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  FAQ CATEGORIES
// ═══════════════════════════════════════════════════════════════
const faqCategories = [
  { id: "getting-started", label: "Getting Started", icon: Sparkles, color: "text-[var(--color-primary)]", bg: "bg-[var(--color-primary)]/10", border: "border-[var(--color-primary)]/20" },
  { id: "quizzes", label: "Quizzes", icon: BookOpen, color: "text-[var(--color-category-science)]", bg: "bg-[hsl(190_90%_50%_/_0.1)]", border: "border-[hsl(190_90%_50%_/_0.2)]" },
  { id: "assessments", label: "Assessments", icon: Shield, color: "text-[var(--color-category-tech)]", bg: "bg-[hsl(263_70%_58%_/_0.1)]", border: "border-[hsl(263_70%_58%_/_0.2)]" },
  { id: "coins", label: "Coins & Rewards", icon: Coins, color: "text-[var(--color-gold)]", bg: "bg-[hsl(45_95%_55%_/_0.1)]", border: "border-[hsl(45_95%_55%_/_0.2)]" },
  { id: "account", label: "Account & Security", icon: Lock, color: "text-[var(--color-success)]", bg: "bg-[hsl(142_76%_45%_/_0.1)]", border: "border-[hsl(142_76%_45%_/_0.2)]" },
  { id: "technical", label: "Technical", icon: Zap, color: "text-[var(--color-accent)]", bg: "bg-[hsl(330_80%_60%_/_0.1)]", border: "border-[hsl(330_80%_60%_/_0.2)]" },
];

// ═══════════════════════════════════════════════════════════════
//  FAQ ITEMS
// ═══════════════════════════════════════════════════════════════
const faqItems = [
  // Getting Started
  { category: "getting-started", question: "What is Quentrax?", answer: "Quentrax is a next-generation quiz and assessment platform powered by Genzzi Technologies. It offers gamified learning, live proctored assessments, leaderboards, and a coin-based reward system — all secured by decentralized identity." },
  { category: "getting-started", question: "How do I create an account?", answer: "Click 'Get Started' on the homepage or navigate to /register. You'll need to provide your name, email, and password. After registration, verify your email to unlock full platform access. Quentrax also supports Genzzi Identity for passwordless login." },
  { category: "getting-started", question: "Is Quentrax free to use?", answer: "Yes! Quentrax is completely free for learners. All public quizzes, leaderboards, and basic assessments are available at no cost. Premium features for institutions and advanced analytics may require a subscription." },
  { category: "getting-started", question: "What devices can I use?", answer: "Quentrax works on any modern device with a web browser — desktops, laptops, tablets, and smartphones. For proctored assessments, we recommend using a desktop or laptop with a stable internet connection." },

  // Quizzes
  { category: "quizzes", question: "How do I start a quiz?", answer: "Browse quizzes by category or topic, then click 'Start Quiz'. You'll be taken to the quiz interface with a timer, question navigator, and progress tracker. Your answers are auto-saved every 30 seconds." },
  { category: "quizzes", question: "What happens if I run out of time?", answer: "If the timer reaches zero before you submit, your quiz will be auto-submitted with whatever answers you've provided. Make sure to pace yourself and use the question navigator to track your progress." },
  { category: "quizzes", question: "Can I retake a quiz?", answer: "Yes! Most quizzes allow unlimited retakes. Each attempt is tracked separately in your quiz history. Some assessment-style quizzes may have attempt limits set by the creator." },
  { category: "quizzes", question: "How is my score calculated?", answer: "Your score is based on correct answers multiplied by question points. Some quizzes include partial credit for multi-select questions. Bonus coins are awarded for streaks, speed, and perfect scores." },

  // Assessments
  { category: "assessments", question: "What is a proctored assessment?", answer: "Proctored assessments are supervised exams with anti-cheat measures including tab-switch detection, copy-paste blocking, right-click disabling, and fullscreen enforcement. Violations are logged and may affect your score." },
  { category: "assessments", question: "What happens if I switch tabs during an assessment?", answer: "Tab switching is detected and counted as a violation. After exceeding the maximum allowed violations (usually 3), your assessment may be automatically submitted or flagged for review by the instructor." },
  { category: "assessments", question: "Can I review my answers after submission?", answer: "This depends on the assessment settings. If 'allowReview' is enabled by the creator, you can view your answers, correct solutions, and explanations after submission. Otherwise, only your final score will be shown." },
  { category: "assessments", question: "How many attempts do I get?", answer: "Attempt limits are set by the assessment creator (typically 1-3). Check the assessment details before starting. If 'allowRetry' is enabled and you haven't exceeded maxAttempts, you can retake the assessment." },

  // Coins
  { category: "coins", question: "How do I earn coins?", answer: "You earn coins by completing quizzes, scoring 100%, maintaining daily streaks, climbing leaderboards, and participating in special events. Coins can be used to unlock badges, themes, and premium content." },
  { category: "coins", question: "What can I spend coins on?", answer: "Spend coins in the Quentrax shop to unlock exclusive badges, dark themes, avatar frames, and power-ups like extra time or hint reveals. New items are added regularly." },
  { category: "coins", question: "Do coins expire?", answer: "No, coins never expire. Your balance persists across sessions and devices. You can view your full coin transaction history in your Wallet page." },
  { category: "coins", question: "What are streaks?", answer: "A streak is consecutive days of quiz activity. Longer streaks earn multiplier bonuses on coin rewards. Lose your streak if you miss a day — but streak freeze power-ups are available in the shop!" },

  // Account
  { category: "account", question: "How does Genzzi Identity work?", answer: "Genzzi is a decentralized identity protocol. Instead of passwords, your identity is verified cryptographically. We never store your passwords or private keys. One Genzzi account works across all ecosystem apps." },
  { category: "account", question: "How do I enable 2FA / MFA?", answer: "Go to Profile → Security → Enable MFA. You'll scan a QR code with an authenticator app (Google Authenticator, Authy) and enter a 6-digit code to confirm. Backup codes are provided — store them safely." },
  { category: "account", question: "Can I make my profile private?", answer: "Yes! In Settings → Privacy, you can toggle 'Make profile private' and 'Hide from leaderboard'. When enabled, your name appears as 'Anonymous' on public leaderboards and your profile is hidden from other users." },
  { category: "account", question: "How do I delete my account?", answer: "Go to Settings → Danger Zone → Delete Account. This performs a soft delete — your data is retained for 30 days in case you change your mind. After 30 days, all personal data is permanently purged." },

  // Technical
  { category: "technical", question: "What browsers are supported?", answer: "Quentrax supports Chrome, Firefox, Safari, and Edge (latest 2 versions). For the best experience, we recommend Chrome or Firefox. Internet Explorer is not supported." },
  { category: "technical", question: "My quiz won't load. What should I do?", answer: "Try refreshing the page, clearing your browser cache, or disabling extensions that might interfere (ad blockers, VPNs). If the issue persists, check our status page or contact support." },
  { category: "technical", question: "Is my data encrypted?", answer: "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256-GCM). Quiz answers are encrypted server-side. With Genzzi Identity, even we can't read your authentication secrets." },
  { category: "technical", question: "How do I report a bug?", answer: "Use the contact form below or email support@genzzi.in. Include your browser version, device type, and steps to reproduce. Screenshots and screen recordings are greatly appreciated!" },
];

const contactItems = [
  { icon: Mail, title: "Email", value: "support@genzzi.in" },
  { icon: Phone, title: "Phone", value: "+1 (555) 123-4567" },
  { icon: MapPin, title: "Campus", value: "Learning Center, Block A" },
];

// ═══════════════════════════════════════════════════════════════
//  ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ═══════════════════════════════════════════════════════════════
//  FAQ ACCORDION ITEM
// ═══════════════════════════════════════════════════════════════
function FaqAccordionItem({ question, answer, isOpen, onToggle, index }: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void; index: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? "border-[var(--color-primary)]/30 shadow-lg shadow-[var(--color-primary)]/5" : ""}`}
    >
      <motion.button onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left group" whileTap={{ scale: 0.995 }}>
        <span className={`font-semibold text-sm md:text-base pr-4 transition-colors duration-200 ${isOpen ? "text-[var(--color-primary)]" : "text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]"}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${isOpen ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "bg-[var(--color-muted)] text-[var(--color-foreground-muted)] group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)]"}`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-0">
              <div className="h-px w-full bg-[var(--color-border)]/50 mb-4" />
              <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CATEGORY TAB
// ═══════════════════════════════════════════════════════════════
function CategoryTab({ category, isActive, onClick }: {
  category: typeof faqCategories[0]; isActive: boolean; onClick: () => void;
}) {
  const Icon = category.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive ? `${category.bg} ${category.color} ${category.border} border` : "bg-[var(--color-muted)] text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)]"}`}
    >
      <Icon className="w-4 h-4" />
      {category.label}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONTACT CARD
// ═══════════════════════════════════════════════════════════════
function ContactCard({ icon: Icon, title, value, index }: {
  icon: typeof Mail; title: string; value: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass-card p-5 flex items-center gap-4"
    >
      <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[var(--color-primary)]" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-foreground-muted)] uppercase tracking-wider">{title}</p>
        <p className="text-sm font-semibold text-[var(--color-foreground)]">{value}</p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN FAQ PAGE
// ═══════════════════════════════════════════════════════════════
export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    newOpen.has(id) ? newOpen.delete(id) : newOpen.add(id);
    setOpenItems(newOpen);
  };

  const filteredFaqs = faqItems.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = !searchQuery || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setIsSubmitted(true);
      setTimeout(() => { setIsSubmitted(false); setContactForm({ name: "", email: "", message: "" }); }, 4000);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-purple opacity-40" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold mb-6">
              <HelpCircle className="w-3.5 h-3.5" />
              HELP CENTER
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--color-foreground)] mb-4 leading-tight">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-[var(--color-foreground-muted)] text-base md:text-lg">
              Everything you need to know about Quentrax. Can't find your answer? Reach out to our team below.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foreground-subtle)]" />
              <input type="text" placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="glass-input pl-12 pr-4 py-3.5 w-full text-base" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CATEGORY TABS ══════════════════════════════════ */}
      <section className="container mx-auto px-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex flex-wrap justify-center gap-2">
          <motion.button onClick={() => setActiveCategory("all")} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === "all" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20" : "bg-[var(--color-muted)] text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)]"}`}>
            <MessageCircle className="w-4 h-4" />
            All Questions
          </motion.button>
          {faqCategories.map((cat) => (
            <CategoryTab key={cat.id} category={cat} isActive={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)} />
          ))}
        </motion.div>
      </section>

      {/* ═══ FAQ ACCORDION ═════════════════════════════════ */}
      <section className="container mx-auto px-4 max-w-3xl mb-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
          <AnimatePresence mode="wait">
            {filteredFaqs.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[var(--color-muted)] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-[var(--color-foreground-subtle)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">No results found</h3>
                <p className="text-sm text-[var(--color-foreground-muted)]">Try a different search term or browse by category.</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, i) => (
                <FaqAccordionItem key={`${faq.category}-${i}`} question={faq.question} answer={faq.answer} isOpen={openItems.has(`${faq.category}-${i}`)} onToggle={() => toggleItem(`${faq.category}-${i}`)} index={i} />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ═══ CONTACT SECTION ════════════════════════════════ */}
      <section className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] mb-2">
            Still have <span className="text-gradient">questions?</span>
          </h2>
          <p className="text-[var(--color-foreground-muted)]">Our team is here to help. We'll get back to you within 24 hours.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {contactItems.map((item, i) => (
            <ContactCard key={item.title} {...item} index={i} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl mx-auto">
          <div className="glass-card-lg p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="text-lg font-bold text-[var(--color-foreground)]">Send us a message</h3>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-1.5">Name</label>
                    <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your name" className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-1.5">Email</label>
                    <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="you@example.com" className="glass-input w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-1.5">Message</label>
                  <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can we help you?" className="glass-input w-full resize-none" />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full gradient-primary px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2">
                  {isSubmitted ? <><CheckCircle2 className="w-4 h-4" /> Message sent! We'll get back to you soon.</> : <><Send className="w-4 h-4" /> Submit</>}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}