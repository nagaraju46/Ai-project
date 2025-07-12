import React from 'react';
import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types';
import { createGeminiService } from '../services/gemini';
import { useConversations } from './useConversations';

export const useChat = (apiKey: string) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const {
    savedConversations,
    currentConversationId,
    saveConversation,
    updateConversation,
    deleteConversation,
    loadConversation,
    setCurrentConversationId,
  } = useConversations();

  const geminiService = createGeminiService(apiKey);

  // Auto-save conversation after each AI response
  const autoSaveConversation = useCallback((messages: Message[]) => {
    if (messages.length >= 2) { // At least one user message and one AI response
      if (currentConversationId) {
        // Update existing conversation
        updateConversation(currentConversationId, messages);
      } else {
        // Save new conversation
        const newId = saveConversation(messages);
        if (newId) {
          setCurrentConversationId(newId);
        }
      }
    }
  }, [currentConversationId, saveConversation, updateConversation, setCurrentConversationId]);
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Clear any previous errors
    setState(prev => ({ ...prev, error: null }));

    // Add user message immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    // Add loading AI message
    const aiMessageId = `ai-${Date.now()}`;
    const loadingAiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, loadingAiMessage],
    }));

    try {
      // Build conversation history from current state + new user message
      const conversationHistory = [...state.messages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })).filter(msg => msg.parts[0].text.trim() !== '');
      
      const response = await geminiService.sendMessage(conversationHistory);
      
      // Update the AI message with the response
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: response, isLoading: false }
            : msg
        ),
        isLoading: false,
      }));

      // Auto-save the conversation after successful AI response
      setState(prev => {
        const updatedMessages = prev.messages.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: response, isLoading: false }
            : msg
        );
        autoSaveConversation(updatedMessages);
        return prev;
      });
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Provide user-friendly messages for common errors
      if (errorMessage.toLowerCase().includes('overloaded')) {
        errorMessage = 'The AI service is currently busy. I\'ve automatically retried, but it\'s still overloaded. Please try again in a moment.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment before sending another message.';
      } else if (errorMessage.toLowerCase().includes('quota')) {
        errorMessage = 'API quota exceeded. Please check your Google Cloud billing settings.';
      }
      
      // Update AI message with error
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === aiMessageId 
            ? { 
                ...msg, 
                content: `I apologize, but I'm having trouble responding right now. ${errorMessage}`,
                isLoading: false 
              }
            : msg
        ),
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [apiKey, state.messages, geminiService, autoSaveConversation]);

  const clearHistory = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
    setCurrentConversationId(null);
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const saveCurrentConversation = useCallback(() => {
    if (state.messages.length > 0) {
      if (currentConversationId) {
        updateConversation(currentConversationId, state.messages);
        return currentConversationId;
      } else {
        const conversationId = saveConversation(state.messages);
        if (conversationId) {
          setCurrentConversationId(conversationId);
        }
        return conversationId;
      }
    }
    return null;
  }, [state.messages, saveConversation, updateConversation, currentConversationId, setCurrentConversationId]);

  const loadSavedConversation = useCallback((id: string) => {
    const messages = loadConversation(id);
    if (messages) {
      setState({
        messages,
        isLoading: false,
        error: null,
      });
    }
  }, [loadConversation]);

  const deleteSavedConversation = useCallback((id: string) => {
    deleteConversation(id);
    if (currentConversationId === id) {
      clearHistory();
    }
  }, [deleteConversation, currentConversationId, clearHistory]);

  const startNewConversation = useCallback(() => {
    clearHistory();
  }, [clearHistory]);


  return {
    ...state,
    sendMessage,
    clearHistory,
    clearError,
    // Conversation management
    savedConversations,
    currentConversationId,
    saveCurrentConversation,
    loadSavedConversation,
    deleteSavedConversation,
    startNewConversation,
    hasUnsavedMessages: false, // Auto-save is enabled, so no unsaved messages
  };
};