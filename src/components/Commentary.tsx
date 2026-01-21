import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { DriverPosition, CommentaryRequest } from '@/types/f1';

interface CommentaryProps {
  leader: DriverPosition | null;
  chaser: DriverPosition | null;
  currentTime: number;
  isPlaying: boolean;
  apiUrl: string;
}

export function Commentary({ leader, chaser, currentTime, isPlaying, apiUrl }: CommentaryProps) {
  const [commentary, setCommentary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const lastRequestTime = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || !leader || isMuted) return;

    // Request commentary every 15 seconds
    const timeSinceLastRequest = currentTime - lastRequestTime.current;
    if (timeSinceLastRequest < 15) return;

    lastRequestTime.current = currentTime;

    const fetchCommentary = async () => {
      setIsLoading(true);

      const request: CommentaryRequest = {
        time_val: currentTime,
        leader_name: leader.name,
        leader_team: leader.team,
        leader_compound: leader.compound,
        leader_speed: leader.speed,
        chaser_name: chaser?.name || 'N/A',
        gap: chaser ? Math.abs((leader.x || 0) - (chaser.x || 0)) : 1000,
      };

      try {
        const response = await fetch(`${apiUrl}/commentary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        const data = await response.json();
        setCommentary(data.commentary || 'The race continues...');
      } catch (error) {
        setCommentary('Connection to commentary system lost...');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentary();
  }, [currentTime, isPlaying, leader, chaser, isMuted, apiUrl]);

  return (
    <motion.div 
      className="glass-panel carbon-texture p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying && !isMuted ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
          <h3 className="font-f1 text-sm font-bold text-primary tracking-wider">
            LIVE COMMENTARY
          </h3>
        </div>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="btn-f1-secondary p-2"
          title={isMuted ? 'Enable commentary' : 'Mute commentary'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={commentary}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="min-h-[60px] flex items-center"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm italic">Analyzing the race...</span>
            </div>
          ) : commentary ? (
            <p className="text-sm leading-relaxed text-foreground/90 italic">
              "{commentary}"
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {isMuted 
                ? 'Commentary muted. Click the mic to enable.'
                : 'Waiting for race action...'}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
