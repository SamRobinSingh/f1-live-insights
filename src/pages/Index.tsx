import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { F1Logo } from '@/components/F1Logo';
import { RaceSelector } from '@/components/RaceSelector';
import { TrackMap } from '@/components/TrackMap';
import { PlaybackControls } from '@/components/PlaybackControls';
import { DriverStandings } from '@/components/DriverStandings';
import { Commentary } from '@/components/Commentary';
import { RaceInfo } from '@/components/RaceInfo';
import { ApiSettings } from '@/components/ApiSettings';
import { useRaceSimulation } from '@/hooks/useRaceSimulation';
import { RaceData, CIRCUITS } from '@/types/f1';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_API_URL = 'http://localhost:8000';

export default function Index() {
  const { toast } = useToast();
  
  // API state
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [isConnected, setIsConnected] = useState(false);
  
  // Race selection state
  const [year, setYear] = useState(2024);
  const [circuit, setCircuit] = useState(CIRCUITS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [raceData, setRaceData] = useState<RaceData | null>(null);
  
  // Driver selection
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  
  // Simulation hook
  const simulation = useRaceSimulation({ raceData });

  // Check API connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${apiUrl}/`);
        const data = await response.json();
        setIsConnected(data.status === 'F1 Pro Max API Online');
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  // Load race data
  const loadRace = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/load_race`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, circuit }),
      });

      if (!response.ok) {
        throw new Error('Failed to load race data');
      }

      const data: RaceData = await response.json();
      setRaceData(data);
      setSelectedDriver(null);
      
      toast({
        title: 'Race Loaded',
        description: `${data.event_name} data is ready for simulation`,
      });
    } catch (error) {
      toast({
        title: 'Error Loading Race',
        description: 'Make sure the backend API is running on ' + apiUrl,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background carbon-texture">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <F1Logo />
          <div className="flex items-center gap-4">
            <RaceSelector
              year={year}
              circuit={circuit}
              onYearChange={setYear}
              onCircuitChange={setCircuit}
              onLoad={loadRace}
              isLoading={isLoading}
            />
            <ApiSettings
              apiUrl={apiUrl}
              onApiUrlChange={setApiUrl}
              isConnected={isConnected}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Race Info Bar */}
        <div className="mb-6">
          <RaceInfo
            eventName={raceData?.event_name || null}
            leader={simulation.leader}
            currentTime={simulation.currentTime}
          />
        </div>

        {/* Main Grid - Full width track with sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
          {/* Track Map - Takes 3 columns on xl screens */}
          <div className="xl:col-span-3 h-[calc(100vh-280px)] min-h-[600px]">
            <TrackMap
              trackMap={raceData?.track_map || null}
              drivers={simulation.driverPositions}
              selectedDriver={selectedDriver}
              onSelectDriver={setSelectedDriver}
            />
          </div>

          {/* Driver Standings - 1 column sidebar */}
          <div className="xl:col-span-1 h-[calc(100vh-280px)] min-h-[600px]">
            <DriverStandings
              drivers={simulation.driverPositions}
              selectedDriver={selectedDriver}
              onSelectDriver={setSelectedDriver}
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Playback Controls */}
          <PlaybackControls
            currentTime={simulation.currentTime}
            maxTime={simulation.maxTime}
            isPlaying={simulation.isPlaying}
            playbackSpeed={simulation.playbackSpeed}
            onTogglePlayback={simulation.togglePlayback}
            onSetTime={simulation.setTime}
            onSetSpeed={simulation.setPlaybackSpeed}
          />

          {/* Commentary */}
          <Commentary
            leader={simulation.leader}
            chaser={simulation.chaser}
            currentTime={simulation.currentTime}
            isPlaying={simulation.isPlaying}
            apiUrl={apiUrl}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>F1 Pro Max • Powered by FastF1 & AI Commentary</p>
        </div>
      </footer>
    </div>
  );
}
