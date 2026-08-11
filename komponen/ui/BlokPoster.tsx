import type { ReactNode } from "react";

interface PropsBlokPoster {
  label: string;
  nilai: string; // sudah diformat, cth. hasil formatRM()
  meta?: ReactNode;
  besar?: boolean; // true = gaya skrin Utama (52px); false = gaya Ringkasan (34px)
  className?: string;
}

export default function BlokPoster({
  label,
  nilai,
  meta,
  besar = false,
  className = "",
}: PropsBlokPoster) {
  return (
    <div
      className={`bg-maroon px-5 text-ground ${
        besar ? "pb-6 pt-[26px]" : "py-[18px]"
      } ${className}`}
    >
      <div className="text-[11px] font-semibold uppercase tracking-widest opacity-85">
        {label}
      </div>
      <div
        className={`mt-2 font-extrabold leading-none tracking-tight ${
          besar ? "text-[52px]" : "text-[34px]"
        }`}
      >
        {nilai}
      </div>
      {meta && <div className="mt-2.5 text-[13px] opacity-90">{meta}</div>}
    </div>
  );
}
