"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] });

const LINKS = [
  { href: "/", label: "Tabla" },
  { href: "/partidos", label: "Partidos" },
  { href: "/usuarios", label: "Participantes" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="bg-stone-950 border-b-2 border-amber-500">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className={`${bebasNeue.className} text-2xl tracking-wide uppercase text-white`}
        >
          Quiniela{" "}
          <span style={{ color: "#E2001A" }}>Mun</span>
          <span style={{ color: "#3457E8" }}>dia</span>
          <span style={{ color: "#00A859" }}>l 26</span>
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
                    ? "bg-amber-500 text-stone-950"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
