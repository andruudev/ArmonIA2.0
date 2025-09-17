// Configuración de Gemini AI
export const GEMINI_CONFIG = {
  // Para usar Gemini AI real, reemplaza 'demo-key' con tu API key de Google AI
  // Obtén tu API key en: https://makersuite.google.com/app/apikey
  API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'demo-key',
  
  // Configuración del modelo
  MODEL: 'gemini-1.5-flash',
  
  // Configuración de seguridad
  SAFETY_SETTINGS: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
  
  // Configuración de generación
  GENERATION_CONFIG: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
};

// Función para verificar si la API key está configurada
export const isGeminiConfigured = () => {
  const apiKey = GEMINI_CONFIG.API_KEY;
  const isConfigured = apiKey && apiKey !== 'demo-key' && apiKey !== 'TU_API_KEY_AQUI';
  
  // Debug logging
  console.log('🔍 Gemini Configuration Debug:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey?.substring(0, 10) + '...',
    isConfigured,
    envVar: import.meta.env.VITE_GEMINI_API_KEY ? 'Set' : 'Not set'
  });
  
  return isConfigured;
};
