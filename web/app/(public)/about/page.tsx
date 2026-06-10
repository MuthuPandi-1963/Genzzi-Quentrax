"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Award, Activity, Trophy, Star, Sparkles, Quote, Target, Heart, Zap } from 'lucide-react';
import Image from 'next/image';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

// Team Member Card Component
const TeamCard = ({ name, role, avatarColor, index }: { name: string; role: string; avatarColor: string; index: number }) => (
  <motion.div
    variants={fadeIn}
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="bg-card rounded-2xl shadow-lg p-6 text-center border border-border/50 hover:border-primary/30 transition-all duration-300"
  >
    <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold ${avatarColor} shadow-lg ring-4 ring-primary/10`}>
      {name.charAt(0)}
    </div>
    <h3 className="mt-4 text-lg font-semibold text-foreground">{name}</h3>
    <p className="text-sm text-muted-foreground">{role}</p>
  </motion.div>
);

// Value Card Component
const ValueCard = ({ icon: Icon, title, description, delay }: { icon: React.ElementType; title: string; description: string; delay: number }) => (
  <motion.div
    variants={fadeIn}
    custom={delay}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-card rounded-2xl shadow-lg p-6 text-center border border-border/50 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mx-auto">
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

// Stat Counter Component
const StatCard = ({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) => (
  <motion.div
    variants={fadeIn}
    whileHover={{ scale: 1.05 }}
    className="text-center"
  >
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
      <Icon className="h-6 w-6" />
    </div>
    <div className="text-3xl md:text-4xl font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </motion.div>
);

export default function AboutUsPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  const teamMembers = [
    { name: 'Alice Johnson', role: 'Founder & CEO', avatarColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
    { name: 'Brian Smith', role: 'Lead Developer', avatarColor: 'bg-gradient-to-br from-green-500 to-emerald-600' },
    { name: 'Carla Ruiz', role: 'UX Designer', avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600' },
    { name: 'David Kim', role: 'Marketing Head', avatarColor: 'bg-gradient-to-br from-rose-500 to-pink-600' },
  ];

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest quality in every quiz and learning tool we create.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive, engaging community of learners is at our core.'
    },
    {
      icon: Activity,
      title: 'Growth',
      description: 'We empower learners to track their progress and achieve personal growth.'
    },
    {
      icon: Trophy,
      title: 'Achievement',
      description: 'Rewarding effort and progress motivates our users to aim higher every day.'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '10K+', label: 'Quizzes Created', icon: Award },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
    { value: '24/7', label: 'Support', icon: Heart },
  ];

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          style={{ opacity, scale }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Who We Are
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground"
          >
            About{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quentrax
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Our mission is to make assessment creation engaging, intelligent, and enterprise-ready. 
            From smart quizzes to performance tracking, Quentrax is designed to help teams evaluate with confidence.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} icon={stat.icon} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              Our Core Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Drives Us
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Quentrax
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            // variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Our Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Story
            </h2>
            
            <div className="mt-8 space-y-6 text-left">
              <motion.div
                variants={fadeIn}
                className="relative bg-card rounded-2xl p-8 shadow-lg border border-border/50"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Quentrax started with a simple idea: evaluation should be exciting, intelligent, and measurable. 
                  We combine assessment workflows, performance analytics, and candidate insights to help organizations 
                  achieve better outcomes.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                className="relative bg-card rounded-2xl p-8 shadow-lg border border-border/50"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From our humble beginnings to a thriving platform with thousands of active users, we continue to 
                  innovate and expand the way people learn. Our team is dedicated to creating an experience that 
                  makes learning not just effective, but truly enjoyable.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              The People Behind Quentrax
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet Our Team
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A passionate team committed to transforming learning into an engaging and rewarding experience.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {teamMembers.map((member, index) => (
              <TeamCard
                key={index}
                name={member.name}
                role={member.role}
                avatarColor={member.avatarColor}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-white/90 text-lg">
              Join thousands of learners and creators who trust Quentrax for their assessment needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 px-8 py-3 rounded-xl bg-white text-primary font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}