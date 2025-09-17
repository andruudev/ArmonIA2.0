import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Bot, User, Activity, Brain, Lightbulb, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

// Removed static AI responses - now using Gemini AI

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const { generateResponse, isLoading, error, clearError } = useGeminiAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history
    if (user) {
      const key = `armonia_chat_${user.id}`;
      const storedMessages = localStorage.getItem(key);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Welcome message
        const welcomeMessage: ChatMessage = {
          id: '1',
          content: `¡Hola ${user.name}! Soy tu asistente de IA de ArmonIA. Estoy aquí para escucharte, apoyarte y ayudarte a entender mejor tus emociones. ¿Cómo te sientes hoy?`,
          sender: 'ai',
          timestamp: Date.now()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Save chat history
    if (user && messages.length > 0) {
      const key = `armonia_chat_${user.id}`;
      localStorage.setItem(key, JSON.stringify(messages));
    }
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Removed generateAIResponse - now using Gemini AI

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    clearError();

    try {
      // Preparar historial de conversación para Gemini
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: msg.content
      }));

      const aiResponse = await generateResponse(currentInput, conversationHistory);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Error al enviar el mensaje. Intenta de nuevo.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] max-w-4xl mx-auto p-6 flex flex-col">
      
      <Card className="flex-1 flex flex-col shadow-soft">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Chat con IA - Asistente de Bienestar
            <div className="flex items-center gap-1 ml-auto">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Powered by Gemini AI</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in-up ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <AvatarFallback>
                      <Activity className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 bg-secondary/10">
                    <AvatarFallback>
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-fade-in-up">
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback>
                    <Activity className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Comparte cómo te sientes o haz una pregunta..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="btn-hero"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput('¿Cómo puedo manejar el estrés?')}
          disabled={isLoading}
        >
          <Brain className="h-3 w-3 mr-1" />
          Manejar estrés
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput('Me siento ansioso, ¿qué puedo hacer?')}
          disabled={isLoading}
        >
          <Activity className="h-3 w-3 mr-1" />
          Ansiedad
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput('¿Puedes sugerirme ejercicios de respiración?')}
          disabled={isLoading}
        >
          <Lightbulb className="h-3 w-3 mr-1" />
          Ejercicios
        </Button>
      </div>
    </div>
  );
};