// frontend/app/page.tsx

"use client";

import { useState } from 'react';
import SelectionScreen from './components/SelectionScreen';
import InterviewScreen from './components/InterviewScreen';
import FeedbackScreen from './components/FeedbackScreen';

type GameState = 'selection' | 'interview' | 'feedback';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('selection');
  const [interviewDetails, setInterviewDetails] = useState<{role: string, level: string}>({ role: '', level: '' });
  const [feedback, setFeedback] = useState('');

  const handleStartInterview = (role: string, level: string) => {
    setInterviewDetails({ role, level });
    setGameState('interview');
  };

  const handleFinishInterview = (feedbackText: string) => {
    setFeedback(feedbackText);
    setGameState('feedback');
  };

  const handleRestart = () => {
    setFeedback('');
    setInterviewDetails({ role: '', level: '' });
    setGameState('selection');
  }

  const renderState = () => {
    switch (gameState) {
      case 'interview':
        return <InterviewScreen 
                  role={interviewDetails.role} 
                  level={interviewDetails.level} 
                  onFinish={handleFinishInterview} 
                />;
      case 'feedback':
        return <FeedbackScreen feedback={feedback} onRestart={handleRestart} />;
      case 'selection':
      default:
        return <SelectionScreen onStart={handleStartInterview} />;
    }
  }

  return (
    <main>
      {renderState()}
    </main>
  );
}