'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface ChangelogEntry {
  version: string;
  title: string;
  description: string;
  changes: Array<{
    type: 'added' | 'removed' | 'updated' | 'fixed';
    description: string;
  }>;
  releaseDate: string;
  status: string;
}

interface ChangelogCardProps {
  entry: ChangelogEntry;
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
  onClose: () => void;
  expandedRef: React.RefObject<HTMLDivElement | null>;
  getChangeIcon: (type: string) => string;
  getChangeColor: (type: string) => string;
}

const ChangelogCard: React.FC<ChangelogCardProps> = ({
  entry,
  index,
  isExpanded,
  onExpand,
  onClose,
  expandedRef,
  getChangeIcon,
  getChangeColor,
}) => {
  return (
    // Collapsed card view only
    <motion.div
      className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-full overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onExpand}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 20px 40px -10px rgba(6, 182, 212, 0.3)',
        transition: { duration: 0.3 },
      }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        animate={{
          opacity: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          className="flex items-start justify-between mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white">
            Version {entry.version}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              entry.status === 'development'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {entry.status}
          </span>
        </motion.div>

        <motion.p
          className="text-gray-400 text-sm mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {new Date(entry.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </motion.p>

        <motion.p
          className="text-gray-300 text-base line-clamp-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {entry.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function Changelog() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const expandedRef = useRef<HTMLDivElement | null>(null);
  
  useOutsideClick(expandedRef as React.RefObject<HTMLDivElement>, () => setExpandedIndex(null));

  // Lock body scroll when modal is open - prevent any scrolling
  useEffect(() => {
    if (expandedIndex !== null) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.top = 'auto';
      window.scrollTo(0, scrollY);
    }
  }, [expandedIndex]);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('/api/changelog', {
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
        setChangelog(data.changelog || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch changelog:', error);
        setIsLoading(false);
        setError('Failed to load changelog');
      }
    };

    fetchChangelog();
  }, []);

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return '✨';
      case 'removed': return '🗑️';
      case 'updated': return '📝';
      case 'fixed': return '🔧';
      default: return '📌';
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-400';
      case 'removed': return 'text-red-400';
      case 'updated': return 'text-blue-400';
      case 'fixed': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <section id="changelog" className="py-16 sm:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Changelog
            </h2>
            <p className="text-gray-400 mb-8">
              Latest updates and improvements
            </p>
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-400">Loading changelog...</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="changelog" className="py-16 sm:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Changelog
            </h2>
            <p className="text-gray-400 mb-8">
              Latest updates and improvements
            </p>
            <div className="text-center">
              <span className="text-red-400">❌ {error}</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="changelog" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Changelog
          </h2>
          <p className="text-gray-400">
            Latest updates and improvements to StreamSync
          </p>
        </motion.div>

        {/* Changelog Container */}
        <div className="relative py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {changelog.map((entry, index) => (
              <ChangelogCard
                key={entry.version}
                entry={entry}
                index={index}
                isExpanded={expandedIndex === index}
                onExpand={() => setExpandedIndex(index)}
                onClose={() => setExpandedIndex(null)}
                expandedRef={expandedRef}
                getChangeIcon={getChangeIcon}
                getChangeColor={getChangeColor}
              />
            ))}

            {changelog.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center py-12 col-span-full"
              >
                <p className="text-gray-400">No changelog entries found.</p>
              </motion.div>
            )}
          </div>

          {/* Expanded Modal - Fixed positioning */}
          <AnimatePresence>
            {expandedIndex !== null && changelog[expandedIndex] && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setExpandedIndex(null)}
              >
                <motion.div
                  className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
                  }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <motion.button
                    onClick={() => setExpandedIndex(null)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl" />

                  {/* Content */}
                  <motion.div
                    className="relative z-10 max-h-[calc(90vh-120px)] overflow-y-auto pr-4"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-white mb-2">
                        Version {changelog[expandedIndex].version}
                      </h3>
                      <div className="flex items-center gap-3">
                        <p className="text-gray-400 text-base">
                          {new Date(changelog[expandedIndex].releaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            changelog[expandedIndex].status === 'released'
                              ? 'bg-green-500/20 text-green-400'
                              : changelog[expandedIndex].status === 'live'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {changelog[expandedIndex].status}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-2xl font-semibold text-white mb-4">
                      {changelog[expandedIndex].title}
                    </h4>

                    {changelog[expandedIndex].description && (
                      <p className="text-gray-300 mb-6 text-base leading-relaxed">
                        {changelog[expandedIndex].description}
                      </p>
                    )}

                    {changelog[expandedIndex].changes && changelog[expandedIndex].changes.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="text-lg font-semibold text-white uppercase tracking-wide">
                          All Changes ({changelog[expandedIndex].changes.length})
                        </h5>
                        <ul
                          className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden scrollbar-hide"
                          style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                          }}
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                        >
                          {changelog[expandedIndex].changes.map((change, changeIndex) => (
                            <li
                              key={changeIndex}
                              className="flex items-start gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <span className="text-2xl mt-1 flex-shrink-0">
                                {getChangeIcon(change.type)}
                              </span>
                              <span className={`text-base ${getChangeColor(change.type)}`}>
                                {change.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer section */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
                      <p className="text-sm text-gray-400">
                        Experience synchronized music streaming with your Discord community. Control playback, manage queues, and enjoy seamless audio together.
                      </p>
                      <p className="text-xs text-gray-500">
                        © 2025 StreamSync. All rights reserved.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
