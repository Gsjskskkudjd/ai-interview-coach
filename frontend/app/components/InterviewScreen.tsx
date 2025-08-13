// frontend/app/components/InterviewScreen.tsx

"use client";

import { useState, useEffect, useRef } from 'react';

interface InterviewScreenProps {
  role: string;
  level: string;
  onFinish: (feedback: string) => void;
}

interface TranscriptMessage {
  role: 'user' | 'model';
  parts: string[];
}

export default function InterviewScreen({ role, level, onFinish }: InterviewScreenProps) {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [status, setStatus] = useState('Initializing...');
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    setStatus('Speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
        setStatus('Listening...');
        try {
          recognitionRef.current?.start();
        } catch (error) {
          console.error("Speech recognition error:", error);
          setStatus('Error starting mic.');
        }
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleUserAnswer = async (userAnswer: string) => {
    setStatus('Thinking...');
    const currentUserTurn: TranscriptMessage = { role: 'user', parts: [userAnswer] };
    const newTranscript = [...transcript, currentUserTurn];
    setTranscript(newTranscript);

    const res = await fetch('http://localhost:8000/submit_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: newTranscript, role, level }), // ✅ Send role and level
    });
    const data = await res.json();
    setTranscript(data.transcript);
    speak(data.transcript[data.transcript.length - 1].parts[0]);
  };

  const handleEndInterview = async () => {
    setStatus('Generating Feedback...');
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    const res = await fetch('http://localhost:8000/end_interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, role, level }), // ✅ Send role and level
    });
    const data = await res.json();
    onFinish(data.feedback);
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: any) => {
        const userAnswer = event.results[0][0].transcript;
        handleUserAnswer(userAnswer);
      };
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setStatus("Mic error.");
      };
    }

    const startInterview = async () => {
      setStatus('Connecting...');
      try {
        const res = await fetch('http://localhost:8000/start_interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, level }),
        });
        const data = await res.json(); // ✅ Receives { message: "..." }
        const firstAiMessage: TranscriptMessage = { role: 'model', parts: [data.message] };
        setTranscript([firstAiMessage]); // ✅ Sets the first message
        speak(data.message);
      } catch (error) {
        console.error("Failed to start interview:", error);
        setStatus("Error: Backend connection failed.");
      }
    };

    startInterview();
  }, [role, level]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white p-4 gap-4">
      {/* AI Avatar Section */}
      <div className="md:w-1/3 flex flex-col items-center justify-center p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          <img 
            src={status === 'Speaking' ? "/avatar-talking.gif" : "/avatar-listening.gif"} 
            alt="AI Avatar" 
            className="w-full h-full rounded-full" 
          />
          <div className={`absolute inset-0 rounded-full border-4 ${status === 'Listening...' ? 'border-green-500 animate-pulse' : 'border-indigo-500'}`}></div>
        </div>
        <h2 className="text-2xl font-bold mt-6">AI Interviewer</h2>
        <p className="text-indigo-400 text-lg font-medium h-8 mt-1">{status}</p>
      </div>

      {/* Transcript and Controls Section */}
      <div className="md:w-2/3 flex flex-col p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
        <div className="flex-grow overflow-y-auto mb-4 pr-4 space-y-4">
          {transcript.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}>
              <div className={`px-4 py-3 rounded-2xl max-w-xl ${
                msg.role === 'model' 
                ? 'bg-indigo-950 text-left' 
                : 'bg-gray-700 text-left'
              }`}>
                <p className="text-white leading-relaxed">{msg.parts[0]}</p>
              </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
        <div className="flex items-center justify-center mt-4">
          <button onClick={handleEndInterview} disabled={status === 'Thinking...' || status === 'Generating Feedback...'} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}