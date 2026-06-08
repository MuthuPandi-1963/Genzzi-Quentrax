"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import SiteLogo from "../SiteLogo";

interface FooterProps {
  isDark: boolean;
}

export default function Footer({ isDark }: FooterProps) {
  return (
    <footer className={`border-t ${isDark ? "border-white/10" : "border-black/5"} py-16 px-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <SiteLogo variantIndex={0} className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-gradient">Quentrax</span>
            </div>
            <p className={`text-sm mb-4 ${isDark ? "text-white/50" : "text-gray-500"}`}>
              The next-generation quiz & assessment platform powered by Genzzi.
            </p>
            <div className={`flex items-center gap-2 text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
              <Shield className="w-3 h-3" />
              Secured by Genzzi v2.1
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              {["Quizzes", "Assessments", "Leaderboard", "Categories", "Pricing"].map((item) => (
                <li key={item}>
                  <motion.a
                    href={`/${item.toLowerCase()}`}
                    className={`text-sm transition-colors ${
                      isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-800"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "API Reference", "Blog", "Community", "Support"].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className={`text-sm transition-colors ${
                      isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-800"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className={`text-sm transition-colors ${
                      isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-800"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`pt-8 border-t ${isDark ? "border-white/10" : "border-black/5"} flex flex-col md:flex-row items-center justify-between gap-4`}
        >
          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
            © 2026 Quentrax. All rights reserved. Secured by Genzzi Identity Protocol.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "GitHub", "Discord"].map((social) => (
              <motion.a
                key={social}
                href="#"
                className={`text-xs transition-colors ${
                  isDark ? "text-white/30 hover:text-white" : "text-gray-400 hover:text-gray-700"
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}