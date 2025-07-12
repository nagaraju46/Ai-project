import { useState, useCallback } from 'react';
import { SavedConversation, Message } from '../types';
import { useLocalStorage } from './useLocalStorage';

export const useConversations = () => {
  const [savedConversations, setSavedConversations] = useLocalStorage<SavedConversation[]>('saved-conversations', []);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const saveConversation = useCallback((messages: Message[], title?: string) => {
    if (messages.length === 0) return null;

    const conversationTitle = title || generateTitle(messages);
    const now = new Date();
    
    const conversation: SavedConversation = {
      id: `conv-${Date.now()}`,
      title: conversationTitle,
      messages,
      createdAt: now,
      updatedAt: now,
    };

    setSavedConversations(prev => [conversation, ...prev]);
    setCurrentConversationId(conversation.id);
    return conversation.id;
  }, [setSavedConversations]);

  const updateConversation = useCallback((id: string, messages: Message[]) => {
    setSavedConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, messages, updatedAt: new Date() }
          : conv
      )
    );
  }, [setSavedConversations]);

  const deleteConversation = useCallback((id: string) => {
    setSavedConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  }, [setSavedConversations, currentConversationId]);

  const loadConversation = useCallback((id: string) => {
    const conversation = savedConversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversationId(id);
      return conversation.messages;
    }
    return null;
  }, [savedConversations]);

  const generateTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 50);
      return title.length < firstUserMessage.content.length ? `${title}...` : title;
    }
    return `Conversation ${new Date().toLocaleDateString()}`;
  };

  return {
    savedConversations,
    currentConversationId,
    saveConversation,
    updateConversation,
    deleteConversation,
    loadConversation,
    setCurrentConversationId,
  };
};