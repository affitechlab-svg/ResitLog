import type { ReactNode } from "react";

type VarianChip = "isi" | "garis" | "garis-putus" | "tint";

interface PropsChip {
  varian?: VarianChip;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const GAYA_VARIAN: Record<VarianChip, string> = {
  isi: "bg-maroon text-ground font-extrabold",
  garis: "border border-field-border bg-white text-ink font-semibold",
  "garis-putus": "border-2 border-dashed border-maroon bg-transparent text-maroon font-semibold",
  tint: "bg-maroon-tint text-maroon font-semibold",
};

// Span bila statik (cth. label kategori dalam senarai rekod), butang bila boleh
// ditekan (cth. pembuka pemilih kategori). Elak <button> bersarang dalam baris
// yang sudah boleh diklik.
export default function Chip({
  varian = "garis",
  children,
  onClick,
  disabled,
  className = "",
}: PropsChip) {
  const kelas = `inline-flex items-center gap-1.5 px-3 py-2 text-[13px] leading-none disabled:opacity-[0.45] ${GAYA_VARIAN[varian]} ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} className={kelas}>
        {children}
      </button>
    );
  }

  return <span className={kelas}>{children}</span>;
}
