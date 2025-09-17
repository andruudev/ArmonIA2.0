// Initialize demo data for the application
export const initializeDemoData = () => {
  // Create demo user if it doesn't exist
  const users = JSON.parse(localStorage.getItem('armonia_users') || '[]');
  
  const demoUser = {
    id: 'demo-user-1',
    email: 'demo@armonia.com',
    password: 'demo123',
    name: 'Usuario Demo',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  };

  if (!users.find((u: any) => u.email === demoUser.email)) {
    users.push(demoUser);
    localStorage.setItem('armonia_users', JSON.stringify(users));
  }

  // Create demo mood entries
  const moodKey = `armonia_moods_${demoUser.id}`;
  const existingMoods = localStorage.getItem(moodKey);
  
  if (!existingMoods) {
    const demoMoodEntries = [
      {
        id: 'mood-1',
        mood: { id: 'happy', name: 'Happy', emoji: '🤗', value: 4, color: 'mood-happy' },
        journal: 'Tuve un día excelente en el trabajo. Me siento muy productivo y motivado.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000
      },
      {
        id: 'mood-2',
        mood: { id: 'content', name: 'Content', emoji: '😊', value: 2, color: 'mood-content' },
        journal: 'Un día tranquilo. Hice ejercicio por la mañana y me relajé por la tarde.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
      },
      {
        id: 'mood-3',
        mood: { id: 'peaceful', name: 'Peaceful', emoji: '😌', value: 3, color: 'mood-peaceful' },
        journal: 'Medité por 15 minutos. Me siento más centrado y en paz conmigo mismo.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
      },
      {
        id: 'mood-4',
        mood: { id: 'down', name: 'Down', emoji: '😔', value: 1, color: 'mood-down' },
        journal: 'Día difícil. Mucho estrés en el trabajo y problemas personales que me preocupan.',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000
      },
      {
        id: 'mood-5',
        mood: { id: 'excited', name: 'Excited', emoji: '✨', value: 5, color: 'mood-excited' },
        journal: '¡Increíble noticia! Me aceptaron en el proyecto que tanto quería. ¡Estoy emocionado!',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
      }
    ];

    localStorage.setItem(moodKey, JSON.stringify(demoMoodEntries));
  }

  // Create demo breathing sessions
  const breathingKey = `armonia_breathing_${demoUser.id}`;
  const existingBreathing = localStorage.getItem(breathingKey);
  
  if (!existingBreathing) {
    const demoBreathingSessions = [
      {
        id: 'breathing-1',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 280, // 5 cycles * 56 seconds per cycle
        cycles: 5
      },
      {
        id: 'breathing-2',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 168, // 3 cycles
        cycles: 3
      },
      {
        id: 'breathing-3',
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 448, // 8 cycles
        cycles: 8
      }
    ];

    localStorage.setItem(breathingKey, JSON.stringify(demoBreathingSessions));
  }

  // Create demo chat history
  const chatKey = `armonia_chat_${demoUser.id}`;
  const existingChat = localStorage.getItem(chatKey);
  
  if (!existingChat) {
    const demoChatHistory = [
      {
        id: 'chat-welcome',
        content: '¡Hola Usuario Demo! Soy tu asistente de IA de ArmonIA. Estoy aquí para escucharte, apoyarte y ayudarte a entender mejor tus emociones. ¿Cómo te sientes hoy?',
        sender: 'ai',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
      },
      {
        id: 'chat-user-1',
        content: 'Hola, he estado sintiendo algo de ansiedad últimamente con el trabajo.',
        sender: 'user',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 + 30000
      },
      {
        id: 'chat-ai-1',
        content: 'Lamento que te sientas ansioso. El estrés laboral es muy común y es normal que te afecte. ¿Has probado la técnica 4-7-8? Inhala por 4, mantén por 7, exhala por 8. También tenemos ejercicios interactivos en la sección de Actividades que podrían ayudarte.',
        sender: 'ai',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000
      }
    ];

    localStorage.setItem(chatKey, JSON.stringify(demoChatHistory));
  }
};

// Auto-initialize on app load
if (typeof window !== 'undefined') {
  initializeDemoData();
}