"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, MapPin, Phone, Send, MessageCircle, Clock,
  Globe, CheckCircle2, Sparkles, ArrowRight, User,
  AtSign, FileText, HelpCircle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  CONTACT ITEMS
// ═══════════════════════════════════════════════════════════════
const contactItems = [
  {
    icon: Mail,
    title: "Email",
    value: "support@genzzi.in",
    description: "We reply within 24 hours",
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary)]/10",
    border: "border-[var(--color-primary)]/20",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri, 9am - 6pm IST",
    color: "text-[var(--color-success)]",
    bg: "bg-[var(--color-success)]/10",
    border: "border-[var(--color-success)]/20",
  },
  {
    icon: MapPin,
    title: "Campus",
    value: "Learning Center, Block A",
    description: "Bangalore, India",
    color: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-accent)]/10",
    border: "border-[var(--color-accent)]/20",
  },
];

const socialLinks = [
  { label: "Twitter", handle: "@genzzi" },
  { label: "GitHub", handle: "@genzzi" },
  { label: "LinkedIn", handle: "Genzzi Technologies" },
  { label: "Discord", handle: "genzzi.community" },
];

// ═══════════════════════════════════════════════════════════════
//  CONTACT CARD
// ═══════════════════════════════════════════════════════════════
function ContactCard({ item, index }: { item: typeof contactItems[0]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-card p-6 group cursor-default"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${item.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--color-foreground-muted)] uppercase tracking-wider mb-1">
            {item.title}
          </p>
          <p className="text-base font-semibold text-[var(--color-foreground)] mb-1 truncate">
            {item.value}
          </p>
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN CONTACT PAGE
// ═══════════════════════════════════════════════════════════════
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 5000);
  };

  const inputClasses =
    "glass-input w-full pl-10 pr-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)]/20";

  return (
    <div className="min-h-screen pb-20">
      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-purple opacity-40" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold mb-6">
              <MessageCircle className="w-3.5 h-3.5" />
              GET IN TOUCH
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--color-foreground)] mb-4 leading-tight">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-[var(--color-foreground-muted)] text-base md:text-lg">
              Have questions about quizzes or assessments? Reach out to our team.
              We're here to help you quiz the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTACT CARDS ══════════════════════════════════ */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {contactItems.map((item, i) => (
            <ContactCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ═══ MAIN CONTENT GRID ════════════════════════════════ */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* ─── Form Column ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card-lg p-6 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-5 h-5 text-[var(--color-primary)]" />
                  <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                    Send a message
                  </h2>
                </div>
                <p className="text-sm text-[var(--color-foreground-muted)] mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-1.5">
                      Subject
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-1.5">
                      Message
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-[var(--color-foreground-subtle)]" />
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your question or feedback..."
                        className={`${inputClasses} pl-10 resize-none`}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all duration-300 ${
                      isSubmitted
                        ? "bg-[var(--color-success)] text-white"
                        : "gradient-primary"
                    } ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Message sent! We'll get back to you soon.
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* ─── Sidebar Column ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick Links */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-[var(--color-foreground)] uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Browse FAQs", href: "/faq", icon: HelpCircle },
                  { label: "Documentation", href: "/docs", icon: FileText },
                  { label: "Status Page", href: "/status", icon: Clock },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors group"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Response Time */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-success)]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--color-success)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-foreground)]">
                    Fast Response
                  </h3>
                  <p className="text-xs text-[var(--color-foreground-muted)]">
                    Average response time
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[var(--color-success)]">
                  &lt; 24
                </span>
                <span className="text-sm text-[var(--color-foreground-muted)]">
                  hours
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-[var(--color-background-sunken)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary)] rounded-full"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-[var(--color-foreground)] uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <div key={social.label} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-foreground-muted)]">{social.label}</span>
                    <span className="font-medium text-[var(--color-foreground)]">{social.handle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Badge */}
            <div className="glass-card p-6 text-center">
              <Globe className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
              <p className="text-sm font-bold text-[var(--color-foreground)] mb-1">
                Global Support
              </p>
              <p className="text-xs text-[var(--color-foreground-muted)]">
                Serving learners in 50+ countries
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}