import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-1 text-sm">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by</span>
            <span className="font-semibold text-indigo-400">Team Quantanova</span>
            <span>|</span>
            <span>CivicTech Hackathon 2025</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 UrbanEye. Making cities better, one report at a time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;