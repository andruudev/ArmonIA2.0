import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Brain, 
  MessageCircle, 
  Heart,
  Zap
} from 'lucide-react';

interface DemoMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const demoAIResponses = [
  {
    trigger: ['hola', 'hello', 'hi', 'buenos días'],
    response: '¡Hola! Soy tu asistente de IA de ArmonIA. Estoy aquí para escucharte y ayudarte con tu bienestar emocional. ¿Cómo te sientes hoy?'
  },
  {
    trigger: ['triste', 'mal', 'horrible', 'terrible'],
    response: 'Lamento que te sientas así. Es completamente normal tener días difíciles. ¿Te gustaría contarme qué está pasando? También puedo sugerirte algunos ejercicios de respiración que podrían ayudarte.'
  },
  {
    trigger: ['feliz', 'bien', 'genial', 'excelente'],
    response: '¡Me alegra saber que te sientes bien! Es maravilloso tener días positivos. ¿Qué ha hecho que te sientas así de bien hoy? Compartir las experiencias positivas puede ayudarte a mantener este estado.'
  },
  {
    trigger: ['estrés', 'estresado', 'ansiedad', 'ansioso'],
    response: 'El estrés y la ansiedad son muy comunes. Respirar profundamente puede ayudar inmediatamente. ¿Has probado la técnica 4-7-8? Inhala por 4, mantén por 7, exhala por 8.'
  }
];

export const InteractiveDemo: React.FC = () => {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [demoStats, setDemoStats] = useState({
    messagesSent: 0,
    totalTime: 0
  });

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: DemoMessage = {
      id: '1',
      content: '¡Hola! Soy tu asistente de IA de ArmonIA. Estoy aquí para escucharte y ayudarte con tu bienestar emocional. ¿Cómo te sientes hoy?',
      sender: 'ai',
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Removed breathing useEffect

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    const matchedResponse = demoAIResponses.find(response =>
      response.trigger.some(trigger => input.includes(trigger))
    );

    if (matchedResponse) {
      return matchedResponse.response;
    }

    // Default responses
    const defaultResponses = [
      'Gracias por compartir eso conmigo. Es importante expresar lo que sientes. ¿Cómo puedo apoyarte mejor en este momento?',
      'Entiendo lo que me cuentas. Cada experiencia es válida e importante. ¿Hay algo específico que te gustaría explorar?',
      'Aprecio tu confianza al compartir esto. ¿Te gustaría que hablemos sobre algunas técnicas que podrían ayudarte?',
      'Es normal sentir lo que describes. ¿Has notado algún patrón en estos sentimientos?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: DemoMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setDemoStats(prev => ({ ...prev, messagesSent: prev.messagesSent + 1 }));

    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const aiMessage: DemoMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  // Removed mood and breathing functions

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-soft border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl md:text-4xl">
            <Bot className="h-8 w-8 text-primary" />
            Chat con IA
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            Experimenta cómo nuestra IA te escucha, entiende y te guía hacia un mayor bienestar mental
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chat Interface */}
          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
            {/* Messages Area */}
            <div className="h-80 overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-fade-in-up ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-background text-foreground border border-border/50'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="bg-background text-foreground border border-border/50 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje aquí..."
                className="flex-1 px-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isTyping}
                className="px-6 py-3 rounded-xl"
                size="lg"
              >
                Enviar
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput('Hola, ¿cómo estás?')}
                disabled={isTyping}
                className="rounded-full"
              >
                <MessageCircle className="h-3 w-3 mr-2" />
                Saludo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput('Me siento estresado')}
                disabled={isTyping}
                className="rounded-full"
              >
                <Brain className="h-3 w-3 mr-2" />
                Estrés
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput('Estoy muy feliz hoy')}
                disabled={isTyping}
                className="rounded-full"
              >
                <Heart className="h-3 w-3 mr-2" />
                Felicidad
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput('¿Puedes ayudarme con la ansiedad?')}
                disabled={isTyping}
                className="rounded-full"
              >
                <Zap className="h-3 w-3 mr-2" />
                Ansiedad
              </Button>
            </div>
          </div>

          {/* Demo Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <MessageCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{demoStats.messagesSent}</p>
              <p className="text-sm text-muted-foreground">Mensajes Enviados</p>
            </div>
            <div className="text-center">
              <Bot className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">IA</p>
              <p className="text-sm text-muted-foreground">Asistente Activo</p>
            </div>
            <div className="text-center">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-muted-foreground">Disponible</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
