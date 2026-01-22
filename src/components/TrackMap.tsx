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
      className="glass-panel carbon-texture p-6 h-full min-h-[600px] relative overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Track Map SVG - Full size container */}
      <div className="flex-1 w-full flex items-center justify-center">
        <svg 
          viewBox={viewBox} 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '500px', maxHeight: '700px' }}
        >
          {/* Track outline glow */}
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--f1-red))"
            strokeWidth="16"
            strokeOpacity="0.15"
            className="track-line"
          />
          
          {/* Track outline */}
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="8"
            strokeOpacity="0.4"
            className="track-line"
          />
          
          {/* Track center line */}
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            strokeOpacity="0.7"
            className="track-line"
            strokeDasharray="12 6"
          />

          {/* Driver dots - rendered larger */}
          {driverDots.map((driver, index) => (
            <motion.g
              key={driver.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelectDriver(selectedDriver === driver.id ? null : driver.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer glow effect */}
              <circle
                cx={driver.svgX}
                cy={driver.svgY}
                r={selectedDriver === driver.id ? 28 : 18}
                fill={driver.color}
                opacity={0.25}
              />
              {/* Inner glow */}
              <circle
                cx={driver.svgX}
                cy={driver.svgY}
                r={selectedDriver === driver.id ? 18 : 12}
                fill={driver.color}
                opacity={0.5}
              />
              {/* Driver dot */}
              <circle
                cx={driver.svgX}
                cy={driver.svgY}
                r={selectedDriver === driver.id ? 12 : 8}
                fill={driver.color}
                stroke="white"
                strokeWidth="3"
              />
              {/* Position number inside dot */}
              <text
                x={driver.svgX}
                y={driver.svgY + 3}
                textAnchor="middle"
                fill="white"
                fontSize={selectedDriver === driver.id ? "10" : "7"}
                fontWeight="bold"
                fontFamily="Orbitron"
                style={{ pointerEvents: 'none' }}
              >
                {driver.position}
              </text>
              {/* Driver label on selection */}
              {selectedDriver === driver.id && (
                <>
                  <rect
                    x={driver.svgX - 30}
                    y={driver.svgY - 35}
                    width="60"
                    height="18"
                    rx="4"
                    fill="hsl(var(--background))"
                    fillOpacity="0.9"
                    stroke={driver.color}
                    strokeWidth="1"
                  />
                  <text
                    x={driver.svgX}
                    y={driver.svgY - 22}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="Orbitron"
                  >
                    {driver.name}
                  </text>
                </>
              )}
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="w-4 h-4 rounded-full bg-primary border-2 border-white" />
        <span className="font-f1 text-xs">CLICK DRIVER TO SELECT</span>
      </div>
    </motion.div>
  );
}
