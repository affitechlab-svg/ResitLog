"use client";

import { useState } from "react";
import { Chip } from "@/komponen/ui";
import PemilihKategori from "@/komponen/resit/PemilihKategori";
import { namaKategori, type KodKategori } from "@/lib/kategori";

export interface ItemUntukSemak {
  id: string;
  nama: string;
  harga: number;
  kategori: KodKategori | null;
}

interface PropsSenaraiItem {
  item: ItemUntukSemak[];
  onUbahKategori: (idItem: string, kategori: KodKategori) => void;
}

export default function SenaraiItem({ item, onUbahKategori }: PropsSenaraiItem) {
  const [idTerbuka, setIdTerbuka] = useState<string | null>(null);
  const itemTerbuka = item.find((i) => i.id === idTerbuka) ?? null;

  return (
    <div className="flex flex-col">
      {item.map((i) => (
        <div key={i.id} className="flex flex-col gap-2 border-b border-hairline py-3">
          <div className="flex justify-between gap-2.5">
            <span className="text-[15px] font-semibold text-ink">{i.nama}</span>
            <span className="text-[15px] font-extrabold text-ink">{i.harga.toFixed(2)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {i.kategori ? (
              <Chip varian="tint" className="text-xs" onClick={() => setIdTerbuka(i.id)}>
                {namaKategori(i.kategori)} ▾
              </Chip>
            ) : (
              <Chip varian="garis-putus" className="text-xs" onClick={() => setIdTerbuka(i.id)}>
                Pilih kategori ▾
              </Chip>
            )}
          </div>
        </div>
      ))}

      <PemilihKategori
        terbuka={itemTerbuka !== null}
        kategoriTerpilih={itemTerbuka?.kategori ?? null}
        onPilih={(kategori) => {
          if (itemTerbuka) onUbahKategori(itemTerbuka.id, kategori);
        }}
        onTutup={() => setIdTerbuka(null)}
      />
    </div>
  );
}
