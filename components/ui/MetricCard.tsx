import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  className = ""
}: MetricCardProps) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              {trend === "up" && (
                <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend === "down" && (
                <svg className="w-4 h-4 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className={`text-sm font-medium ${
                trend === "up" ? "text-green-600 dark:text-green-400" :
                trend === "down" ? "text-red-600 dark:text-red-400" :
                "text-zinc-600 dark:text-zinc-400"
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-zinc-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
