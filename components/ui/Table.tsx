import React from "react";

interface TableProps {
  columns: { key: string; header: string; className?: string }[];
  data: Record<string, React.ReactNode>[];
  className?: string;
}

export default function Table({ columns, data, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-zinc-200 dark:border-zinc-800">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100 ${column.className || ""}`}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          No data available
        </div>
      )}
    </div>
  );
}
