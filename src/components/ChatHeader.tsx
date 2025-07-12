import React from 'react';
import { Bot, Trash2, Settings } from 'lucide-react';

interface ChatHeaderProps {
  onClearHistory: () => void;
  onShowSettings: () => void;
  messageCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onClearHistory, 
  onShowSettings, 
  messageCount
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
            <p className="text-sm text-gray-600">
              Powered by Google Gemini • {messageCount > 0 ? `${messageCount} messages` : 'Ready to chat'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {messageCount > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={onShowSettings}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};