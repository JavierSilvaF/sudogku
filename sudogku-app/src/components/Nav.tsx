"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Tabla" },
  { href: "/partidos", label: "Partidos" },
  { href: "/usuarios", label: "Participantes" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Quiniela Mundial 2026
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  active
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
