import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedFormProps {
  children: ReactNode;
  className?: string;
}

// Staggered animation for form elements
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export function AnimatedFormContainer({ children, className }: AnimatedFormProps) {
  return (
    <motion.div
      className={cn("space-y-6", className)}
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function AnimatedFormItem({ children, className }: AnimatedFormProps) {
  return (
    <motion.div
      className={className}
      variants={formItemVariants}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedFormButton({ children, className }: AnimatedFormProps) {
  return (
    <motion.div
      className={className}
      variants={formItemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedFormSection({ children, className }: AnimatedFormProps) {
  return (
    <motion.section
      className={cn("p-4 rounded-lg", className)}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedErrorMessage({ children, className }: AnimatedFormProps) {
  return (
    <motion.div
      className={cn("text-red-500 text-sm", className)}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}