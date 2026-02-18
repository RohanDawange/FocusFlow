import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FocusProvider, useFocus } from '@/contexts/FocusContext';
import { routes } from '@/routes';
import { 
  Timer, 
  BookOpen, 
  Maximize, 
  Calendar, 
  BarChart, 
  Settings, 
  Menu, 
  X,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  Timer: <Timer className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Maximize: <Maximize className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  BarChart: <BarChart className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

const SidebarItem = ({ route, onClick }: { route: any, onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === route.path;

  return (
    <Link to={route.path} onClick={onClick}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
      )}>
        {iconMap[route.icon] || <div className="w-5 h-5" />}
        <span className="font-medium">{route.label}</span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const { streak } = useFocus();
  const mainRoutes = routes.filter(r => r.label);

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border p-6">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
          F
        </div>
        <h1 className="text-xl font-bold text-foreground">FocusFlow</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {mainRoutes.map(route => (
          <SidebarItem key={route.path} route={route} />
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <div className="bg-accent/50 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary fill-primary/20" />
            <span className="font-semibold text-sm">Study Streak</span>
          </div>
          <span className="font-bold text-primary">{streak} days</span>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-inter">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm border shadow-sm">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 overflow-auto relative">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <FocusProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Layout>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </FocusProvider>
  );
}

export default App;
