import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startVoiceInteraction, respondToVoice } from '../services/api';

export default function VoiceCallSimulator() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);

    const startInteractionMutation = useMutation({
        mutationFn: startVoiceInteraction,
        onSuccess: () => {
            console.log('Voice interaction started');
        }
    });

    const respondMutation = useMutation({
        mutationFn: respondToVoice,
        onSuccess: (data) => {
            const audio = new Audio(data.audio);
            audio.play();
        }
    });

    const handleStart = () => {
        setIsListening(true);
        startInteractionMutation.mutate();

        // Initialize the Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
            // Ensure candidate_id is available, replace with actual candidate ID
            const candidateId = 1; // Replace with the actual candidate ID you want to use
            respondMutation.mutate({ text: transcript, candidate_id: candidateId }); // Send the recognized text and candidate ID to the server
        };

        recognitionInstance.start();
        setRecognition(recognitionInstance);
    };

    const handleStop = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    useEffect(() => {
        console.log('Transcript:', transcript);
    }, [transcript]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Voice Call Simulator</h2>
            <button
                onClick={handleStart}
                className="mr-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Start Call
            </button>
            <button
                onClick={handleStop}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                Stop Call
            </button>
            <p className="mt-4">Transcript: {transcript}</p>
        </div>
    );
} 