"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiChartBar, HiCreditCard, HiLink } from "react-icons/hi";
import Image from "next/image";
import logo from "@/public/logo.jpeg"

const navItems = [
  { label: "Dashboard", href: "/overview", icon: HiChartBar },
  { label: "Transactions", href: "/transactions", icon: HiCreditCard },
  { label: "Proofs", href: "/proofs", icon: HiLink },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="max-h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col py-6 px-4">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div>
            <Image src={logo} width={100} height={100} alt="logo" />
            <div className="text-lg font-bold tracking-tight text-black dark:text-zinc-50">
              Flare Accounting
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Accounting-ready payments
            </div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
              pathname === item.href
                ? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-zinc-50"
            }`}
          >
            <item.icon className="text-lg" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>System Operational</span>
          </div>
          &copy; {new Date().getFullYear()} Flare Accounting
        </div>
      </div>
    </aside>
  );
}
