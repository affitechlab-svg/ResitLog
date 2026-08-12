"use client";

import { Chip } from "@/komponen/ui";
import { KATEGORI, type KodKategori } from "@/lib/kategori";

interface PropsPemilihKategori {
  terbuka: boolean;
  kategoriTerpilih: KodKategori | null;
  onPilih: (kategori: KodKategori) => void;
  onTutup: () => void;
}

export default function PemilihKategori({
  terbuka,
  kategoriTerpilih,
  onPilih,
  onTutup,
}: PropsPemilihKategori) {
  if (!terbuka) return null;

  return (
    <div
      role="presentation"
      onClick={onTutup}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center"
    >
      <div
        role="dialog"
        aria-label="Pilih kategori"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] border-2 border-ink bg-ground p-5"
      >
        <h2 className="text-base font-extrabold text-ink">Pilih kategori</h2>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {KATEGORI.map((k) => (
            <Chip
              key={k.kod}
              varian={k.kod === kategoriTerpilih ? "isi" : "garis"}
              onClick={() => {
                onPilih(k.kod);
                onTutup();
              }}
            >
              {k.nama}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
