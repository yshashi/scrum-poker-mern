import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { History, Star, Shield, Zap } from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix';
    description: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.1.0',
    date: '17-11-2024',
    changes: [
      {
        type: 'improvement',
        description: 'Updated the Room creation flow with better UI and animations'
      },
      {
        type: 'improvement',
        description: 'Updated UserList component with better UI and animations'
      },
      {
        type: 'feature',
        description: 'Added room link sharing functionality with copy to clipboard feature'
      },
      {
        type: 'feature',
        description: 'Implemented visual feedback for link copying with animated check/share icons'
      },
      {
        type: 'improvement',
        description: 'Enhanced card animations with improved visibility and transitions'
      },
      {
        type: 'improvement',
        description: 'Added explicit opacity and y-position handling in animations'
      },
      {
        type: 'improvement',
        description: 'Updated UserList component with better icons and animations'
      },
      {
        type: 'improvement',
        description: 'Enhanced Results section with better UI and animations'
      },
      {
        type: 'improvement',
        description: 'Added frosted glass effect and modern UI elements'
      },
      {
        type: 'fix',
        description: 'Fixed card selection visibility issues'
      },
      {
        type: 'fix',
        description: 'Prevented re-estimation after estimates are revealed'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '15-10-2024',
    changes: [
      {
        type: 'feature',
        description: 'Initial release of Scrum Poker application'
      },
      {
        type: 'feature',
        description: 'Real-time collaborative planning poker estimation'
      },
      {
        type: 'feature',
        description: 'Dark/Light theme support'
      },
      {
        type: 'feature',
        description: 'Scrum Master role management'
      },
      {
        type: 'feature',
        description: 'Real-time user presence and estimation status'
      }
    ]
  }
];

const Changelog: React.FC = () => {
  const { theme } = useTheme();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'feature':
        return <Star className="w-4 h-4" />;
      case 'improvement':
        return <Zap className="w-4 h-4" />;
      case 'fix':
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getColorForType = (type: string) => {
    const isDark = theme === 'dark';
    switch (type) {
      case 'feature':
        return isDark ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-50';
      case 'improvement':
        return isDark ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-50';
      case 'fix':
        return isDark ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50';
      default:
        return '';
    }
  };

  return (
    <div className="px-4 py-12 min-h-screen sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <div className="flex gap-3 items-center mb-8">
          <History className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Changelog
          </h1>
        </div>

        <div className="space-y-12">
          {changelog.map((entry, entryIndex) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: entryIndex * 0.1 }}
              className={`
                ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}
                p-6 rounded-xl shadow-lg backdrop-blur-sm
                border border-gray-200/10
              `}
            >
              <div className="flex flex-wrap gap-3 items-center mb-6">
                <h2 className="text-2xl font-semibold">v{entry.version}</h2>
                <span className={`
                  px-3 py-1 rounded-full text-sm
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
                `}>
                  {entry.date}
                </span>
              </div>

              <div className="space-y-4">
                {entry.changes.map((change, changeIndex) => (
                  <motion.div
                    key={changeIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (entryIndex * 0.1) + (changeIndex * 0.05) }}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg
                      ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'}
                      transition-colors duration-200
                    `}
                  >
                    <span className={`
                      p-2 rounded-lg
                      ${getColorForType(change.type)}
                    `}>
                      {getIconForType(change.type)}
                    </span>
                    <div>
                      <span className={`
                        text-xs font-medium px-2 py-1 rounded-full
                        ${getColorForType(change.type)}
                      `}>
                        {change.type}
                      </span>
                      <p className={`
                        mt-2
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                      `}>
                        {change.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Changelog;
