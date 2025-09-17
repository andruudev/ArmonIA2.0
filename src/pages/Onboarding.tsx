import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Activity } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { completeOnboarding, user } = useAuth();
  const navigate = useNavigate();
  const [focusArea, setFocusArea] = useState('estres');
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    setSaving(true);
    // In a real app we would persist these preferences to backend
    await new Promise(r => setTimeout(r, 500));
    completeOnboarding();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <header className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Bienvenido a ArmonIA</span>
          </div>
        </header>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Configura tu experiencia</CardTitle>
            <CardDescription>
              Cuéntanos un poco sobre ti para personalizar tus recomendaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">¿Cómo te llamamos?</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Tu nombre" />
              <p className="text-xs text-muted-foreground">Puedes cambiarlo luego en tu perfil.</p>
            </div>

            <div className="space-y-3">
              <Label>¿Cuál es tu objetivo principal ahora?</Label>
              <RadioGroup value={focusArea} onValueChange={setFocusArea}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="estres" id="estres" />
                  <Label htmlFor="estres">Manejar el estrés</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="animo" id="animo" />
                  <Label htmlFor="animo">Mejorar mi estado de ánimo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="habitos" id="habitos" />
                  <Label htmlFor="habitos">Crear hábitos saludables</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button className="btn-hero" onClick={handleFinish} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Comenzar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
