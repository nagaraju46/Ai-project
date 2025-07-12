import React, { useState } from 'react';
import { X, Key, Eye, EyeOff, MessageSquare, Trash2 } from 'lucide-react';
import { SavedConversation } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onApiKeyChange: (newApiKey: string) => void;
  savedConversations: SavedConversation[];
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  onApiKeyChange,
  savedConversations,
  onLoadConversation,
  onDeleteConversation,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'messages'>('general');
  const [newApiKey, setNewApiKey] = useState(currentApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleApiKeyChange = (value: string) => {
    setNewApiKey(value);
    setIsChanged(value !== currentApiKey);
  };

  const handleSaveApiKey = () => {
    if (newApiKey.trim() && newApiKey !== currentApiKey) {
      onApiKeyChange(newApiKey.trim());
      setIsChanged(false);
    }
  };

  const handleCancel = () => {
    setNewApiKey(currentApiKey);
    setIsChanged(false);
    setActiveTab('general');
    onClose();
  };

  const handleDeleteConversation = (id: string) => {
    if (deleteConfirm === id) {
      onDeleteConversation(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleLoadAndClose = (id: string) => {
    onLoadConversation(id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-500 hover:text-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'api'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            API Change
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'messages'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Previous Messages
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {activeTab === 'general' && (
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">About</h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI Chat Application with Google Gemini integration
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Automatic conversation saving</li>
                  <li>• Message history management</li>
                  <li>• Secure API key storage</li>
                  <li>• Responsive design</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Storage</h3>
                <p className="text-sm text-gray-600">
                  All conversations and settings are stored locally in your browser.
                  Your data never leaves your device.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-800">Google Gemini API Key</h3>
              </div>
              
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Current API Key
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={newApiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="AIza..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isChanged && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setNewApiKey(currentApiKey);
                      setIsChanged(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">How to get a Google Gemini API key:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                  <li>2. Sign in to your Google account</li>
                  <li>3. Click "Create API Key"</li>
                  <li>4. Copy and paste the key here</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-800">Previous Messages</h3>
              </div>
              
              {savedConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No saved conversations yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start chatting and your conversations will be automatically saved
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    {savedConversations.length} saved conversation{savedConversations.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {savedConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="group p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleLoadAndClose(conversation.id)}
                          >
                            <h4 className="font-medium text-gray-800 truncate mb-1">
                              {conversation.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{conversation.messages.length} messages</span>
                              <span>{conversation.updatedAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteConversation(conversation.id)}
                            className={`opacity-0 group-hover:opacity-100 p-2 rounded transition-all ${
                              deleteConfirm === conversation.id
                                ? 'text-red-600 bg-red-50'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                            title={deleteConfirm === conversation.id ? 'Click again to confirm' : 'Delete conversation'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};