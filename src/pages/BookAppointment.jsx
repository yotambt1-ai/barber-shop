// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/api/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Scissors, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import BarberSelection from "../components/booking/BarberSelection";
import DateSelection from "../components/booking/DateSelection";
import TimeSelection from "../components/booking/TimeSelection";
import CustomerForm from "../components/booking/CustomerForm";
import SuccessMessage from "../components/booking/SuccessMessage";

const STEPS = ["barber", "date", "time", "details", "success"];

export default function BookAppointment() {
  const { toast } = useToast();
  const [step, setStep] = useState("barber");
  const [barber, setBarber] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepIndex = STEPS.indexOf(step);

  const handleBarberSelect = (name) => {
    setBarber(name);
    setStep("date");
  };

  const handleDateSelect = (d) => {
    setDate(d);
    setStep("time");
  };

  const handleTimeSelect = (t) => {
    setTime(t);
    setStep("details");
  };

  const handleSubmit = async ({ customer_name, phone }) => {
    setIsSubmitting(true);
    try {
      await apiClient.appointments.create({
        barber,
        date,
        time,
        customer_name,
        phone,
      });
      setCustomerName(customer_name);
      setStep("success");
    } catch (error) {
      console.error("Booking failed:", error.message);
      toast({
        title: "Booking Failed",
        description: error.message === "The selected time slot is already booked." 
          ? "This slot is taken, please pick another time." 
          : (error.message || "Could not create your appointment. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleReset = () => {
    setBarber(null);
    setDate(null);
    setTime(null);
    setCustomerName("");
    setStep("barber");
  };

  return (
    <div className="min-h-screen bg-background font-inter text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== "barber" && step !== "success" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-semibold">
                Book Your Haircut
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      {step !== "success" && (
        <div className="max-w-lg mx-auto px-4 pt-6">
          <div className="flex gap-1.5">
            {STEPS.slice(0, 4).map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i <= currentStepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === "barber" && (
            <motion.div
              key="barber"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BarberSelection onSelect={handleBarberSelect} />
            </motion.div>
          )}
          {step === "date" && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DateSelection
                selectedDate={date}
                onSelect={handleDateSelect}
              />
            </motion.div>
          )}
          {step === "time" && (
            <motion.div
              key="time"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TimeSelection
                selectedTime={time}
                onSelect={handleTimeSelect}
              />
            </motion.div>
          )}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CustomerForm
                barber={barber}
                date={date}
                time={time}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <SuccessMessage
                barber={barber}
                customerName={customerName}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}