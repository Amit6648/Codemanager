"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center w-full min-h-[60vh] justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="space-y-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
          Bring Order to Your Code.
        </h1>
        <p className="text-lg md:text-xl text-athens-gray/80 max-w-2xl mx-auto">
          The elegant, intuitive home for every code snippet.
        </p>
        <Button size="lg" className="font-bold text-lg px-8 py-6 bg-science-blue hover:bg-science-blue/90 text-white">
          Join the Beta
        </Button>
      </motion.div>

      {/* This is the placeholder for the main interactive 3D visual */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-white/5 animate-pulse">
            {/* [Placeholder for Three.js / Spline 3D canvas of the file tree] */}
        </div>
      </div>
    </section>
  );
}