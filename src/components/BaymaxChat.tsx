import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMockBaymaxResponse } from '@/lib/groq-api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface BaymaxChatProps {
  className?: string;
  style?: React.CSSProperties;
}

const BaymaxChat: React.FC<BaymaxChatProps> = ({ className, style }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I am Baymax, your personal healthcare companion. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate API call with a delay for realistic experience
  const simulateGroqAPI = async (message: string): Promise<string> => {
    // Add a realistic delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    return getMockBaymaxResponse(message);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Using mock API for now - replace with real server-side API call
      // For production, create an API route that calls Groq securely
      const response = await simulateGroqAPI(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-card/80 backdrop-blur-xl rounded-3xl shadow-soft border border-border/50 overflow-hidden",
        "hover:shadow-glow transition-all duration-500",
        className
      )}
      style={style}
    >
      <div className="flex items-center gap-3 p-6 bg-card/30 border-b border-border/50 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-glow/5" />
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center animate-pulse-glow">
              <Bot className="w-6 h-6 text-primary animate-gentle-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-gentle-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Baymax</h2>
            <p className="text-sm text-muted-foreground">Your Personal Healthcare Companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-background/20">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-message-in",
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1 animate-float">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-5 py-4 shadow-message backdrop-blur-sm",
                "transition-all duration-300 hover:shadow-glow",
                message.sender === 'user'
                  ? "bg-chat-user/90 text-chat-user-foreground rounded-br-md"
                  : "bg-chat-bot/80 text-chat-bot-foreground border border-border/30 rounded-bl-md"
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p className={cn(
                "text-xs mt-3 opacity-60 font-medium",
                message.sender === 'user' ? "text-chat-user-foreground" : "text-muted-foreground"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center flex-shrink-0 mt-1 animate-float" style={{ animationDelay: '1s' }}>
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 animate-message-in">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1 animate-pulse-glow">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-chat-bot/80 border border-border/30 rounded-2xl rounded-bl-md px-5 py-4 shadow-message backdrop-blur-sm">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full animate-typing" />
                <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-card/20 border-t border-border/50 backdrop-blur-xl relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="relative flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to Baymax..."
              disabled={isLoading}
              className={cn(
                "min-h-[56px] rounded-2xl border-2 bg-chat-input/80 backdrop-blur-sm pr-12 resize-none",
                "border-chat-input-border hover:border-primary/30 focus:border-primary/50",
                "focus:shadow-glow transition-all duration-300 text-base",
                "placeholder:text-muted-foreground/60"
              )}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="lg"
            className={cn(
              "rounded-2xl h-14 w-14 p-0 gradient-baymax shadow-soft transition-all duration-300",
              "hover:shadow-glow hover:scale-105 disabled:opacity-50 disabled:scale-100",
              "disabled:hover:shadow-soft"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BaymaxChat;