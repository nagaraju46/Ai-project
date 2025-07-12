import React from 'react';
import { Bot, Trash2, Settings, Plus, MessageSquare } from 'lucide-react'; // ← Added MessageSquare
import { SavedConversation } from '../types';

interface ChatHeaderProps {
  onClearHistory: () => void;
  onShowSettings: () => void;
  onNewConversation: () => void;
  savedConversations: SavedConversation[];
  onLoadConversation: (id: string) => void;
  currentConversationId: string | null;
  messageCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClearHistory,
  onShowSettings,
  onNewConversation,
  savedConversations,
  onLoadConversation,
  currentConversationId,
  messageCount,
}) => {
  const handleNewChatClick = () => {
    const confirmStart = window.confirm('Are you sure you want to start new chat?');
    if (confirmStart) {
      onNewConversation();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section: icon + title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
            <p className="text-sm text-gray-600">
              {messageCount > 0 ? `${messageCount} messages • Auto-saving enabled` : 'Ready to chat'}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChatClick}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="New Conversation"
          >
            <Plus className="w-5 h-5" />
          </button>

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

      {/* Previous Conversations Section */}
      {savedConversations.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Previous Conversations</h2>
          <div className="flex flex-wrap gap-2">
            {savedConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onLoadConversation(conv.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                  conv.id === currentConversationId
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {conv.title || 'Untitled'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
