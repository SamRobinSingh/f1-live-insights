import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrackMap as TrackMapType, DriverPosition } from '@/types/f1';

interface TrackMapProps {
  trackMap: TrackMapType | null;
  drivers: DriverPosition[];
  selectedDriver: string | null;
  onSelectDriver: (id: string | null) => void;
}

export function TrackMap({ trackMap, drivers, selectedDriver, onSelectDriver }: TrackMapProps) {
  const { pathD, viewBox, driverDots } = useMemo(() => {
    if (!trackMap || trackMap.x.length === 0) {
      return { pathD: '', viewBox: '0 0 100 100', driverDots: [] };
    }

    const xs = trackMap.x.filter(v => v !== null) as number[];
    const ys = trackMap.y.filter(v => v !== null) as number[];
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    
    // Create SVG path
    let path = '';
    for (let i = 0; i < trackMap.x.length; i++) {
      const x = trackMap.x[i];
      const y = trackMap.y[i];
      if (x === null || y === null) continue;
      
      const normalizedX = x - minX + padding;
      const normalizedY = y - minY + padding;
      
      if (path === '') {
        path = `M ${normalizedX} ${normalizedY}`;
      } else {
        path += ` L ${normalizedX} ${normalizedY}`;
      }
    }
    path += ' Z';

    // Calculate driver positions
    const dots = drivers
      .filter(d => d.x !== null && d.y !== null)
      .map(d => ({
        ...d,
        svgX: (d.x as number) - minX + padding,
        svgY: (d.y as number) - minY + padding,
      }));

    return {
      pathD: path,
      viewBox: `0 0 ${width} ${height}`,
      driverDots: dots,
    };
  }, [trackMap, drivers]);

  if (!trackMap) {
    return (
      <div className="glass-panel carbon-texture flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="font-f1 text-xl text-muted-foreground mb-2">NO TRACK DATA</div>
          <p className="text-sm text-muted-foreground/60">Load a race to view the circuit</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="glass-panel carbon-texture p-4 h-full min-h-[400px] relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Track Map SVG */}
      <svg 
        viewBox={viewBox} 
        className="w-full h-full"
        style={{ maxHeight: '500px' }}
      >
        {/* Track outline glow */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--f1-red))"
          strokeWidth="12"
          strokeOpacity="0.1"
          className="track-line"
        />
        
        {/* Track outline */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="4"
          strokeOpacity="0.3"
          className="track-line"
        />
        
        {/* Track center line */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          strokeOpacity="0.6"
          className="track-line"
          strokeDasharray="8 4"
        />

        {/* Driver dots */}
        {driverDots.map((driver, index) => (
          <motion.g
            key={driver.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => onSelectDriver(selectedDriver === driver.id ? null : driver.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Glow effect */}
            <circle
              cx={driver.svgX}
              cy={driver.svgY}
              r={selectedDriver === driver.id ? 20 : 12}
              fill={driver.color}
              opacity={0.3}
            />
            {/* Driver dot */}
            <circle
              cx={driver.svgX}
              cy={driver.svgY}
              r={selectedDriver === driver.id ? 10 : 6}
              fill={driver.color}
              stroke="white"
              strokeWidth="2"
            />
            {/* Driver label */}
            {selectedDriver === driver.id && (
              <text
                x={driver.svgX}
                y={driver.svgY - 18}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                fontFamily="Orbitron"
              >
                {driver.name}
              </text>
            )}
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span>Click driver to select</span>
      </div>
    </motion.div>
  );
}
