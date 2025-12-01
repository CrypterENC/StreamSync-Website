'use client';

import { useState } from 'react';
import { Music, Users, Zap, Shield, Headphones, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

// Toggle for showing the creator's message from environment variable
const SHOW_CREATOR_MESSAGE = process.env.NEXT_PUBLIC_SHOW_CREATOR_MESSAGE === 'true';

const features = [
  {
    icon: Music,
    title: 'Crystal Clear Audio',
    description: 'Opus codec at 10/10 quality with ultra-low 400ms latency. HIGH quality resampling for pristine audio playback.',
  },
  {
    icon: Users,
    title: 'Smart Playlist Management',
    description: 'Create up to 4 playlists per user with descriptions. Add/remove songs, shuffle play, and queue entire playlists.',
  },
  {
    icon: Shield,
    title: 'Rich Metadata Extraction',
    description: 'Complete YouTube information including title, artist, duration, views, likes, and high-quality thumbnails.',
  },
  {
    icon: Zap,
    title: 'Cloud Backup & Sync',
    description: 'Auto-sync with NeonDB PostgreSQL. Survives local data loss with persistent cloud storage and manual backup/restore.',
  },
  {
    icon: BarChart3,
    title: 'Multi-Source Support',
    description: 'Stream from YouTube, SoundCloud, Bandcamp, Vimeo, and HTTP sources. Reliable dual metadata libraries with automatic fallback.',
  },
  {
    icon: Headphones,
    title: 'Audio Enhancements',
    description: 'Bass boost filters, volume normalization, treble enhancement, and equalizer presets for optimal listening experience.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Powerful Features
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              for Music Lovers
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Experience premium music playback with advanced features designed for Discord communities.
          </p>
        </motion.div>

        {/* Creator's Message - Toggle Based */}
        {SHOW_CREATOR_MESSAGE && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative mb-16 sm:mb-20"
          >
            <div className="relative bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 sm:p-12 overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-purple-300 font-semibold text-sm uppercase tracking-wider">From The Creator</span>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                </div>
                
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                    <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      I Built StreamSync
                    </span>
                    <span className="block text-white text-2xl sm:text-3xl lg:text-4xl mt-2">
                      With One Goal
                    </span>
                  </h2>
                  
                  <div className="text-xl text-gray-300 leading-relaxed mb-8 space-y-4">
                    <p>
                      Premium audio quality for everyone.
                    </p>
                    <p className="text-lg text-gray-400">
                      No paywalls, no restrictions, just crystal-clear music.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wider">Limited Time Offer</span>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                    <p className="text-white text-lg mb-2">
                      Get Premium Features <span className="text-yellow-400 font-bold">100% FREE</span> - Forever!
                    </p>
                    <p className="text-gray-300 text-sm">
                      Premium services coming soon at the lowest prices in the market. 
                      Early users like you get lifetime access to all current features - completely free.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-purple-300 font-medium">Opus Codec 10/10 Quality</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-purple-300 font-medium">400ms Ultra-Low Latency</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-purple-300 font-medium">Lifetime Access</span>
                    </div>
                  </div>
                  
                  <div className="text-lg border-t border-white/10 pt-6">
                    <span className="text-gray-400">- Nittin Mathew, Developer</span>
                    <div className="mt-2 text-sm text-gray-500">
                      Trusted by <span className="text-white font-semibold">4+ servers</span> • 
                      <span className="text-white font-semibold mx-1">450+ users</span> • 
                      <span className="text-purple-400 font-semibold mx-1">100% Free Forever</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-50 pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <div id="features-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Border gradient on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 sm:mt-20"
        >
          <p className="text-gray-400 mb-6">Ready to experience crystal-clear music?</p>
          <a 
            href="https://discord.com/oauth2/authorize?client_id=1437365534831153226&permissions=281475013487632&integration_type=0&scope=applications.commands+bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Add to Discord
          </a>
        </motion.div>
      </div>
    </section>
  );
}
