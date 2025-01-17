import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Zap, Users2, BarChart3, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className={`
        p-6 rounded-xl border
        ${theme === 'dark'
          ? 'bg-gray-800/80 hover:bg-gray-800 border-gray-700/50'
          : 'bg-white/90 hover:bg-white border-gray-200/50'
        }
        backdrop-blur-lg shadow-xl
        transition-all duration-200
      `}
    >
      <div className="flex items-center mb-4">
        <div className={`
          p-3 rounded-lg
          ${theme === 'dark' 
            ? 'bg-blue-500/10 text-blue-400' 
            : 'bg-blue-50 text-blue-500'
          }
        `}>
          {icon}
        </div>
        <h3 className={`
          ml-3 text-xl font-semibold
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          {title}
        </h3>
      </div>
      <p className={`
        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
        leading-relaxed
      `}>
        {description}
      </p>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Experience seamless real-time updates as team members participate in estimation sessions.",
      delay: 0.2
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: "Team Management",
      description: "Easily manage team roles with dedicated Scrum Master controls and participant views.",
      delay: 0.4
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Instant Visualization",
      description: "View estimation results in real-time with clear and intuitive data visualization.",
      delay: 0.6
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Easy Sharing",
      description: "Share session links instantly and get your team started with just one click.",
      delay: 0.8
    }
  ];

  return (
    <div className={`
      min-h-screen py-20
      ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'
      }
    `}>
      <div className="px-4 mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center mb-8"
          >
            <div className={`
              p-5 rounded-full
              ${theme === 'dark' 
                ? 'bg-gray-800 text-blue-400 shadow-blue-500/20' 
                : 'bg-white text-blue-500 shadow-blue-500/30'
              }
              shadow-lg backdrop-blur-sm
            `}>
              <Users className="w-16 h-16" />
            </div>
          </motion.div>
          <h1 className={`
            text-5xl sm:text-6xl font-bold mb-6
            ${theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }
          `}>
            Scrum Poker
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mb-8 max-w-2xl text-xl dark:text-gray-200"
          >
            Streamline your agile estimation process with our intuitive and collaborative
            planning poker tool. Make team planning sessions more efficient and engaging!
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/create"
              className={`
                inline-flex items-center px-8 py-4 rounded-full
                ${theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
                }
                text-lg font-semibold transition-all duration-200
                hover:scale-105 transform
                shadow-lg hover:shadow-xl
              `}
            >
              Start a New Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;