import { useTranslation } from "react-i18next";
import { useVoice } from "@/context/VoiceContext";

export default function VoiceAssistant() {
  const { t } = useTranslation();
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    toggleVoiceAssistant,
    processVoiceCommand
  } = useVoice();

  const handleSubmit = () => {
    if (transcript) {
      processVoiceCommand(transcript);
    } else {
      toggleVoiceAssistant();
    }
  };

  const handleCancel = () => {
    toggleVoiceAssistant();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-20">
      <div className="bg-white w-full max-w-lg rounded-t-xl p-5 slide-in">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-display font-bold">{t('voice_assistant')}</h2>
          <button 
            className="text-neutral-500" 
            onClick={toggleVoiceAssistant}
            aria-label="Close voice assistant"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            className={`w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 ${isListening ? 'pulse' : ''}`}
            onClick={() => isListening ? stopListening() : startListening()}
          >
            <span className="material-icons text-5xl text-primary-500">mic</span>
          </div>
          <p className="text-lg font-medium mb-1">{isListening ? t('listening') : t('speak_now')}</p>
          
          {transcript ? (
            <div className="mb-6 text-center">
              <p className="text-sm text-primary-500 font-medium">{transcript}</p>
            </div>
          ) : (
            <p className="text-sm text-neutral-600 mb-6">{t('speak_now')}</p>
          )}
          
          <div className="w-full bg-neutral-100 rounded-lg p-4 mb-4">
            <p className="text-sm text-neutral-700">{t('try_saying')}:</p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center">
                <span className="material-icons text-sm text-primary-500 mr-2">arrow_right</span>
                <span className="text-sm">{t('sample_command_1')}</span>
              </li>
              <li className="flex items-center">
                <span className="material-icons text-sm text-primary-500 mr-2">arrow_right</span>
                <span className="text-sm">{t('sample_command_2')}</span>
              </li>
              <li className="flex items-center">
                <span className="material-icons text-sm text-primary-500 mr-2">arrow_right</span>
                <span className="text-sm">{t('sample_command_3')}</span>
              </li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="py-2 px-4 bg-neutral-200 text-neutral-800 rounded-lg"
              onClick={handleCancel}
            >
              {t('cancel')}
            </button>
            <button 
              className="py-2 px-4 bg-primary-500 text-white rounded-lg"
              onClick={handleSubmit}
            >
              {t('submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
