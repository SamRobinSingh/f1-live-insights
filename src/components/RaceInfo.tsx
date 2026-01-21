import { motion } from 'framer-motion';
import { Flag, Timer, Zap } from 'lucide-react';
import { DriverPosition } from '@/types/f1';

interface RaceInfoProps {
  eventName: string | null;
  leader: DriverPosition | null;
  currentTime: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function RaceInfo({ eventName, leader, currentTime }: RaceInfoProps) {
  return (
    <motion.div 
      className="glass-panel carbon-texture p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Event Name */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Flag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Grand Prix</div>
            <div className="font-f1 text-sm font-bold truncate">
              {eventName || 'No Race Loaded'}
            </div>
          </div>
        </div>

        {/* Race Time */}
        <div className="flex items-center gap-3 justify-center">
          <div className="p-2 rounded-lg bg-primary/10">
            <Timer className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Race Time</div>
            <div className="font-f1 text-sm font-bold font-mono">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Leader */}
        <div className="flex items-center gap-3 justify-end">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider text-right">Leader</div>
            {leader ? (
              <div className="flex items-center gap-2 justify-end">
                <span className="font-f1 text-sm font-bold">{leader.name}</span>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: leader.color }}
                />
              </div>
            ) : (
              <div className="font-f1 text-sm font-bold text-muted-foreground">---</div>
            )}
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
