'use client';

import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';


const socialLinks = [
  { icon: Github, href: '#github', label: 'GitHub' },
  { icon: Twitter, href: '#twitter', label: 'Twitter' },
  { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
  { icon: Mail, href: '#email', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Single Centered Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Logo and Brand */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <img 
                src="/bot_pfp.ico" 
                alt="StreamSync Logo" 
                className="w-12 h-12 rounded-lg"
              />
              <span className="text-white font-bold text-3xl">StreamSync</span>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8 text-sm sm:text-base">
              Experience synchronized music streaming with your Discord community. Control playback, manage queues, and enjoy seamless audio together.
            </p>

            {/* Social Links - Hidden for future use */}
            {/* 
            <div className="flex items-center justify-center gap-4 mb-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
            */}

            {/* Copyright */}
            <p className="text-gray-500 text-sm border-t border-white/10 pt-6">
              &copy; 2025 StreamSync. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
