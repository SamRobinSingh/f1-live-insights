import { motion } from 'framer-motion';

export function F1Logo() {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <span className="font-f1 text-2xl font-black tracking-tighter text-primary">
          F1
        </span>
        <motion.div 
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        />
      </div>
      <span className="font-f1 text-lg font-semibold text-foreground/80 tracking-widest">
        PRO MAX
      </span>
    </motion.div>
  );
}
