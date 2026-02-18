import React, { useMemo } from 'react';
import { useFocus, DailyStats } from '@/contexts/FocusContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  AreaChart, Area, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Clock, Flame, Calendar, Info, Award, 
  ChevronRight, ArrowUpRight, Medal, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AnalyticsPage = () => {
  const { stats, streak, sessionsCompleted, dailyGoal } = useFocus();

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const stat = stats.find(s => s.date === date);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date,
        day: dayName,
        minutes: Math.round((stat?.studyTime || 0) / 60),
        pomodoros: stat?.pomodoros || 0,
      };
    });
  }, [stats]);

  const totalStudyMinutes = useMemo(() => 
    stats.reduce((acc, curr) => acc + (curr.studyTime || 0), 0) / 60
  , [stats]);

  const totalPomodoros = useMemo(() => 
    stats.reduce((acc, curr) => acc + (curr.pomodoros || 0), 0)
  , [stats]);

  const averageMinutesPerDay = totalStudyMinutes / (stats.length || 1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">Study Insights</h1>
          <p className="text-muted-foreground">Visualize your progress and stay motivated.</p>
        </div>
        <div className="flex gap-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-4 py-1.5 font-black uppercase tracking-widest text-xs flex gap-2">
            <Calendar className="w-3.5 h-3.5" /> Last 7 Days
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
        <Card className="bg-card border-none shadow-md overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all scale-150 -rotate-12">
            <Flame className="w-16 h-16 text-primary fill-current" />
          </div>
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Current Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-primary">{streak}</span>
              <span className="text-sm font-bold text-muted-foreground">days</span>
            </div>
            <p className="mt-4 text-xs font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-green-500" /> Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-none shadow-md overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all scale-150 -rotate-12">
            <Clock className="w-16 h-16 text-primary fill-current" />
          </div>
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Study Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-foreground">{Math.round(totalStudyMinutes)}</span>
              <span className="text-sm font-bold text-muted-foreground">minutes</span>
            </div>
            <p className="mt-4 text-xs font-medium text-muted-foreground flex items-center gap-1">
              Total lifetime focus
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-none shadow-md overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all scale-150 -rotate-12">
            <Award className="w-16 h-16 text-primary fill-current" />
          </div>
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Sessions</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-foreground">{totalPomodoros}</span>
              <span className="text-sm font-bold text-muted-foreground">completed</span>
            </div>
            <p className="mt-4 text-xs font-medium text-muted-foreground flex items-center gap-1">
              Pomodoro sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative group">
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Daily Goal</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black">{Math.min(sessionsCompleted, dailyGoal)} / {dailyGoal}</span>
            </div>
            <Progress value={(sessionsCompleted / dailyGoal) * 100} className="h-2 bg-white/20" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-80">
              {sessionsCompleted >= dailyGoal ? "Goal Reached! 🎉" : "Keep pushing!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in delay-200">
        <Card className="lg:col-span-2 bg-card border-none shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-foreground">Weekly Activity</h3>
              <p className="text-sm text-muted-foreground">Minutes studied per day</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Minutes</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--accent))" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.5 }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '16px', 
                    border: '2px solid hsl(var(--accent))',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 800 }}
                  labelStyle={{ fontWeight: 900, marginBottom: '4px' }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card border-none shadow-md p-6">
            <h3 className="text-xl font-black text-foreground mb-6">Achievements</h3>
            <div className="space-y-4">
              <AchievementItem 
                icon={<Medal className="w-5 h-5" />} 
                title="Early Bird" 
                desc="Study 3 days in a row before 8 AM" 
                progress={60} 
                locked={false}
              />
              <AchievementItem 
                icon={<Star className="w-5 h-5" />} 
                title="Deep Work Master" 
                desc="Complete 10 focus sessions" 
                progress={(totalPomodoros / 10) * 100} 
                locked={totalPomodoros < 10}
              />
              <AchievementItem 
                icon={<Award className="w-5 h-5" />} 
                title="Consistently Focused" 
                desc="Maintain a 7-day streak" 
                progress={(streak / 7) * 100} 
                locked={streak < 7}
              />
            </div>
            <Button variant="outline" className="w-full mt-6 font-bold gap-2">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-accent/50 to-transparent border-none shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Pro Tip</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "Studies show that taking short breaks every 25 minutes improves focus and prevents burnout. You're doing great!"
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AchievementItem = ({ icon, title, desc, progress, locked }: { icon: any, title: string, desc: string, progress: number, locked: boolean }) => (
  <div className={cn("flex items-start gap-4 p-3 rounded-2xl transition-all", locked ? "opacity-40 grayscale" : "bg-accent/30")}>
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-black text-sm truncate">{title}</h4>
        {!locked && <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Unlocked</span>}
      </div>
      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{desc}</p>
      <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </div>
  </div>
);

export default AnalyticsPage;
