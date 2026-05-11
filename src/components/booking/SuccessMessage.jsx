import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CalendarCheck, ArrowLeft } from "lucide-react";

export default function SuccessMessage({ barber, customerName, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          You're all set!
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Appointment booked successfully for{" "}
          <span className="text-foreground font-medium">{customerName}</span>{" "}
          with{" "}
          <span className="text-primary font-medium">{barber}</span>!
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20">
        <CalendarCheck className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">See you soon!</span>
      </div>

      <div className="pt-4">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-border text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Book Another Appointment
        </Button>
      </div>
    </motion.div>
  );
}