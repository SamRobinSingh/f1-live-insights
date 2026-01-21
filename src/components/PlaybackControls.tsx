import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Gauge } from 'lucide-react';

interface PlaybackControlsProps {
  currentTime: number;
  maxTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onTogglePlayback: () => void;
  onSetTime: (time: number) => void;
  onSetSpeed: (speed: number) => void;
}

const SPEEDS = [0.5, 1, 2, 4, 8];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function PlaybackControls({
  currentTime,
  maxTime,
  isPlaying,
  playbackSpeed,
  onTogglePlayback,
  onSetTime,
  onSetSpeed,
}: PlaybackControlsProps) {
  const progress = maxTime > 0 ? (currentTime / maxTime) * 100 : 0;

  return (
    <motion.div 
      className="glass-panel carbon-texture p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Timeline */}
      <div className="mb-4">
        <div 
          className="timeline-track"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSetTime(percent * maxTime);
          }}
        >
          <motion.div 
            className="timeline-progress"
            style={{ width: `${progress}%` }}
            layoutId="timeline-progress"
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(maxTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Skip back */}
          <button
            onClick={() => onSetTime(Math.max(0, currentTime - 10))}
            className="btn-f1-secondary p-2"
            title="Back 10s"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlayback}
            className="btn-f1 p-3 rounded-full glow-red"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Skip forward */}
          <button
            onClick={() => onSetTime(Math.min(maxTime, currentTime + 10))}
            className="btn-f1-secondary p-2"
            title="Forward 10s"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            {SPEEDS.map((speed) => (
              <button
                key={speed}
                onClick={() => onSetSpeed(speed)}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  playbackSpeed === speed
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
