import React, { useEffect, useState } from 'react';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, Settings as SettingsIcon, Coffee, Brain, Moon, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TimerPage = () => {
  const { 
    timeLeft, setTimeLeft, isRunning, setIsRunning, mode, setMode, 
    sessionsCompleted, settings, streak, dailyGoal 
  } = useFocus();

  const [motivation, setMotivation] = useState('Stay focused, you got this!');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? settings.focusDuration : 
                    mode === 'shortBreak' ? settings.shortBreakDuration : 
                    settings.longBreakDuration;
  
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    // Motivation quotes based on mode
    const quotes = {
      focus: [
        'Stay focused, you got this!',
        'Small progress is still progress.',
        'Concentrate on being productive, not busy.',
        'The secret of getting ahead is getting started.',
        'Success is the sum of small efforts repeated daily.',
      ],
      shortBreak: [
        '👁️ 20-20-20 Rule: Look 20ft away for 20s.',
        '🧘 Time to stretch your body!',
        '💧 Have you had some water recently?',
        '🔋 Resting your eyes for better focus.',
      ],
      longBreak: [
        '🏆 You earned this long break!',
        '🚶 Step away from the screen for a bit.',
        '🍱 Grab a healthy snack and recharge.',
        '✨ Great progress! You are doing amazing.',
      ]
    };
    const currentQuotes = quotes[mode];
    setMotivation(currentQuotes[Math.floor(Math.random() * currentQuotes.length)]);
  }, [mode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      } else if (e.code === 'KeyR') {
        resetTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    toast.info('Timer reset');
  };

  const skipTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    toast.info('Timer skipped');
  };

  const getModeLabel = () => {
    switch(mode) {
      case 'focus': return 'Focus Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };

  const getModeIcon = () => {
    switch(mode) {
      case 'focus': return <Brain className="w-6 h-6" />;
      case 'shortBreak': return <Coffee className="w-6 h-6" />;
      case 'longBreak': return <Moon className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="text-center mb-8 animate-fade-in">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 font-semibold text-sm transition-colors duration-500",
          mode === 'focus' ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        )}>
          {getModeIcon()}
          {getModeLabel()}
        </div>
        <p className="text-lg text-muted-foreground font-medium h-6">{motivation}</p>
      </div>

      <div className="relative group animate-fade-in">
        <div className="absolute -inset-1 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition duration-1000"></div>
        <Card className="relative w-80 h-80 md:w-96 md:h-96 rounded-full flex flex-col items-center justify-center border-8 border-accent shadow-2xl bg-card">
          <CardContent className="p-0 flex flex-col items-center">
            <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums text-foreground">
              {formatTime(timeLeft)}
            </span>
            <div className="mt-6 flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <span className="bg-accent px-3 py-1 rounded-full border border-border">
                {sessionsCompleted} / {settings.sessionsUntilLongBreak} Focus Sessions
              </span>
            </div>
          </CardContent>
          
          {/* Progress Ring Overlay */}
          <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle
              className="text-primary/10 stroke-current"
              strokeWidth="4"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary stroke-current transition-all duration-300"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
              strokeLinecap="round"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
          </svg>
        </Card>
      </div>

      <div className="mt-12 flex items-center gap-4 animate-fade-in">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-14 h-14 rounded-full bg-background/50 backdrop-blur-sm border-2"
          onClick={resetTimer}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <Button 
          size="lg" 
          className="w-24 h-24 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 active:scale-95 transition-all"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="w-14 h-14 rounded-full bg-background/50 backdrop-blur-sm border-2"
          onClick={skipTimer}
        >
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in delay-200">
        <Card className="bg-card border-none shadow-md overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Daily Goal</h3>
              </div>
              <span className="text-sm font-bold text-primary">{Math.min(sessionsCompleted, dailyGoal)} / {dailyGoal} Pomodoros</span>
            </div>
            <Progress value={(sessionsCompleted / dailyGoal) * 100} className="h-2 bg-accent" />
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Complete {dailyGoal} sessions today to maintain your {streak}-day streak!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-none shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Timer Info</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Focus Duration</p>
                <p className="text-foreground">{settings.focusDuration / 60} mins</p>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Break Duration</p>
                <p className="text-foreground">{settings.shortBreakDuration / 60} mins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimerPage;
