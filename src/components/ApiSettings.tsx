import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Server, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ApiSettingsProps {
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
  isConnected: boolean;
}

export function ApiSettings({ apiUrl, onApiUrlChange, isConnected }: ApiSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(apiUrl);

  const handleSave = () => {
    onApiUrlChange(tempUrl);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-f1-secondary p-2 relative"
        title="API Settings"
      >
        <Settings className="w-4 h-4" />
        <div 
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-card ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-80 glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-primary" />
              <span className="font-f1 text-sm font-bold">Backend API</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  API URL
                </label>
                <Input
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="bg-secondary border-border"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  {isConnected ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">Connected</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 text-red-500" />
                      <span className="text-red-500">Disconnected</span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-f1-secondary px-3 py-1 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-f1 px-3 py-1 text-xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
