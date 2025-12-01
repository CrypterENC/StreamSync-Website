'use client';

import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [serverCount, setServerCount] = useState(0);
  const [songsPlayed, setSongsPlayed] = useState(0);
  const [version, setVersion] = useState('v1.0.0');
  const [versionStatus, setVersionStatus] = useState<'live' | 'beta' | 'development'>('live');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch version data
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/version');
        if (response.ok) {
          const data = await response.json();
          if (data.version) {
            setVersion(data.version.version);
            setVersionStatus(data.version.status);
          }
        }
      } catch (error) {
        console.error('Failed to fetch version:', error);
        // Keep fallback version
      }
    };

    fetchVersion();
  }, []);

  useEffect(() => {
    const fetchServerCount = async (attempt = 1) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('/api/analytics', {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate and set the response data
        setServerCount(typeof data.serverCount === 'number' && data.serverCount >= 0 ? data.serverCount : 0);
        setSongsPlayed(typeof data.songsPlayed === 'number' && data.songsPlayed >= 0 ? data.songsPlayed : 0);

        setIsLoading(false);
        setRetryCount(0); // Reset retry count on success

      } catch (error) {
        console.error(`Failed to fetch server count (attempt ${attempt}):`, error);

        setIsLoading(false);

        // Handle different error types with proper type checking
        const errorObj = error as any; // Type assertion for error handling
        const errorMessage = errorObj?.message || 'Unknown error';

        if (errorObj?.name === 'AbortError') {
          setError('Request timed out. Using cached data.');
          setServerCount(0); // Fallback to 0
          setSongsPlayed(0);
        } else if (errorMessage.includes('Failed to fetch')) {
          setError('Network error. Please check your connection.');
          setServerCount(0);
          setSongsPlayed(0);
        } else if (errorMessage.includes('HTTP')) {
          setError('Server error. Analytics temporarily unavailable.');
          setServerCount(0);
          setSongsPlayed(0);
        } else {
          setError('Unable to load server statistics.');
          setServerCount(0);
          setSongsPlayed(0);
        }

        // Retry logic - up to 3 attempts with exponential backoff
        if (attempt < 3) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`Retrying server count fetch in ${delay}ms...`);
          setTimeout(() => {
            setRetryCount(attempt);
            fetchServerCount(attempt + 1);
          }, delay);
        }
      }
    };

    fetchServerCount();
  }, []);
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8"
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              versionStatus === 'live' ? 'bg-green-400' : 
              versionStatus === 'beta' ? 'bg-yellow-400' : 
              'bg-orange-400'
            }`} />
            <span className="text-sm text-gray-300">
              {versionStatus === 'live' ? 'Now Live' : 
               versionStatus === 'beta' ? 'Beta Testing' : 
               'In Development'} • StreamSync {version}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            StreamSync
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Music Bot
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Premium Discord music bot with crystal-clear audio and advanced playlist management.
            Built on Discord.js, Lavalink, and cutting-edge metadata extraction libraries.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1437365534831153226&permissions=281475013487632&integration_type=0&scope=applications.commands+bot"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                Add to Discord
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <button 
              onClick={() => {
                const commandsSection = document.getElementById('commands');
                if (commandsSection) {
                  commandsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
            >
              <Play className="w-5 h-5" />
              View Commands
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                &lt;500ms
              </div>
              <p className="text-xs text-gray-400 mt-1">Ultra-Low Latency</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                99.9%
              </div>
              <p className="text-xs text-gray-400 mt-1">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-pink-400/30 border-t-pink-400 rounded-full animate-spin"></div>
                    <span className="text-sm">Loading...</span>
                  </>
                ) : error ? (
                  <span className="text-sm text-gray-500">N/A</span>
                ) : (
                  serverCount.toLocaleString()
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {isLoading ? 'Loading servers...' : error ? 'Servers (offline)' : 'Servers'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                    <span className="text-sm">Loading...</span>
                  </>
                ) : error ? (
                  <span className="text-sm text-gray-500">N/A</span>
                ) : (
                  songsPlayed.toLocaleString()
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {isLoading ? 'Loading songs...' : error ? 'Songs (offline)' : 'Songs Played'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => {
          const featuresSection = document.getElementById('features');
          if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 hover:border-white/50 transition-colors">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.button>
    </section>
  );
}
