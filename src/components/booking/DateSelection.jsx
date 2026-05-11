import { motion } from "framer-motion";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { CalendarDays } from "lucide-react";

export default function DateSelection({ selectedDate, onSelect }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const getDayLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Pick a Date</span>
        </div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          When works for you?
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((date, i) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const isSelected = selectedDate === dateStr;

          return (
            <motion.button
              key={dateStr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(dateStr)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl border transition-all duration-200 min-w-[80px] ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              <span className={`text-xs font-medium uppercase tracking-wider ${
                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                {getDayLabel(date)}
              </span>
              <span className={`text-2xl font-bold ${
                isSelected ? "text-primary-foreground" : "text-foreground"
              }`}>
                {format(date, "d")}
              </span>
              <span className={`text-xs ${
                isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {format(date, "MMM")}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}