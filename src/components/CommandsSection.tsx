'use client';

import { useState } from 'react';
import { Music, ListMusic, Server, Zap, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const commandCategories = [
  {
    id: 'music',
    label: 'Music Commands',
    icon: Music,
    commands: [
      { cmd: '/play <query>', desc: 'Play music from YouTube (song name or URL)' },
      { cmd: '/player', desc: 'Open the interactive music player interface' },
      { cmd: '/disconnect', desc: 'Disconnect the bot from voice channel' },
      { cmd: '/help', desc: 'Show all available commands and features' },
    ],
  },
  {
    id: 'playlist',
    label: 'Playlist Commands',
    icon: ListMusic,
    commands: [
      { cmd: '/create-playlist <name> [description]', desc: 'Create a new personal playlist' },
      { cmd: '/playlist', desc: 'View and manage your personal playlists' },
    ],
  },
  {
    id: 'player',
    label: 'Player Interface Controls',
    icon: Zap,
    commands: [
      { cmd: 'Play/Pause Button', desc: 'Control music playback' },
      { cmd: 'Next/Previous Buttons', desc: 'Navigate between tracks' },
      { cmd: 'Loop Button', desc: 'Toggle loop mode (Off/Track/Queue)' },
      { cmd: 'Save Button', desc: 'Save current track to playlist' },
      { cmd: 'Stop Button', desc: 'Stop playback and disconnect' },
    ],
  },
];

export default function CommandsSection() {
  const [activeTab, setActiveTab] = useState('music');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const activeCategory = commandCategories.find(cat => cat.id === activeTab);

  return (
    <section id="commands" className="relative py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20 px-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Bot Commands
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
            Powerful commands designed for an intuitive music experience in your Discord server.
          </p>
        </motion.div>

        {/* Commands Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-8 lg:p-12 overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            {commandCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`relative px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm ${
                    activeTab === category.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={16} className="sm:w-5 sm:h-5" />
                  <span className="font-medium hidden sm:inline">{category.label}</span>
                  {activeTab === category.id && (
                    <div className="absolute inset-0 rounded-lg bg-cyan-500/10 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Commands List */}
          {activeCategory && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {activeCategory.commands.map((command, index) => (
                <motion.div
                  key={command.cmd}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative bg-black/30 border border-white/10 rounded-xl p-3 sm:p-6 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-xl p-0.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 animate-pulse">
                      <div className="w-full h-full bg-black/30 rounded-lg" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                          <Zap className="text-cyan-400 flex-shrink-0" size={14} />
                          <code className="text-cyan-300 font-mono text-xs sm:text-lg bg-cyan-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded break-all">
                            {command.cmd}
                          </code>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
                          {command.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(command.cmd)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 sm:p-2 rounded-lg hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 flex-shrink-0"
                        title="Copy command"
                      >
                        <Copy size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Copy feedback */}
                  {copiedCmd === command.cmd && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-2 right-2 bg-cyan-500 text-black px-2 py-1 rounded text-sm font-medium z-20"
                    >
                      Copied!
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-white/10 text-center"
          >
            <p className="text-gray-400 mb-4">
              Need more help? Use <code className="text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded">/help</code> in Discord for detailed instructions
            </p>
            <p className="text-gray-500 text-sm">
              The player interface appears automatically when music starts playing!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
