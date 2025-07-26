import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatBotContextType {
  isOpen: boolean;
  openChat: (prefilledMessage?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  prefilledMessage: string;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (context === undefined) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};

interface ChatBotProviderProps {
  children: ReactNode;
}

export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState('');

  const openChat = (prefilledMsg?: string) => {
    if (prefilledMsg) {
      setPrefilledMessage(prefilledMsg);
    }
    setIsOpen(true);
  };
  const closeChat = () => {
    setIsOpen(false);
    setPrefilledMessage('');
  };
  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <ChatBotContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, prefilledMessage }}>
      {children}
    </ChatBotContext.Provider>
  );
};
