"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  ChatMessage, 
  ChatSession, 
  ChatbotAnalytics, 
  createChatSession, 
  addMessageToSession, 
  generateBotResponse, 
  classifyMessage,
  validateMessage 
} from '../lib/chatbot';

interface UseChatbotOptions {
  userId: string;
  userRole: 'admin' | 'operator' | 'supporter';
  currentModule?: string;
}

interface UseChatbotReturn {
  // Session data
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Analytics
  analytics: ChatbotAnalytics | null;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearSession: () => void;
  refreshAnalytics: () => Promise<void>;
}

export function useChatbot({ 
  userId, 
  userRole, 
  currentModule 
}: UseChatbotOptions): UseChatbotReturn {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        
        // Try to get existing session from API
        const response = await fetch(`/api/chatbot/session?userId=${userId}&userRole=${userRole}&module=${currentModule || ''}`);
        
        if (response.ok) {
          const data = await response.json();
          setSession(data.session);
          setMessages(data.session?.messages || []);
        } else {
          // Create new session
          const newSession = createChatSession(userId, userRole, currentModule);
          setSession(newSession);
          setMessages([]);
        }
      } catch (err) {
        console.error('Error initializing chatbot session:', err);
        // Fallback to creating new session
        const newSession = createChatSession(userId, userRole, currentModule);
        setSession(newSession);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [userId, userRole, currentModule]);

  // Load analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch('/api/chatbot/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
      }
    };

    loadAnalytics();
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!session) return;

    // Validate message
    const validation = validateMessage(content);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid message');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = addMessageToSession(session, content, 'user');
      setMessages(prev => [...prev, userMessage]);

      // Generate bot response
      const botResponse = generateBotResponse(content, userRole, currentModule);
      const classification = classifyMessage(content);
      
      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add bot message
      const botMessage = addMessageToSession(session, botResponse, 'bot', classification.category, classification.confidence);
      setMessages(prev => [...prev, botMessage]);

      // Update session
      setSession({ ...session });

      // Save to API
      try {
        await fetch('/api/chatbot/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            content,
            type: 'user',
            category: classification.category,
            confidence: classification.confidence,
          }),
        });

        await fetch('/api/chatbot/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            content: botResponse,
            type: 'bot',
            category: classification.category,
            confidence: classification.confidence,
          }),
        });
      } catch (apiError) {
        console.error('Error saving messages to API:', apiError);
        // Continue without API error
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [session, userRole, currentModule]);

  // Clear session
  const clearSession = useCallback(async () => {
    if (!session) return;

    try {
      setMessages([]);
      
      // Create new session
      const newSession = createChatSession(userId, userRole, currentModule);
      setSession(newSession);

      // Clear on API
      try {
        await fetch(`/api/chatbot/session?sessionId=${session.id}`, {
          method: 'DELETE',
        });
      } catch (apiError) {
        console.error('Error clearing session on API:', apiError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear session');
    }
  }, [session, userId, userRole, currentModule]);

  // Refresh analytics
  const refreshAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/chatbot/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error refreshing analytics:', err);
    }
  }, []);

  return {
    session,
    messages,
    isLoading,
    error,
    analytics,
    sendMessage,
    clearSession,
    refreshAnalytics,
  };
}
