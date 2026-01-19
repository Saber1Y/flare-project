"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/overview" },
  { label: "Wallets", href: "/wallets" },
  { label: "Transactions", href: "/transactions" },
  { label: "Accounting", href: "/accounting" },
  { label: "Statements", href: "/statements" },
  { label: "Proofs", href: "/proofs" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-60 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col py-8 px-4">
      <div className="mb-8 text-2xl font-bold tracking-tight text-black dark:text-zinc-50">
        Flare Accounting
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
              pathname === item.href
                ? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-zinc-50"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-xs text-zinc-400 pt-8">
        &copy; {new Date().getFullYear()} Flare Accounting
      </div>
    </aside>
  );
}
