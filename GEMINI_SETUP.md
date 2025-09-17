# Configuración de Gemini AI para ArmonIA

## 🚀 Cómo configurar la API de Gemini AI

### 1. Obtener la API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### 2. Configurar la API Key

#### Opción A: Archivo de entorno (Recomendado)

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega la siguiente línea:
```bash
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

#### Opción B: Variable de entorno del sistema

```bash
export VITE_GEMINI_API_KEY=tu_api_key_aqui
```

### 3. Reiniciar el servidor

```bash
npm run dev
```

## 🔧 Funcionalidades

### Con API Key configurada:
- ✅ Respuestas inteligentes de Gemini AI
- ✅ Contexto de conversación mantenido
- ✅ Especializado en salud mental
- ✅ Respuestas empáticas y profesionales

### Sin API Key (Modo Demo):
- ✅ Respuestas predefinidas
- ✅ Funcionalidad básica
- ✅ Perfecto para desarrollo y pruebas

## 🛡️ Seguridad

- La API key se almacena solo en el cliente
- Configuraciones de seguridad habilitadas
- Filtros de contenido inapropiado
- Respuestas limitadas a salud mental

## 📝 Notas

- La API de Gemini es gratuita con límites generosos
- Las respuestas están optimizadas para bienestar mental
- El sistema mantiene el contexto de la conversación
- Fallback automático a modo demo si hay errores

## 🆘 Solución de problemas

### Error: "API key not configured"
- Verifica que el archivo `.env.local` existe
- Asegúrate de que la variable `VITE_GEMINI_API_KEY` esté configurada
- Reinicia el servidor de desarrollo

### Error: "Quota exceeded"
- Has excedido el límite de la API
- Espera o actualiza tu plan de Google AI

### Error: "Invalid API key"
- Verifica que la API key sea correcta
- Asegúrate de que la API key esté activa en Google AI Studio
