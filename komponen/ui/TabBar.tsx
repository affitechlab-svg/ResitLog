"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, BarChart3, Settings } from "lucide-react";
import type { ComponentType } from "react";

interface DestinasiTab {
  label: string;
  laluan: string;
  Ikon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

const DESTINASI: DestinasiTab[] = [
  { label: "Utama", laluan: "/utama", Ikon: Home },
  { label: "Rekod", laluan: "/rekod", Ikon: List },
  { label: "Ringkasan", laluan: "/ringkasan", Ikon: BarChart3 },
  { label: "Tetapan", laluan: "/tetapan", Ikon: Settings },
];

export default function TabBar() {
  const laluanSemasa = usePathname();

  return (
    <nav className="grid grid-cols-4 border-t-2 border-ink" aria-label="Navigasi utama">
      {DESTINASI.map(({ label, laluan, Ikon }) => {
        const aktif = laluanSemasa === laluan || laluanSemasa.startsWith(`${laluan}/`);
        return (
          <Link
            key={laluan}
            href={laluan}
            aria-current={aktif ? "page" : undefined}
            className={`flex h-[68px] flex-col items-center justify-center gap-1.5 ${
              aktif ? "text-maroon" : "text-disabled"
            }`}
          >
            <Ikon size={22} strokeWidth={2} />
            <span
              className={`text-[10px] uppercase tracking-wider ${
                aktif ? "font-extrabold" : "font-semibold"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
