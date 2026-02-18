import React, { useState } from 'react';
import { useFocus } from '@/contexts/FocusContext';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Calendar, Clock, Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PlannerPage = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useFocus();
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText.trim());
    setNewTaskText('');
    toast.success('Task added');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">Study Planner</h1>
          <p className="text-muted-foreground">Stay organized and track your daily tasks.</p>
        </div>
        <div className="flex items-center gap-4 bg-accent/30 px-6 py-4 rounded-2xl border border-accent/30 shadow-sm backdrop-blur-sm">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Completed</p>
            <p className="text-2xl font-black text-primary">{completedCount} / {tasks.length}</p>
          </div>
          <div className="w-px h-10 bg-accent/50 mx-2" />
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Progress</p>
            <p className="text-2xl font-black text-foreground">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>

      <div className="mb-8 group">
        <form onSubmit={handleAddTask} className="flex gap-3 bg-card p-3 rounded-2xl shadow-lg border-2 border-transparent focus-within:border-primary transition-all duration-300">
          <Input 
            placeholder="What needs to be done?" 
            className="flex-1 text-lg font-medium border-none focus-visible:ring-0 bg-transparent h-12"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground font-bold rounded-xl px-8 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Add Task
          </Button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-accent/10 rounded-[2.5rem] border-4 border-dashed border-accent/50 animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-8">
            <ListTodo className="w-12 h-12 text-primary/40" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">Your list is empty</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Ready to crush your goals? Add your first task above and start your study journey!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 animate-fade-in">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={cn(
                "group flex items-center gap-4 p-5 bg-card rounded-2xl shadow-sm border-2 border-transparent hover:border-accent hover:shadow-md transition-all duration-200 cursor-pointer",
                task.completed && "bg-accent/10 opacity-70"
              )}
              onClick={() => toggleTask(task.id)}
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  task.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 text-transparent"
                )}
              >
                <CheckCircle2 className="w-5 h-5 fill-current" />
              </div>
              <span className={cn(
                "flex-1 text-lg font-medium transition-all duration-300",
                task.completed ? "line-through text-muted-foreground" : "text-foreground"
              )}>
                {task.text}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground rounded-full w-10 h-10"
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); toast.error('Task removed'); }}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-300">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-none shadow-md rounded-[2rem] p-6 hover:shadow-xl transition-all group overflow-hidden relative">
          <Calendar className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 opacity-0 group-hover:opacity-100 transition-all rotate-12" />
          <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Daily Progress
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">You've completed {completedCount} tasks today. Consistency is key to academic success!</p>
          <div className="h-2 w-full bg-accent/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </Card>
        
        <Card className="bg-card border-none shadow-md rounded-[2rem] p-6 hover:shadow-xl transition-all group">
          <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Upcoming
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Stay tuned! We're adding deadline tracking and calendar sync soon.</p>
          <Button variant="link" className="mt-2 p-0 text-primary h-auto font-bold uppercase tracking-widest text-[10px]">Learn more</Button>
        </Card>

        <Card className="bg-card border-none shadow-md rounded-[2rem] p-6 hover:shadow-xl transition-all group">
          <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Quick Tips
          </h3>
          <ul className="text-xs text-muted-foreground space-y-2 font-medium">
            <li className="flex gap-2"><span>•</span> Break big tasks into smaller ones.</li>
            <li className="flex gap-2"><span>•</span> Focus on the most important task first.</li>
            <li className="flex gap-2"><span>•</span> Review your list every morning.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default PlannerPage;
