"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BlurIn = ({ children, className, variant, duration = 0.5 }) => {
  const variants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      transition={{ duration }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.h1>
  );
};

export default BlurIn;