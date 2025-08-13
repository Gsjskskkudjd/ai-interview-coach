// frontend/app/components/SelectionScreen.tsx

"use client";

import { useState } from 'react';

interface SelectionScreenProps {
  onStart: (role: string, level: string) => void;
}

export default function SelectionScreen({ onStart }: SelectionScreenProps) {
  const [role, setRole] = useState('Software Engineer');
  const [level, setLevel] = useState('Entry-Level');

  const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX/UI Designer'];
  const levels = ['Entry-Level', 'Mid-Level', 'Senior'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grid-gray-700/[0.2] p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12 shadow-2xl shadow-indigo-900/20 max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          AI Interview Coach
        </h1>
        <p className="text-lg text-gray-400 mb-8 text-center">
          Prepare to ace your next interview. Let's get started.
        </p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Interview Role</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-gray-700"
            >
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-1">Difficulty Level</label>
            <select 
              id="level" 
              value={level} 
              onChange={(e) => setLevel(e.target.value)} 
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-gray-700"
            >
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <button 
            onClick={() => onStart(role, level)} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-indigo-500/30"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}