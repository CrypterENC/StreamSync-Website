'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function Changelog() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <section id="changelog" className="py-16 sm:py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="space-y-8">
          {changelog.map((entry, index) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-lg p-6 border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Version {entry.version}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(entry.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  entry.status === 'released'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {entry.status}
                </span>
              </div>

              <h4 className="text-lg font-semibold text-white mb-2">
                {entry.title}
              </h4>

              {entry.description && (
                <p className="text-gray-300 mb-4">
                  {entry.description}
                </p>
              )}

              {entry.changes && entry.changes.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Changes
                  </h5>
                  <ul className="space-y-2">
                    {entry.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-start gap-3">
                        <span className="text-lg mt-1">
                          {getChangeIcon(change.type)}
                        </span>
                        <span className={`text-sm ${getChangeColor(change.type)}`}>
                          {change.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}

          {changelog.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <p className="text-gray-400">No changelog entries found.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
