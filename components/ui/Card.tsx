import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "metric" | "border";
}

export default function Card({ children, className = "", variant = "default" }: CardProps) {
  const baseStyles = "rounded-xl shadow-sm";
  
  const variantStyles = {
    default: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
    metric: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
    border: "bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
