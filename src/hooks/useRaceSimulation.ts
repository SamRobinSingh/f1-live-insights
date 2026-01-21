import { useState, useCallback, useRef, useEffect } from 'react';
import { RaceData, DriverPosition } from '@/types/f1';

interface UseRaceSimulationProps {
  raceData: RaceData | null;
}

interface UseRaceSimulationReturn {
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  driverPositions: DriverPosition[];
  leader: DriverPosition | null;
  chaser: DriverPosition | null;
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  setTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  maxTime: number;
}

export function useRaceSimulation({ raceData }: UseRaceSimulationProps): UseRaceSimulationReturn {
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const timeline = raceData?.timeline || [];
  const maxTime = timeline.length > 0 ? timeline[timeline.length - 1] : 0;
  const currentTime = timeline[currentTimeIndex] || 0;

  // Calculate driver positions at current time
  const driverPositions: DriverPosition[] = raceData
    ? Object.entries(raceData.drivers).map(([id, driver]) => ({
        id,
        name: driver.name,
        team: driver.team,
        color: driver.color,
        compound: driver.compound,
        x: driver.x[currentTimeIndex],
        y: driver.y[currentTimeIndex],
        speed: driver.speed[currentTimeIndex] || 0,
        position: 0, // Will be calculated below
      }))
    : [];

  // Sort by track position (simplified - using distance from start)
  const sortedPositions = [...driverPositions]
    .filter(d => d.x !== null && d.y !== null)
    .sort((a, b) => {
      // Simple heuristic: higher speed generally means leading
      // In a real app, we'd calculate distance along track
      return b.speed - a.speed;
    })
    .map((d, index) => ({ ...d, position: index + 1 }));

  const leader = sortedPositions[0] || null;
  const chaser = sortedPositions[1] || null;

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !raceData) return;

    const animate = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      
      const delta = timestamp - lastUpdateRef.current;
      
      // Update every 100ms adjusted by playback speed
      if (delta >= 100 / playbackSpeed) {
        lastUpdateRef.current = timestamp;
        
        setCurrentTimeIndex(prev => {
          const next = prev + 1;
          if (next >= timeline.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, timeline.length, raceData]);

  // Reset when race data changes
  useEffect(() => {
    setCurrentTimeIndex(0);
    setIsPlaying(false);
  }, [raceData]);

  const play = useCallback(() => {
    lastUpdateRef.current = 0;
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setTime = useCallback((time: number) => {
    const index = timeline.findIndex(t => t >= time);
    setCurrentTimeIndex(index >= 0 ? index : 0);
  }, [timeline]);

  return {
    currentTime,
    isPlaying,
    playbackSpeed,
    driverPositions: sortedPositions,
    leader,
    chaser,
    play,
    pause,
    togglePlayback,
    setTime,
    setPlaybackSpeed,
    maxTime,
  };
}
