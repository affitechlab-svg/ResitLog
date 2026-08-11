import type { InputHTMLAttributes } from "react";

interface PropsMedan
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  tegas?: boolean; // sempadan + teks maroon, cth. medan Jumlah pada skrin Semak
  ralat?: string;
  className?: string;
}

export default function Medan({
  label,
  tegas = false,
  ralat,
  id,
  className = "",
  ...selebihnya
}: PropsMedan) {
  const idMedan = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const idRalat = `${idMedan}-ralat`;

  return (
    <label htmlFor={idMedan} className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink">
        {label}
      </span>
      <input
        id={idMedan}
        {...selebihnya}
        aria-invalid={Boolean(ralat)}
        aria-describedby={ralat ? idRalat : undefined}
        className={`box-border h-[46px] w-full bg-white px-3 text-base font-semibold ${
          tegas ? "border-2 border-maroon text-maroon" : "border-2 border-ink text-ink"
        }`}
      />
      {ralat && (
        <span id={idRalat} className="text-xs font-medium text-maroon">
          {ralat}
        </span>
      )}
    </label>
  );
}
