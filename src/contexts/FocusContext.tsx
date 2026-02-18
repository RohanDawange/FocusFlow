import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isImportant: boolean;
  updatedAt: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  studyTime: number; // in seconds
  pomodoros: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'orange';
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  volume: number;
  soundEnabled: boolean;
}

interface FocusContextType {
  // Timer
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  sessionsCompleted: number;
  
  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Analytics & Streaks
  stats: DailyStats[];
  streak: number;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from LocalStorage
  const getInitial = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [settings, setSettings] = useState<Settings>(() => getInitial('focus_settings', {
    theme: 'light',
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsUntilLongBreak: 4,
    volume: 0.5,
    soundEnabled: true,
  }));

  const [timeLeft, setTimeLeft] = useState(settings.focusDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setModeState] = useState<TimerMode>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(() => getInitial('sessions_completed', 0));
  
  const [notes, setNotes] = useState<Note[]>(() => getInitial('focus_notes', []));
  const [tasks, setTasks] = useState<Task[]>(() => getInitial('focus_tasks', []));
  const [stats, setStats] = useState<DailyStats[]>(() => getInitial('focus_stats', []));
  const [dailyGoal, setDailyGoal] = useState(() => getInitial('focus_daily_goal', 4));

  // Sync settings theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'orange');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  // Persist data
  useEffect(() => localStorage.setItem('focus_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('focus_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('focus_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('focus_stats', JSON.stringify(stats)), [stats]);
  useEffect(() => localStorage.setItem('focus_daily_goal', JSON.stringify(dailyGoal)), [dailyGoal]);
  useEffect(() => localStorage.setItem('sessions_completed', JSON.stringify(sessionsCompleted)), [sessionsCompleted]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setMode = useCallback((newMode: TimerMode) => {
    setModeState(newMode);
    setIsRunning(false);
    if (newMode === 'focus') setTimeLeft(settings.focusDuration);
    else if (newMode === 'shortBreak') setTimeLeft(settings.shortBreakDuration);
    else if (newMode === 'longBreak') setTimeLeft(settings.longBreakDuration);
  }, [settings]);

  // Handle timer tick
  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        // Update study time every minute
        if (mode === 'focus') {
          const today = new Date().toISOString().split('T')[0];
          setStats(prev => {
            const existing = prev.find(s => s.date === today);
            if (existing) {
              return prev.map(s => s.date === today ? { ...s, studyTime: s.studyTime + 1 } : s);
            }
            return [...prev, { date: today, studyTime: 1, pomodoros: 0 }];
          });
        }
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const handleSessionEnd = () => {
    if (settings.soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = settings.volume;
      audio.play().catch(() => console.log('Audio playback failed'));
    }

    if (mode === 'focus') {
      const nextSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(nextSessionsCompleted);
      
      const today = new Date().toISOString().split('T')[0];
      setStats(prev => prev.map(s => s.date === today ? { ...s, pomodoros: s.pomodoros + 1 } : s));

      if (nextSessionsCompleted % settings.sessionsUntilLongBreak === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('focus');
    }
  };

  // Streak calculation
  const streak = React.useMemo(() => {
    if (stats.length === 0) return 0;
    const sortedStats = [...stats].sort((a, b) => b.date.localeCompare(a.date));
    let currentStreak = 0;
    let checkDate = new Date();
    
    // Check if today or yesterday was active
    const todayStr = checkDate.toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const hasToday = sortedStats.find(s => s.date === todayStr && s.pomodoros > 0);
    const hasYesterday = sortedStats.find(s => s.date === yesterdayStr && s.pomodoros > 0);
    
    if (!hasToday && !hasYesterday) return 0;
    
    if (!hasToday) {
      checkDate = yesterday;
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayStat = sortedStats.find(s => s.date === dateStr);
      if (dayStat && dayStat.pomodoros > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  }, [stats]);

  // Notes actions
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, noteUpdate: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...noteUpdate, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Tasks actions
  const addTask = (text: string) => {
    setTasks(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), text, completed: false }]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <FocusContext.Provider value={{
      timeLeft, setTimeLeft, isRunning, setIsRunning, mode, setMode, sessionsCompleted,
      notes, addNote, updateNote, deleteNote,
      tasks, addTask, toggleTask, deleteTask,
      stats, streak, dailyGoal, setDailyGoal,
      settings, updateSettings,
    }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};
