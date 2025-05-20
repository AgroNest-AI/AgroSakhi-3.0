import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "@/context/UserContext";
import { useVoice } from "@/context/VoiceContext";
import { useTranslation } from "react-i18next";

export default function VoiceAssistant() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { listening, toggleListening, transcript, resetTranscript } = useVoice();
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Process the transcript when it changes and is not empty
  useEffect(() => {
    const processQuery = async () => {
      if (transcript && !loading) {
        setLoading(true);
        setError(null);
        
        try {
          // Create user context with relevant information for the AI
          const userContext = {
            userId: user?.id,
            name: user?.displayName,
            location: user?.location,
            preferredLanguage: user?.preferredLanguage,
            // Add more context here if needed
          };
          
          const response = await apiRequest('/api/ai/voice-query', 'POST', {
            query: transcript,
            userContext
          });
          
          if (response && response.response) {
            setResponses(prev => [...prev, response.response]);
            
            // Optional: Use text-to-speech to read the response
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(response.response);
              utterance.lang = user?.preferredLanguage || 'en-US';
              window.speechSynthesis.speak(utterance);
            }
          }
        } catch (err) {
          console.error('Error processing voice query:', err);
          setError(t('Failed to process your question. Please try again.'));
        } finally {
          setLoading(false);
          resetTranscript();
        }
      }
    };
    
    // Small delay to make sure the user finished speaking
    const timeoutId = setTimeout(() => {
      if (transcript) {
        processQuery();
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [transcript, user, resetTranscript, t]);

  // Scroll to bottom when new responses are added
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [responses]);

  return (
    <Card className="p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Volume2 className="mr-2" /> {t('Voice Assistant')}
        </h3>
        <Button 
          onClick={toggleListening}
          variant={listening ? "destructive" : "default"}
          size="sm"
          className="flex items-center"
        >
          {listening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
          {listening ? t('Stop') : t('Start')}
        </Button>
      </div>
      
      {/* Transcript display */}
      {transcript && (
        <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
          <p className="text-sm font-medium">{t('You said')}:</p>
          <p className="italic">{transcript}</p>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-2">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('Processing...')}</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      {/* Responses history */}
      {responses.length > 0 && (
        <div 
          ref={responseRef}
          className="mt-4 max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md"
        >
          {responses.map((response, index) => (
            <div 
              key={index} 
              className="p-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
            >
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Instructions */}
      {!listening && !transcript && responses.length === 0 && (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400">
          <p>{t('Click the Start button and ask me about:')}</p>
          <ul className="mt-2 text-sm list-disc list-inside">
            <li>{t('Weather conditions and forecasts')}</li>
            <li>{t('Crop recommendations for your farm')}</li>
            <li>{t('Best practices for local farming')}</li>
            <li>{t('Market prices and trends')}</li>
          </ul>
        </div>
      )}
    </Card>
  );
}