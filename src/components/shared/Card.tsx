"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  goldBorder?: boolean;
}

export function Card({
  className,
  hover = true,
  goldBorder = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "group relative rounded bg-white p-6 shadow-sm",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className
      )}
      {...props}
    >
      {goldBorder && (
        <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-eccellere-gold transition-transform duration-300 group-hover:scale-x-100" />
      )}
      {children}
    </div>
  );
}

interface AnimatedCardProps extends CardProps {
  index?: number;
}

export function AnimatedCard({
  index = 0,
  children,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}
