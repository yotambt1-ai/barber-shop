import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Phone, Loader2, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

export default function CustomerForm({ barber, date, time, onSubmit, isSubmitting }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ customer_name: name, phone });
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
          <CalendarCheck className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Almost Done</span>
        </div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Confirm your details
        </h2>
      </div>

      {/* Summary */}
      <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Barber</span>
          <span className="font-medium text-foreground">{barber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium text-foreground">{format(new Date(date), "EEEE, MMM d")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium text-foreground">{time}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-10 bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="pl-10 bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !name || !phone}
          className="w-full h-12 bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </form>
    </motion.div>
  );
}