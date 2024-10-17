import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
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
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors"
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