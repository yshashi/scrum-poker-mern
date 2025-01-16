import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { History, Star, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChangelogProps {
  previousRoom?: string;
  username?: string;
  isScrumMaster?: boolean;
  users?: unknown[];
}

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
    version: '1.2.0',
    date: '16-01-2025',
    changes: [
      {
        type: 'improvement',
        description: 'Enhanced header design with better spacing and animations'
      },
      {
        type: 'improvement',
        description: 'Made room ID in header clickable for easy room navigation'
      },
      {
        type: 'improvement',
        description: 'Added hover effects and transitions to header elements'
      },
      {
        type: 'improvement',
        description: 'Improved mobile responsiveness in header'
      }
    ]
  },
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

const Changelog: React.FC<ChangelogProps> = ({ previousRoom, username, isScrumMaster, users }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // If we have previous session data, store it in localStorage
    if (previousRoom && username && isScrumMaster !== undefined && users) {
      localStorage.setItem('previousRoom', previousRoom);
      localStorage.setItem('previousUsername', username);
      localStorage.setItem('previousIsScrumMaster', String(isScrumMaster));
      localStorage.setItem('previousUsers', JSON.stringify(users));
    }
  }, [previousRoom, username, isScrumMaster, users]);

  const handleBackToRoom = () => {
    const room = previousRoom || localStorage.getItem('previousRoom');
    if (room) {
      navigate(`/room/${room}`);
    } else {
      navigate('/');
    }
  };

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
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="mx-auto max-w-4xl">
        {previousRoom && (
          <motion.button
            onClick={handleBackToRoom}
            className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-white hover:bg-gray-100 text-gray-700'
            } transition-colors duration-200 shadow-sm`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Room
          </motion.button>
        )}
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
      </div>
    </div>
  );
};

export default Changelog;
