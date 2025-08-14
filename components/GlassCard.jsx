import { cn } from "@/lib/utils";

// A simple, reusable component for the glassmorphism effect
export default function GlassCard({ children, className }) {
  return (
    <div
      className={cn(
        `
        rounded-2xl border border-white/10 
        bg-shark/20 shadow-2xl backdrop-blur-xl
        `,
        className
      )}
    >
      {children}
    </div>
  );
}