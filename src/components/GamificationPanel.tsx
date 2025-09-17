import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Crown, 
  Award,
  TrendingUp,
  Calendar,
  MessageCircle,
  Wind,
  BookOpen,
  Sun,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const categoryIcons = {
  consistency: Calendar,
  improvement: TrendingUp,
  exploration: Target,
  milestone: Crown
};

const categoryNames = {
  consistency: 'Constancia',
  improvement: 'Mejora',
  exploration: 'Exploración',
  milestone: 'Hitos'
};

export const GamificationPanel: React.FC = () => {
  const { achievements, userLevel, recentUnlocks, getRarityColor, getRarityBg } = useGamification();
  const [activeTab, setActiveTab] = useState('overview');

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons];
    return Icon ? <Icon className="h-4 w-4" /> : <Award className="h-4 w-4" />;
  };

  const getLevelIcon = (level: number) => {
    if (level >= 8) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (level >= 5) return <Trophy className="h-6 w-6 text-purple-500" />;
    if (level >= 3) return <Star className="h-6 w-6 text-blue-500" />;
    return <Target className="h-6 w-6 text-green-500" />;
  };

  const showAchievementToast = (achievement: any) => {
    toast.success(
      <div className="flex items-center gap-2">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <p className="font-semibold">¡Logro Desbloqueado!</p>
          <p className="text-sm">{achievement.title}</p>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  // Show toast for recent unlocks
  React.useEffect(() => {
    recentUnlocks.forEach(achievement => {
      showAchievementToast(achievement);
    });
  }, [recentUnlocks]);

  return (
    <div className="space-y-6">
      {/* Level Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getLevelIcon(userLevel.level)}
            <span className={userLevel.color}>Nivel {userLevel.level} - {userLevel.title}</span>
          </CardTitle>
          <CardDescription>
            Tu progreso en el camino del bienestar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progreso al siguiente nivel</span>
              <span>{userLevel.xp} XP</span>
            </div>
            <Progress value={userLevel.progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Nivel {userLevel.level}</span>
              <span>Nivel {userLevel.level + 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-xs text-muted-foreground">Logros</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Star className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{userLevel.xp}</p>
            <p className="text-xs text-muted-foreground">XP Total</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Zap className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {achievements.filter(a => a.unlocked && a.rarity === 'legendary').length}
            </p>
            <p className="text-xs text-muted-foreground">Legendarios</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Sparkles className="h-6 w-6 text-pink-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Completado</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="unlocked">Desbloqueados</TabsTrigger>
          <TabsTrigger value="locked">Pendientes</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryNames).map(([key, name]) => {
              const categoryAchievements = achievements.filter(a => a.category === key);
              const unlocked = categoryAchievements.filter(a => a.unlocked).length;
              const total = categoryAchievements.length;
              
              return (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(key)}
                      <span className="font-medium">{name}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{unlocked}/{total}</span>
                      <span>{Math.round((unlocked / total) * 100)}%</span>
                    </div>
                    <Progress value={(unlocked / total) * 100} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`${getRarityBg(achievement.rarity)} hover-lift`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRarityColor(achievement.rarity)}`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground">
                          Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className="opacity-60 hover-lift"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl grayscale">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          {achievement.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(achievement.current / achievement.requirement) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-xs text-muted-foreground">
                          {achievement.current}/{achievement.requirement}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentUnlocks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay logros recientes</p>
                <p className="text-sm text-muted-foreground mt-2">
                  ¡Sigue usando la app para desbloquear logros!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentUnlocks.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${getRarityBg(achievement.rarity)} border-2 border-primary/30 animate-fade-in-up`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <Badge className="bg-primary text-primary-foreground">
                            ¡Nuevo!
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
