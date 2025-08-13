// frontend/app/components/FeedbackScreen.tsx

"use client";

import ReactMarkdown from 'react-markdown';

interface FeedbackScreenProps {
  feedback: string;
  onRestart: () => void;
}

export default function FeedbackScreen({ feedback, onRestart }: FeedbackScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12 shadow-2xl w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-400">Interview Report</h1>
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={onRestart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Try Another Interview
          </button>
        </div>
      </div>
    </div>
  );
}