import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex flex-col items-center justify-center text-white`}>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
      <div className="max-w-4xl text-center">
        <div className="flex items-center justify-center mb-8">
          <Users className="w-16 h-16 mr-4" />
          <h1 className="text-5xl font-bold">Scrum Poker</h1>
        </div>
        <p className="text-xl mb-8">
          Streamline your agile estimation process with our intuitive and collaborative Scrum Poker tool. Make team planning sessions more efficient and engaging!
        </p>
        <div className="space-y-4">
          <Link
            to="/create"
            className={`inline-flex items-center ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-100'} px-6 py-3 rounded-full text-lg font-semibold transition-colors`}
          >
            Start a New Session
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Real-time collaboration</li>
          <li>Customizable story point values</li>
          <li>Instant result visualization</li>
          <li>Easy session sharing</li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;