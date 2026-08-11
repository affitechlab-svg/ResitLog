import type { ReactNode } from "react";

interface PropsKeadaanKosong {
  tajuk: string;
  mesej: string; // mesti beritahu pengguna apa nak buat seterusnya
  aksi?: ReactNode; // cth. <Butang lebarPenuh={false}>...</Butang>
  ikon?: ReactNode;
  className?: string;
}

export default function KeadaanKosong({
  tajuk,
  mesej,
  aksi,
  ikon,
  className = "",
}: PropsKeadaanKosong) {
  return (
    <div className={`flex flex-col items-center gap-3 px-6 py-16 text-center ${className}`}>
      {ikon}
      <div className="text-base font-extrabold text-ink">{tajuk}</div>
      <p className="max-w-[280px] text-sm leading-relaxed text-muted">{mesej}</p>
      {aksi}
    </div>
  );
}
