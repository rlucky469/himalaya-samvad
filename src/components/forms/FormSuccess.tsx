"use client";

import { motion } from "motion/react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FormSuccess({ title, message, againLabel, onAgain }: { title: string; message: string; againLabel?: string; onAgain?: () => void }) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="flex flex-col items-center gap-4 rounded-card border border-nature/25 bg-nature-soft px-6 py-12 text-center"
    >
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="inline-flex size-16 items-center justify-center rounded-full bg-nature text-white">
        <CheckCircle2 className="size-8" />
      </motion.span>
      <h3 className="text-2xl">{title}</h3>
      <p className="max-w-md text-ink-soft">{message}</p>
      {onAgain && againLabel && (
        <Button type="button" variant="outline" size="sm" onClick={onAgain} icon={<RotateCcw />} iconPosition="start">
          {againLabel}
        </Button>
      )}
    </motion.div>
  );
}
