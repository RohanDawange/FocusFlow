import React, { useState, useEffect, useRef } from 'react';
import { useFocus } from '@/contexts/FocusContext';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, 
  Wind, CloudRain, Coffee, Minimize2, Settings2,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const FocusPage = () => {
  const { timeLeft, isRunning, setIsRunning, mode, setMode, settings, updateSettings } = useFocus();
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whiteNoise' | 'cafe'>('none');
  const [volume, setVolume] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ambientSources = {
    rain: 'https://assets.mixkit.co/active_storage/sfx/2407/2407-preview.mp3', // Rain sound
    whiteNoise: 'https://www.soundjay.com/nature/rain-01.mp3', // White noise alternative
    cafe: 'https://assets.mixkit.co/active_storage/sfx/1070/1070-preview.mp3', // Cafe sounds
  };

  useEffect(() => {
    if (ambientSound !== 'none') {
      if (!audioRef.current) {
        audioRef.current = new Audio(ambientSources[ambientSound as keyof typeof ambientSources]);
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = ambientSources[ambientSound as keyof typeof ambientSources];
      }
      audioRef.current.volume = volume;
      if (isRunning) audioRef.current.play().catch(e => console.log('Audio error:', e));
    } else {
      audioRef.current?.pause();
    }
  }, [ambientSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isRunning && ambientSound !== 'none') {
        audioRef.current.play().catch(e => console.log('Audio error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isRunning, volume, ambientSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const quotes = [
    "Focus is a matter of deciding what things you're not going to do.",
    "Don't stop until you're proud.",
    "Work hard in silence, let your success be your noise.",
    "Your focus determines your reality.",
    "The way to get started is to quit talking and begin doing."
  ];

  const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 transition-all duration-700">
      <div className="absolute top-8 right-8 flex items-center gap-4 animate-fade-in">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-accent/30 hover:bg-accent">
            <Minimize2 className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      <div className="max-w-xl w-full text-center space-y-12">
        <div className="space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Focusing
          </div>
          <h1 className="text-[12rem] font-black tracking-tighter tabular-nums text-foreground leading-none">
            {formatTime(timeLeft)}
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto italic flex items-center justify-center gap-3">
            <Quote className="w-5 h-5 opacity-20" />
            {currentQuote}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 animate-fade-in delay-200">
          <Button 
            size="lg" 
            className="w-32 h-32 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-110 active:scale-95 transition-all duration-300 border-8 border-background"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current translate-x-1" />}
          </Button>

          <div className="grid grid-cols-4 gap-4 p-4 bg-accent/20 rounded-2xl backdrop-blur-sm border border-accent/30 shadow-inner">
            <Button 
              variant={ambientSound === 'none' ? 'default' : 'ghost'} 
              size="icon" 
              className="w-14 h-14 rounded-xl"
              onClick={() => setAmbientSound('none')}
            >
              <VolumeX className="w-6 h-6" />
            </Button>
            <Button 
              variant={ambientSound === 'rain' ? 'default' : 'ghost'} 
              size="icon" 
              className="w-14 h-14 rounded-xl"
              onClick={() => setAmbientSound('rain')}
            >
              <CloudRain className="w-6 h-6" />
            </Button>
            <Button 
              variant={ambientSound === 'whiteNoise' ? 'default' : 'ghost'} 
              size="icon" 
              className="w-14 h-14 rounded-xl"
              onClick={() => setAmbientSound('whiteNoise')}
            >
              <Wind className="w-6 h-6" />
            </Button>
            <Button 
              variant={ambientSound === 'cafe' ? 'default' : 'ghost'} 
              size="icon" 
              className="w-14 h-14 rounded-xl"
              onClick={() => setAmbientSound('cafe')}
            >
              <Coffee className="w-6 h-6" />
            </Button>
          </div>

          <div className="w-64 space-y-4">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Volume2 className="w-4 h-4" />
              <Slider 
                value={[volume * 100]} 
                onValueChange={(vals) => setVolume(vals[0] / 100)} 
                max={100} 
                className="flex-1"
              />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Ambient Volume</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-muted-foreground text-sm font-medium animate-fade-in delay-500 flex items-center gap-2">
        Press <kbd className="px-2 py-1 bg-accent rounded-md border text-xs">Space</kbd> to Pause/Resume
      </div>
    </div>
  );
};

export default FocusPage;
