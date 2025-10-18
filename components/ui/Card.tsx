/**
 * Card Component
 * Reusable card component matching Figma design system
 */

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-white shadow-md",
  elevated: "bg-white shadow-xl",
  outlined: "bg-white border-2 border-gray-200",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  hover = false,
  onClick,
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-200";
  const hoverStyles = hover ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer" : "";
  const clickableStyles = onClick ? "cursor-pointer" : "";

  const Component = hover || onClick ? motion.div : "div";

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...(hover || onClick ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } } : {})}
    >
      {children}
    </Component>
  );
}
