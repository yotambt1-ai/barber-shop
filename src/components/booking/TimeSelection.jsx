import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00"
];

export default function TimeSelection({ selectedTime, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Select a Time</span>
        </div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          What time suits you?
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {timeSlots.map((time, i) => {
          const isSelected = selectedTime === time;

          return (
            <motion.button
              key={time}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelect(time)}
              className={`py-4 px-3 rounded-xl border text-center transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              <span className={`text-lg font-semibold ${
                isSelected ? "text-primary-foreground" : "text-foreground"
              }`}>
                {time}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}