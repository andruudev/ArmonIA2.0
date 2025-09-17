import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { GEMINI_CONFIG, isGeminiConfigured } from '@/config/gemini';

export const GeminiDebug: React.FC = () => {
  const apiKey = GEMINI_CONFIG.API_KEY;
  const isConfigured = isGeminiConfigured();
  
  const getStatusIcon = () => {
    if (isConfigured) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (apiKey === 'demo-key') return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (isConfigured) return 'Configurado correctamente';
    if (apiKey === 'demo-key') return 'Usando modo demo';
    if (apiKey === 'TU_API_KEY_AQUI') return 'API Key no configurada';
    return 'API Key inválida';
  };

  const getStatusColor = () => {
    if (isConfigured) return 'bg-green-100 text-green-800';
    if (apiKey === 'demo-key') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4" />
          Estado de Gemini AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estado:</span>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">API Key:</span>
          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {apiKey ? `${apiKey.substring(0, 10)}...` : 'No configurada'}
          </span>
        </div>

        {!isConfigured && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {apiKey === 'demo-key' || apiKey === 'TU_API_KEY_AQUI' ? (
                <>
                  Para usar Gemini AI real, crea un archivo <code className="bg-muted px-1 rounded">.env.local</code> en la raíz del proyecto con:
                  <br />
                  <code className="bg-muted px-2 py-1 rounded block mt-2">
                    VITE_GEMINI_API_KEY=tu_api_key_aqui
                  </code>
                </>
              ) : (
                'La API Key configurada parece ser inválida. Verifica que sea correcta.'
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
