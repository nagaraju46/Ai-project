import React, { useState } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { ChatHeader } from './components/ChatHeader';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { ErrorMessage } from './components/ErrorMessage';
import { SettingsModal } from './components/SettingsModal';
import { useChat } from './hooks/useChat';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini-api-key', 'AIzaSyDmlV7rAapR4t7aw2fhk87jZd8J-evUDqM');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    clearError,
    savedConversations,
    currentConversationId,
    saveCurrentConversation,
    loadSavedConversation,
    deleteSavedConversation,
    startNewConversation,
  } = useChat(apiKey);

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowSettingsModal(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearHistory();
    }
  };

  const handleShowSettings = () => {
    setShowSettingsModal(true);
  };

  const handleNewConversation = () => {
    // Save current conversation if it has messages
    if (messages.length > 0) {
      saveCurrentConversation();
    }
    startNewConversation();
  };

  // Show API key input if no key is set or settings is open
  if (!apiKey) {
    return <ApiKeyInput onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentApiKey={apiKey}
        onApiKeyChange={handleApiKeySet}
        savedConversations={savedConversations}
        onLoadConversation={loadSavedConversation}
        onDeleteConversation={deleteSavedConversation}
      />

      <ChatHeader 
        onClearHistory={handleClearHistory}
        onShowSettings={handleShowSettings}
        onNewConversation={startNewConversation}
        savedConversations={savedConversations}
        onLoadConversation={loadSavedConversation}
        currentConversationId={currentConversationId}
        messageCount={messages.length}
      />

      {error && <ErrorMessage error={error} onDismiss={clearError} />}
      
      <ChatHistory messages={messages} />

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} disabled={!apiKey} />
    </div>
  );
}

export default App;
