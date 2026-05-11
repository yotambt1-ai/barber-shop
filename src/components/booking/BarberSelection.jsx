import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

const barbers = [
  {
    name: "Matan",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop&crop=face",
    specialty: "Classic & Modern Cuts",
  },
  {
    name: "Liav",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&crop=face",
    specialty: "Fades & Beard Styling",
  },
];

export default function BarberSelection({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Scissors className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Choose Your Barber</span>
        </div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Who's cutting today?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {barbers.map((barber, i) => (
          <motion.button
            key={barber.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(barber.name)}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={barber.image}
                alt={barber.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-display font-semibold text-white mb-1">
                {barber.name}
              </h3>
              <p className="text-sm text-white/70">{barber.specialty}</p>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/0 group-hover:bg-primary/100 flex items-center justify-center transition-all duration-300">
              <Scissors className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}