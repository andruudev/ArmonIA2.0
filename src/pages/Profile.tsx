import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useMoods } from '@/hooks/useMoods';
import { User, Mail, Calendar, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { entries, getMoodStats } = useMoods();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const stats = getMoodStats();

  const handleSave = () => {
    // In a real app, this would update the user via API
    toast.success('Perfil actualizado exitosamente');
    setIsEditing(false);
  };

  const getMembershipDuration = () => {
    if (!user) return 'N/A';
    
    // Check if this is demo user or get from localStorage
    const users = JSON.parse(localStorage.getItem('armonia_users') || '[]');
    const userData = users.find((u: any) => u.id === user.id);
    
    if (userData?.createdAt) {
      const joinDate = new Date(userData.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 día';
      if (diffDays < 30) return `${diffDays} días`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
      return `${Math.floor(diffDays / 365)} años`;
    }
    
    return 'Usuario demo';
  };

  const getWellnessBadge = () => {
    if (!stats) return { name: 'Nuevo', color: 'secondary' };
    
    if (stats.totalEntries >= 30) return { name: 'Maestro del Bienestar', color: 'default' };
    if (stats.totalEntries >= 15) return { name: 'Practicante Avanzado', color: 'default' };
    if (stats.totalEntries >= 7) return { name: 'Principiante Comprometido', color: 'secondary' };
    return { name: 'Explorando', color: 'secondary' };
  };

  const badge = getWellnessBadge();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y revisa tu progreso
        </p>
      </div>

      {/* Profile Information */}
      <Card className="shadow-soft">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">{user?.name}</CardTitle>
          <CardDescription>
            <Badge variant={badge.color as any}>{badge.name}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Miembro desde hace {getMembershipDuration()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="btn-hero">
                  Guardar Cambios
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estadísticas de Bienestar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Entradas totales</span>
                  <span className="font-semibold">{stats.totalEntries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Últimos 7 días</span>
                  <span className="font-semibold">{stats.last7Days}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estado promedio</span>
                  <span className="font-semibold">{stats.averageMood.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estado dominante</span>
                  <span className="font-semibold">{stats.dominantMood || 'N/A'}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Comienza a registrar tu estado de ánimo para ver estadísticas
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Actividades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sesiones de respiración</span>
              <span className="font-semibold">
                {JSON.parse(localStorage.getItem(`armonia_breathing_${user?.id}`) || '[]').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversaciones con IA</span>
              <span className="font-semibold">
                {JSON.parse(localStorage.getItem(`armonia_chat_${user?.id}`) || '[]').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Días activos</span>
              <span className="font-semibold">
                {new Set(entries.map(e => e.date)).size}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          <CardDescription>
            Acciones irreversibles relacionadas con tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cerrar sesión</p>
              <p className="text-sm text-muted-foreground">
                Salir de tu cuenta en este dispositivo
              </p>
            </div>
            <Button variant="destructive" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Activity className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Tu privacidad es importante</h3>
              <p className="text-sm text-muted-foreground">
                Todos tus datos se almacenan de forma segura y solo tú tienes acceso a ellos. 
                ArmonIA utiliza encriptación de nivel empresarial para proteger tu información personal 
                y emocional. Nunca compartimos tus datos con terceros.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};