import { motion } from 'framer-motion';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { CIRCUITS, YEARS, Circuit } from '@/types/f1';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RaceSelectorProps {
  year: number;
  circuit: string;
  onYearChange: (year: number) => void;
  onCircuitChange: (circuit: string) => void;
  onLoad: () => void;
  isLoading: boolean;
}

export function RaceSelector({
  year,
  circuit,
  onYearChange,
  onCircuitChange,
  onLoad,
  isLoading,
}: RaceSelectorProps) {
  return (
    <motion.div 
      className="glass-panel carbon-texture p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <Select value={year.toString()} onValueChange={(v) => onYearChange(parseInt(v))}>
            <SelectTrigger className="w-[100px] bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <Select value={circuit} onValueChange={onCircuitChange}>
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CIRCUITS.map((c: Circuit) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={onLoad}
          disabled={isLoading}
          className="btn-f1 flex items-center gap-2 glow-red"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Load Race'
          )}
        </button>
      </div>
    </motion.div>
  );
}
