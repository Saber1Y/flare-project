import React from "react";

interface TableProps {
  columns: { key: string; header: string; className?: string }[];
  data: Record<string, React.ReactNode>[];
  className?: string;
}

export default function Table({ columns, data, className = "" }: TableProps) {
  // Mobile card view
  const MobileRow = ({ row, index }: { row: Record<string, React.ReactNode>; index: number }) => {
    // Skip columns that shouldn't show on mobile
    const visibleColumns = columns.filter(col => col.key !== 'select');
    
    return (
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-3 bg-white dark:bg-zinc-900">
        {/* First row: checkbox + key info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {row.select}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                {row.hash}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {row.date}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              {row.amount}
            </div>
            {row.recorded}
          </div>
        </div>
        
        {/* From/To addresses */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 mb-1">From:</div>
            <div className="truncate">{row.from}</div>
          </div>
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 mb-1">To:</div>
            <div className="truncate">{row.to}</div>
          </div>
        </div>
        
        {/* Category and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:w-auto">
            <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">Category:</label>
            {row.category}
          </div>
          <div className="w-full sm:w-auto">
            {row.actions}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile card view */}
      <div className="lg:hidden">
        {data.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No data available
          </div>
        ) : (
          <div className="px-1">
            {data.map((row, index) => (
              <MobileRow key={index} row={row} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div className={`hidden lg:block overflow-x-auto ${className}`}>
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
    </>
  );
}
