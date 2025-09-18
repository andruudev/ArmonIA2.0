import React, { memo, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MoodChartProps {
  data: Array<{
    date: string;
    mood: number;
    name: string;
  }>;
}

const MOOD_NAMES = {
  1: 'Triste 😔',
  2: 'Content@ 😊',
  3: 'Tranquil@ 😌',
  4: 'Feliz 🤗',
  5: 'Emocionad@ ✨'
} as const;

const EmptyState = memo(() => (
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
));

EmptyState.displayName = 'EmptyState';

export const MoodChart = memo<MoodChartProps>(({ data }) => {
  const formatTooltip = useCallback((value: number, name: string, props: Record<string, unknown>) => {
    return [MOOD_NAMES[value as keyof typeof MOOD_NAMES] || value, 'Estado de ánimo'];
  }, []);

  const formatXAxisLabel = useCallback((tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  }, []);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sort data by date and ensure proper formatting
    return [...data]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        ...item,
        mood: Number(item.mood) || 0,
        formattedDate: new Date(item.date).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));
  }, [data]);

  const averageMood = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, item) => acc + item.mood, 0);
    return (sum / chartData.length).toFixed(1);
  }, [chartData]);

  const moodTrend = useMemo(() => {
    if (chartData.length < 2) return 'neutral';
    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
    
    const firstAvg = firstHalf.reduce((acc, item) => acc + item.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc, item) => acc + item.mood, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    if (difference > 0.2) return 'improving';
    if (difference < -0.2) return 'declining';
    return 'stable';
  }, [chartData]);

  const trendIcon = useMemo(() => {
    switch (moodTrend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  }, [moodTrend]);

  const trendText = useMemo(() => {
    switch (moodTrend) {
      case 'improving': return 'Mejorando';
      case 'declining': return 'Necesita atención';
      default: return 'Estable';
    }
  }, [moodTrend]);

  if (chartData.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tendencia de Estado de Ánimo
          <span className="text-sm font-normal flex items-center gap-1">
            {trendIcon} {trendText}
          </span>
        </CardTitle>
        <CardDescription>
          Tu progreso emocional durante los últimos 30 días • Promedio: {averageMood}/5
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[1, 5]} 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickCount={5}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString('es-ES')}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

MoodChart.displayName = 'MoodChart';