"use client";

import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

// A reusable component for the scroll-telling feature sections
export default function FeatureShowcase({ title, description, visualPlaceholderText, reverse = false }) {
  return (
    <motion.section 
      className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={`space-y-4 ${reverse ? 'md:order-2' : ''}`}>
        <h2 className="text-4xl font-bold text-white">{title}</h2>
        <p className="text-lg text-athens-gray/80">{description}</p>
      </div>
      <GlassCard className={`min-h-[300px] flex items-center justify-center p-8 ${reverse ? 'md:order-1' : ''}`}>
        <p className="text-muted-foreground italic">{visualPlaceholderText}</p>
      </GlassCard>
    </motion.section>
  );
}