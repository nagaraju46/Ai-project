import React, { useState } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { ChatHeader } from './components/ChatHeader';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { ErrorMessage } from './components/ErrorMessage';
import { useChat } from './hooks/useChat';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini-api-key', 'AIzaSyDmlV7rAapR4t7aw2fhk87jZd8J-evUDqM');
  const [showSettings, setShowSettings] = useState(false);
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearHistory, 
    clearError
  } = useChat(apiKey);

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowSettings(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearHistory();
    }
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  // Show API key input if no key is set or settings is open
  if (!apiKey || showSettings) {
    return (
      <div>
        <ApiKeyInput onApiKeySet={handleApiKeySet} />
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Update API Key</h2>
              <ApiKeyInput onApiKeySet={handleApiKeySet} />
              <button
                onClick={() => setShowSettings(false)}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader 
        onClearHistory={handleClearHistory}
        onShowSettings={handleShowSettings}
        messageCount={messages.length}
      />
      
      {error && (
        <ErrorMessage error={error} onDismiss={clearError} />
      )}
      
      <ChatHistory messages={messages} />
      
      <ChatInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
        disabled={!apiKey}
      />
    </div>
  );
}

export default App;