import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Animation variants for better performance and code organization
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut"
    }
  })
};

const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut"
    }
  })
};

const fadeInSectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export function AnimatedCard({ children, delay = 0, className }: AnimatedCardProps) {
  return (
    <motion.div
      className={cn("transform", className)}
      variants={fadeInUpVariant}
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      layout // Added for smoother layout animations
    >
      <Card className="h-full">
        {children}
      </Card>
    </motion.div>
  );
}

export function AnimatedContainer({ children, delay = 0, className }: AnimatedCardProps) {
  return (
    <motion.div
      variants={fadeInVariant}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={className}
      layout // Added for smoother layout animations
    >
      {children}
    </motion.div>
  );
}

export function AnimatedButton({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSection({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.section
      variants={fadeInSectionVariant}
      initial="hidden"
      animate="visible"
      className={className}
      layout // Added for smoother layout animations
    >
      {children}
    </motion.section>
  );
}