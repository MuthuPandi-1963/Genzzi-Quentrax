"use client";
import React, { useState } from 'react';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  BookOpen,
  Sparkles,
  Users,
  Award,
  Trophy,
  Clock,
  Shield,
  CreditCard,
  Globe,
} from 'lucide-react';
import Link from 'next/link';



const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// FAQ Category Type
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  name: string;
  icon: React.ElementType;
  color: string;
}

// FAQ Accordion Item Component
const FAQAccordion = ({ item, isOpen, onToggle, index }: { 
  item: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/30 transition-all duration-300"
    >
      <motion.button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-base md:text-lg font-medium text-foreground pr-4">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
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
            <div className="px-6 pb-4 pt-0">
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Category Filter Button
const CategoryButton = ({ 
  category, 
  isActive, 
  onClick, 
  icon: Icon 
}: { 
  category: string; 
  isActive: boolean; 
  onClick: () => void;
  icon: React.ElementType;
}) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive 
        ? "bg-linear-to-r from-primary to-accent text-white shadow-lg shadow-primary/25" 
        : "bg-muted text-muted-foreground hover:text-foreground border border-border"
    }`}
  >
    <Icon className="w-4 h-4" />
    {category}
  </motion.button>
);

// Help Card Component
const HelpCard = ({ title, description, icon: Icon, buttonText, link }: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  buttonText: string;
  link: string;
}) => (
  <motion.div
    // variants={fadeIn}
    whileHover={{ y: -5 }}
    className="bg-card rounded-2xl p-6 text-center border border-border hover:border-primary/30 transition-all duration-300"
  >
    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm mb-4">{description}</p>
    <Link href={link}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="text-primary font-medium text-sm hover:underline"
      >
        {buttonText} →
      </motion.button>
    </Link>
  </motion.div>
);

// Quick Stat Card
const QuickStat = ({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) => (
  <motion.div
    // variants={fadeIn}
    whileHover={{ scale: 1.05 }}
    className="text-center"
  >
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </motion.div>
);

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);

  const categories: FAQCategory[] = [
    { name: 'All', icon: HelpCircle, color: 'primary' },
    { name: 'Getting Started', icon: Sparkles, color: 'indigo' },
    { name: 'Account & Billing', icon: CreditCard, color: 'green' },
    { name: 'Quizzes & Assessments', icon: Award, color: 'purple' },
    { name: 'Community', icon: Users, color: 'blue' },
    { name: 'Technical', icon: Shield, color: 'orange' },
  ];

  const faqItems: FAQItem[] = [
    // Getting Started
    {
      id: 1,
      question: "What is Quentrax?",
      answer: "Quentrax is a comprehensive assessment platform that allows users to create, take, and manage quizzes. It's designed for educators, businesses, and individuals who want to evaluate knowledge effectively with detailed analytics and reporting.",
      category: "Getting Started"
    },
    {
      id: 2,
      question: "How do I create an account?",
      answer: "Click the 'Get Started' button in the top right corner of the homepage. You can sign up using your email address or through Google/GitHub OAuth. The process takes less than 2 minutes and is completely free for the basic plan.",
      category: "Getting Started"
    },
    {
      id: 3,
      question: "Is Quentrax free to use?",
      answer: "Yes! Quentrax offers a free tier that includes basic quiz creation, up to 5 quizzes, and essential analytics. We also have Pro and Enterprise plans with advanced features like AI-generated questions, unlimited quizzes, and team collaboration.",
      category: "Getting Started"
    },
    {
      id: 4,
      question: "Can I use Quentrax for my classroom?",
      answer: "Absolutely! Many teachers and professors use Quentrax to create engaging assessments for their students. Our platform includes features like class management, assignment tracking, and detailed performance reports for each student.",
      category: "Getting Started"
    },

    // Account & Billing
    {
      id: 5,
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. Enter your registered email address, and we'll send you a password reset link. Click the link in the email and follow the instructions to create a new password.",
      category: "Account & Billing"
    },
    {
      id: 6,
      question: "How can I upgrade my plan?",
      answer: "Navigate to Settings → Billing from your dashboard. You'll see all available plans with their features. Select the plan you want, enter your payment details, and your account will be upgraded immediately.",
      category: "Account & Billing"
    },
    {
      id: 7,
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from the Billing section in Settings. Your Pro features will remain active until the end of your current billing period, after which your account will revert to the Free plan.",
      category: "Account & Billing"
    },
    {
      id: 8,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for Enterprise plans, we also accept bank transfers and purchase orders.",
      category: "Account & Billing"
    },

    // Quizzes & Assessments
    {
      id: 9,
      question: "What types of questions can I create?",
      answer: "Quentrax supports multiple question types including multiple choice, true/false, fill in the blanks, matching, ordering, essay questions, and file uploads. You can also add images, videos, and code snippets to your questions.",
      category: "Quizzes & Assessments"
    },
    {
      id: 10,
      question: "Can I set time limits for quizzes?",
      answer: "Yes! When creating a quiz, you can set a global time limit for the entire quiz or individual time limits per question. You can also enable auto-submit when time expires.",
      category: "Quizzes & Assessments"
    },
    {
      id: 11,
      question: "How do I share a quiz with others?",
      answer: "Once your quiz is created, click the 'Share' button to get a unique link. You can share this link via email, social media, or embed it on your website. You can also generate QR codes for easy access.",
      category: "Quizzes & Assessments"
    },
    {
      id: 12,
      question: "Can I track quiz results?",
      answer: "Absolutely! Quentrax provides detailed analytics including individual scores, question-by-question performance, average time spent, completion rates, and progress tracking over time. You can export all data as CSV or PDF.",
      category: "Quizzes & Assessments"
    },

    // Community
    {
      id: 13,
      question: "How do leaderboards work?",
      answer: "Leaderboards rank users based on their quiz performance. Points are awarded based on accuracy, speed, and difficulty. You can filter by global, category, or friend leaderboards. Top performers earn badges and recognition.",
      category: "Community"
    },
    {
      id: 14,
      question: "Can I create study groups?",
      answer: "Yes! You can create or join study groups from the Community section. Groups allow members to share quizzes, compete in group challenges, and discuss topics in dedicated forums.",
      category: "Community"
    },
    {
      id: 15,
      question: "How do I earn badges?",
      answer: "Badges are awarded for various achievements like completing a certain number of quizzes, scoring perfectly, maintaining streaks, helping others, and participating in community events. Check your profile to see available badges.",
      category: "Community"
    },

    // Technical
    {
      id: 16,
      question: "Is Quentrax mobile-friendly?",
      answer: "Yes! Quentrax is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktops. We also offer a dedicated mobile app for iOS and Android for an optimized experience.",
      category: "Technical"
    },
    {
      id: 17,
      question: "How secure is my data?",
      answer: "We take security seriously. All data is encrypted in transit using SSL/TLS and at rest using AES-256 encryption. We comply with GDPR and CCPA regulations, and we never share your personal data with third parties.",
      category: "Technical"
    },
    {
      id: 18,
      question: "Can I integrate Quentrax with other tools?",
      answer: "Yes, Quentrax offers API access for Enterprise plans. We also have native integrations with popular platforms like Google Classroom, Canvas, Moodle, Slack, and Microsoft Teams.",
      category: "Technical"
    },
    {
      id: 19,
      question: "What browsers are supported?",
      answer: "Quentrax supports all modern browsers including the latest versions of Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest version for the best experience.",
      category: "Technical"
    },
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const quickStats = [
    { value: "24/7", label: "Support", icon: Clock },
    { value: "99.9%", label: "Uptime", icon: Shield },
    { value: "1M+", label: "Quizzes Taken", icon: Trophy },
    { value: "150+", label: "Countries", icon: Globe },
  ];

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/5 pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground"
          >
            How Can We{' '}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Help You?
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Find answers to common questions about Quentrax
          </motion.p>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {quickStats.map((stat, index) => (
              <QuickStat key={index} value={stat.value} label={stat.label} icon={stat.icon} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {categories.map((cat) => (
              <CategoryButton
                key={cat.name}
                category={cat.name}
                isActive={activeCategory === cat.name}
                onClick={() => setActiveCategory(cat.name)}
                icon={cat.icon}
              />
            ))}
          </motion.div>

          {/* FAQ List */}
          {filteredFAQs.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredFAQs.map((item, index) => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openItems.includes(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No results found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or browse by category
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-linear-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Still Need Help?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Reach out to our support team
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto"
          >
            <HelpCard
              title="Contact Support"
              description="Get help from our friendly support team"
              icon={MessageCircle}
              buttonText="Submit a Ticket"
              link="/contact"
            />
            <HelpCard
              title="Email Us"
              description="Send us an email and we'll respond within 24h"
              icon={Mail}
              buttonText="support@quentrax.com"
              link="mailto:support@quentrax.com"
            />
            <HelpCard
              title="Documentation"
              description="Read our detailed guides and tutorials"
              icon={BookOpen}
              buttonText="Browse Docs"
              link="/docs"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mt-3 text-white/90">
              Join thousands of users who trust Quentrax for their assessment needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 px-8 py-3 rounded-xl bg-white text-primary font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Create Free Account
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}