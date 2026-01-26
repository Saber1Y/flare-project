"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiChartBar, HiCreditCard, HiLink } from "react-icons/hi";
import Image from "next/image";
import logo from "@/public/logo.jpeg";

const navItems = [
  { label: "Dashboard", href: "/overview", icon: HiChartBar },
  { label: "Transactions", href: "/transactions", icon: HiCreditCard },
  { label: "Proofs", href: "/proofs", icon: HiLink },
];

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function Sidebar({ isOpen = true, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (setIsOpen && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full py-6 px-4">
          <div className="mb-8 px-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image src={logo} width={40} height={40} alt="logo" />
                <div>
                  <div className="text-lg font-bold tracking-tight text-black dark:text-zinc-50">
                    Flare Accounting
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Accounting-ready payments
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen?.(false)}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
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
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>System Operational</span>
              </div>
              &copy; {new Date().getFullYear()} Flare Accounting
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:max-h-full lg:bg-white lg:dark:bg-zinc-900 lg:border-r lg:border-zinc-200 lg:dark:border-zinc-800 lg:py-6 lg:px-4">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <Image src={logo} width={50} height={50} alt="logo" />
            <div>
              <div className="text-lg font-bold tracking-tight text-black dark:text-zinc-50">
                Flare Accounting
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Accounting-ready payments
              </div>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
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
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>System Operational</span>
            </div>
            &copy; {new Date().getFullYear()} Flare Accounting
          </div>
        </div>
      </aside>
    </>
  );
}
