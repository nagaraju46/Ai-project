import React, { useState } from 'react';
import { MessageSquare, Trash2, Plus, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { SavedConversation } from '../types';

interface ConversationSidebarProps {
  conversations: SavedConversation[];
  currentConversationId: string | null;
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  onSaveCurrentConversation: () => void;
  hasUnsavedMessages: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onLoadConversation,
  onDeleteConversation,
  onNewConversation,
  onSaveCurrentConversation,
  hasUnsavedMessages,
  isOpen,
  onToggle,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirm === id) {
      onDeleteConversation(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-20 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        title={isOpen ? "Close conversations" : "Open conversations"}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-80`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
              <button
                onClick={onToggle}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onNewConversation}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
              
              {hasUnsavedMessages && (
                <button
                  onClick={onSaveCurrentConversation}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  title="Save current conversation"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved conversations yet</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      currentConversationId === conversation.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onLoadConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate text-sm">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {conversation.messages.length} messages
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {conversation.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => handleDelete(conversation.id, e)}
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
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
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};