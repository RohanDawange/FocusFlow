import React from 'react';
import { useFocus } from '@/contexts/FocusContext';
import { 
  Settings as SettingsIcon, Sun, Moon, Palette, Bell, Volume2, 
  Trash2, Download, Save, Info, Sparkles, Coffee, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { settings, updateSettings, setDailyGoal, dailyGoal } = useFocus();

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = {
      settings,
      dailyGoal,
      stats: JSON.parse(localStorage.getItem('focus_stats') || '[]'),
      notes: JSON.parse(localStorage.getItem('focus_notes') || '[]'),
      tasks: JSON.parse(localStorage.getItem('focus_tasks') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Data exported successfully');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-black text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Personalize FocusFlow to match your study style.</p>
      </div>

      <div className="space-y-8 animate-fade-in delay-200">
        {/* Appearance Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Palette className="w-6 h-6" />
            <h2 className="text-2xl font-black">Appearance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemeCard 
              name="light" 
              active={settings.theme === 'light'} 
              onClick={() => updateSettings({ theme: 'light' })}
              icon={<Sun className="w-6 h-6" />}
              colorClass="bg-white border-accent"
            />
            <ThemeCard 
              name="dark" 
              active={settings.theme === 'dark'} 
              onClick={() => updateSettings({ theme: 'dark' })}
              icon={<Moon className="w-6 h-6" />}
              colorClass="bg-slate-900 border-slate-800 text-white"
            />
            <ThemeCard 
              name="orange" 
              active={settings.theme === 'orange'} 
              onClick={() => updateSettings({ theme: 'orange' })}
              icon={<Sparkles className="w-6 h-6" />}
              colorClass="bg-[#FFF8F4] border-[#FFD8C4] text-[#8B4513]"
            />
          </div>
        </section>

        {/* Timer Durations Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Timer className="w-6 h-6" />
            <h2 className="text-2xl font-black">Timer Durations</h2>
          </div>
          <Card className="bg-card border-none shadow-md">
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DurationInput 
                  label="Focus Session" 
                  value={settings.focusDuration / 60} 
                  onChange={(v) => updateSettings({ focusDuration: v * 60 })} 
                  icon={<Timer className="w-4 h-4" />}
                />
                <DurationInput 
                  label="Short Break" 
                  value={settings.shortBreakDuration / 60} 
                  onChange={(v) => updateSettings({ shortBreakDuration: v * 60 })} 
                  icon={<Coffee className="w-4 h-4" />}
                />
                <DurationInput 
                  label="Long Break" 
                  value={settings.longBreakDuration / 60} 
                  onChange={(v) => updateSettings({ longBreakDuration: v * 60 })} 
                  icon={<Timer className="w-4 h-4" />}
                />
              </div>
              <div className="pt-8 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-foreground">Sessions Until Long Break</h3>
                    <p className="text-sm text-muted-foreground">How many focus sessions before a long break?</p>
                  </div>
                  <Select 
                    value={settings.sessionsUntilLongBreak.toString()} 
                    onValueChange={(v) => updateSettings({ sessionsUntilLongBreak: parseInt(v) })}
                  >
                    <SelectTrigger className="w-24 bg-accent border-none rounded-xl h-12 font-bold">
                      <SelectValue placeholder="Sessions" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-accent bg-card">
                      {[2, 3, 4, 5, 6, 8].map(n => (
                        <SelectItem key={n} value={n.toString()} className="font-bold">{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div>
                    <h3 className="font-black text-foreground">Daily Goal</h3>
                    <p className="text-sm text-muted-foreground">How many pomodoros do you want to complete today?</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))} className="rounded-xl bg-accent w-10 h-10">-</Button>
                    <span className="w-8 text-center font-black text-xl">{dailyGoal}</span>
                    <Button variant="ghost" size="icon" onClick={() => setDailyGoal(dailyGoal + 1)} className="rounded-xl bg-accent w-10 h-10">+</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sound & Notifications Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Bell className="w-6 h-6" />
            <h2 className="text-2xl font-black">Sound & Notifications</h2>
          </div>
          <Card className="bg-card border-none shadow-md">
            <CardContent className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground">Timer Completion Sound</h3>
                    <p className="text-sm text-muted-foreground">Play a soft bell sound when session ends.</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.soundEnabled} 
                  onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })} 
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-black text-sm uppercase tracking-widest text-muted-foreground/50">Volume Control</span>
                  </div>
                  <span className="text-xs font-black text-primary">{Math.round(settings.volume * 100)}%</span>
                </div>
                <Slider 
                  value={[settings.volume * 100]} 
                  onValueChange={(vals) => updateSettings({ volume: vals[0] / 100 })} 
                  max={100} 
                  className="py-4"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Management Section */}
        <section className="pt-10">
          <div className="flex items-center gap-2 mb-6 text-destructive">
            <Trash2 className="w-6 h-6" />
            <h2 className="text-2xl font-black">Data Management</h2>
          </div>
          <Card className="bg-destructive/5 border-2 border-dashed border-destructive/20 rounded-[2rem]">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="font-black text-lg text-foreground mb-1">Danger Zone</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  Export your data for backup or reset everything to start fresh. 
                  All study streaks and notes will be deleted upon reset.
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="font-bold gap-2 px-6 rounded-xl hover:bg-background h-12 border-accent" onClick={exportData}>
                  <Download className="w-4 h-4" /> Export Data
                </Button>
                <Button variant="destructive" className="font-bold gap-2 px-6 rounded-xl h-12 shadow-lg" onClick={handleResetData}>
                  <Trash2 className="w-4 h-4" /> Reset All
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="text-center pt-10 pb-20">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/30 mb-2">FocusFlow v1.0.0</p>
          <p className="text-xs font-medium text-muted-foreground/50">Designed with ❤️ for students everywhere.</p>
        </div>
      </div>
    </div>
  );
};

const ThemeCard = ({ name, active, onClick, icon, colorClass }: { name: string, active: boolean, onClick: () => void, icon: any, colorClass: string }) => (
  <div 
    onClick={onClick}
    className={cn(
      "relative p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 transform hover:scale-105 overflow-hidden",
      active ? "border-primary shadow-xl" : "border-transparent opacity-80 hover:opacity-100",
      colorClass
    )}
  >
    {active && (
      <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
        <Save className="w-3 h-3 fill-current" />
      </div>
    )}
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-background/20 flex items-center justify-center border border-white/10 backdrop-blur-sm">
        {icon}
      </div>
      <span className="font-black uppercase tracking-widest text-xs">{name} Theme</span>
    </div>
  </div>
);

const DurationInput = ({ label, value, onChange, icon }: { label: string, value: number, onChange: (v: number) => void, icon: any }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className="text-primary">{icon}</div>
      <span className="font-black text-sm uppercase tracking-widest text-muted-foreground/50">{label}</span>
    </div>
    <div className="flex items-center gap-4">
      <Input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value) || 1)} 
        className="bg-accent border-none rounded-xl h-12 font-black text-xl text-center focus-visible:ring-primary shadow-inner"
      />
      <span className="font-bold text-muted-foreground text-sm">min</span>
    </div>
  </div>
);

export default SettingsPage;
