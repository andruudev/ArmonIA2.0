import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MoodChartProps {
  data: Array<{
    date: string;
    mood: number;
    name: string;
  }>;
}

export const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  const formatTooltip = (value: number, name: string, props: Record<string, unknown>) => {
    const moodNames = {
      1: 'Triste 😔',
      2: 'Content@ 😊',
      3: 'Tranquil@ 😌',
      4: 'Feliz 🤗',
      5: 'Emocionad@ ✨'
    };
    
    return [moodNames[value as keyof typeof moodNames] || value, 'Estado de ánimo'];
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Estado de Ánimo</CardTitle>
          <CardDescription>
            Tu progreso emocional durante los últimos 30 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No hay datos suficientes para mostrar la tendencia
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Estado de Ánimo</CardTitle>
        <CardDescription>
          Tu progreso emocional durante los últimos 30 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0.5, 5.5]}
                ticks={[1, 2, 3, 4, 5]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const emojis = { 1: '😔', 2: '😊', 3: '😌', 4: '🤗', 5: '✨' };
                  return emojis[value as keyof typeof emojis] || value;
                }}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};