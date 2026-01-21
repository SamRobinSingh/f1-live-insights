import { motion, AnimatePresence } from 'framer-motion';
import { DriverPosition } from '@/types/f1';

interface DriverStandingsProps {
  drivers: DriverPosition[];
  selectedDriver: string | null;
  onSelectDriver: (id: string | null) => void;
}

function getCompoundClass(compound: string): string {
  const c = compound.toLowerCase();
  if (c.includes('soft')) return 'compound-soft';
  if (c.includes('medium')) return 'compound-medium';
  if (c.includes('hard')) return 'compound-hard';
  if (c.includes('intermediate') || c === 'inter') return 'compound-intermediate';
  if (c.includes('wet')) return 'compound-wet';
  return 'bg-muted text-muted-foreground';
}

function getPositionClass(position: number): string {
  if (position === 1) return 'p1';
  if (position === 2) return 'p2';
  if (position === 3) return 'p3';
  return '';
}

export function DriverStandings({ drivers, selectedDriver, onSelectDriver }: DriverStandingsProps) {
  return (
    <motion.div 
      className="glass-panel carbon-texture p-4 h-full overflow-hidden flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h3 className="font-f1 text-sm font-bold text-primary mb-4 tracking-wider">
        LIVE STANDINGS
      </h3>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {drivers.map((driver) => (
            <motion.div
              key={driver.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectDriver(selectedDriver === driver.id ? null : driver.id)}
              className={`standing-row cursor-pointer ${
                selectedDriver === driver.id ? 'bg-accent ring-1 ring-primary/50' : ''
              }`}
            >
              {/* Position */}
              <div className={`position-badge ${getPositionClass(driver.position)}`}>
                {driver.position}
              </div>

              {/* Team color bar */}
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: driver.color }}
              />

              {/* Driver info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-f1 text-sm font-bold truncate">
                    {driver.name}
                  </span>
                  <span className={`compound-badge ${getCompoundClass(driver.compound)}`}>
                    {driver.compound.charAt(0)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {driver.team}
                </div>
              </div>

              {/* Speed */}
              <div className="text-right">
                <div className="font-f1 text-sm font-bold">
                  {driver.speed}
                </div>
                <div className="text-xs text-muted-foreground">km/h</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {drivers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No race data loaded</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
