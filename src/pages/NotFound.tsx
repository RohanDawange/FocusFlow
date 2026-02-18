import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, Ghost } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center animate-fade-in">
      <div className="relative mb-12">
        <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="relative text-9xl font-black text-primary opacity-20">404</div>
        <Ghost className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-primary drop-shadow-2xl animate-bounce" />
      </div>
      
      <h1 className="text-4xl font-black text-foreground mb-4">Lost in the study zone?</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
        We couldn't find the page you're looking for. Maybe it was moved to a long break!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button size="lg" className="bg-primary text-primary-foreground font-black px-10 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all gap-2 transform hover:scale-105 active:scale-95">
            <Home className="w-5 h-5" /> Back to Timer
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="border-accent border-2 font-black px-10 rounded-2xl hover:bg-accent transition-all transform hover:scale-105 active:scale-95" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
      
      <div className="mt-20 flex items-center justify-center gap-2 text-muted-foreground/30 font-black uppercase tracking-[0.3em] text-[10px]">
        <Search className="w-4 h-4" /> Error: Resource Not Found
      </div>
    </div>
  );
};

export default NotFound;
