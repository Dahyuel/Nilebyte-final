import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { useChatBot } from '../contexts/ChatBotContext';

interface ChatMessage {
  type: 'bot' | 'user';
  text: string;
}

interface N8nResponse {
  action?: string;
  status?: string;
  message?: string;
  response?: string;
  timestamp?: string;
  parsedResponse?: {
    response?: string;
    message?: string;
    action?: string;
  };
  data?: {
    name?: string;
    email?: string;
    date?: string;
    time?: string;
    duration?: string;
    timezone?: string;
  };
}

const ChatBot = () => {
  const { isOpen, closeChat, toggleChat, prefilledMessage } = useChatBot();
  const defaultWelcome = { type: 'bot', text: "Hello! I'm Nilebyte AI assistant. How can I help with AI automation today?" };
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('chatbot-messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [defaultWelcome];
      }
    }
    return [defaultWelcome];
  });
  const [inputValue, setInputValue] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on component mount
  useEffect(() => {
    // Generate a session ID if none exists
    if (!sessionId) {
      const newSessionId = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
      setSessionId(newSessionId);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      const timer = setTimeout(() => setIsRendered(true), 10);

      if (prefilledMessage) {
        handleSendMessage(prefilledMessage);
      }
      return () => clearTimeout(timer);
    } else {
      setIsRendered(false);
    }
  }, [isOpen, prefilledMessage]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatbot-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const clearChatHistory = () => {
      localStorage.removeItem('chatbot-messages');
    };
    window.addEventListener('beforeunload', clearChatHistory);
    return () => {
      window.removeEventListener('beforeunload', clearChatHistory);
    };
  }, []);

  const extractResponseMessage = (responseData: N8nResponse | N8nResponse[]): string => {
    const data = Array.isArray(responseData) ? responseData[0] : responseData;
    
    // Check for different possible response structures
    if (data?.parsedResponse?.response) {
      return data.parsedResponse.response;
    }
    
    if (data?.parsedResponse?.message) {
      return data.parsedResponse.message;
    }
    
    if (data?.message) {
      return data.message;
    }
    
    if (data?.response) {
      return data.response;
    }
    
    // Fallback message
    return 'Thanks for your message! Our team will get back to you shortly.';
  };

  // Function to format text with proper line breaks and styling
  const formatMessage = (text: string) => {
    // Split the text into lines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Handle service category headers (e.g., "General Services:")
      if (line.trim().endsWith(':') && !line.includes('--')) {
        return (
          <div key={index} className="font-semibold text-blue-300 mt-3 mb-1">
            {line.trim()}
          </div>
        );
      }
      
      // Handle separator lines (e.g., "------------------")
      if (line.trim().startsWith('--')) {
        return (
          <div key={index} className="text-gray-400 mb-2">
            {line.trim()}
          </div>
        );
      }
      
      // Handle numbered items (e.g., "1. AI Chatbot")
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={index} className="font-medium text-white mt-2 mb-1">
            {line.trim()}
          </div>
        );
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      
      // Handle regular text (descriptions)
      return (
        <div key={index} className="text-gray-300 mb-1 ml-4">
          {line.trim()}
        </div>
      );
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user's message to chat
    setMessages(prev => [...prev, { type: 'user', text: message }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://dahyzz.app.n8n.cloud/webhook/911243ee-72f2-4da5-b523-a542e5e54d90/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('nilebyte:nilebytee')
        },
        body: JSON.stringify({
          chatInput: message,
          sessionId: sessionId,
          action: "sendMessage"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: N8nResponse | N8nResponse[] = await response.json();
      
      // Debug log to see the actual response structure
      console.log('Webhook response:', data);
      
      const botMessage = extractResponseMessage(data);
      
      setMessages(prev => [...prev, {
        type: 'bot',
        text: botMessage
      }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue.trim());
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeChat();
      setIsClosing(false);
    }, 400);
  };

  return (
    <>
      {isOpen && (
        <div
          className={`chatbot-container fixed bottom-24 right-6 w-80 h-96 bg-black/80 border border-white/20 rounded-xl backdrop-blur-md z-50 flex flex-col ${(isRendered && !isClosing) ? 'open' : ''}`}
          tabIndex={0}
          onWheelCapture={e => {
            if (document.activeElement === e.currentTarget) {
              e.preventDefault();
              const messagesDiv = e.currentTarget.querySelector('.chatbot-messages') as HTMLDivElement;
              if (messagesDiv) {
                messagesDiv.scrollTop += e.deltaY;
              }
            }
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 dynamic-gradient-icon">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-light">Nilebyte AI</h3>
                <p className="text-xs text-gray-400">AI Automation Specialist</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors duration-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="chatbot-messages flex-1 p-4 overflow-y-auto space-y-3"
            style={{ scrollBehavior: 'smooth' }}
            onWheelCapture={e => {
              const el = e.currentTarget;
              const { scrollTop, scrollHeight, clientHeight } = el;
              const atTop = scrollTop === 0;
              const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
              if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                // Let page scroll
                return;
              }
              // Prevent page scroll if can scroll inside chatbot
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-[#0052D4] via-[#4364F7] to-[#6FB1FC] text-white'
                    : 'bg-white/10 text-gray-200'
                }`}>
                  {message.type === 'bot' ? (
                    <div className="text-sm font-light">
                      {formatMessage(message.text)}
                    </div>
                  ) : (
                    <p className="text-sm font-light">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 p-3 rounded-lg max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about AI automation..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm transition-colors duration-200"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 dynamic-gradient-icon"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 shadow-xl rounded-full p-4 border border-white/10 backdrop-blur-lg transition-all duration-300 hover:scale-105 focus:outline-none dynamic-gradient-icon"
        aria-label="Open chatbot"
      >
        <Bot className="w-7 h-7 text-white" />
      </button>
    </>
  );
};

export default ChatBot;