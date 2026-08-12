import Link from "next/link";
import { Chip } from "@/komponen/ui";
import { formatRM, formatTarikh, labelCaraBayar } from "@/lib/format";
import { namaKategori, type KodKategori } from "@/lib/kategori";
import type { ResitPenuh } from "@/jenis";

const BILANGAN_CHIP_KATEGORI_MAKS = 2;

function kategoriUnikResit(resit: ResitPenuh): KodKategori[] {
  return [...new Set(resit.item.map((i) => i.kategori))];
}

interface PropsBarisResit {
  resit: ResitPenuh;
  // true (skrin Rekod): tunjuk chip kategori + "Tiada bukti", tarikh di bawah jumlah.
  // false (Terkini skrin Utama): tunjuk meta ringkas (tarikh · bilangan item · cara bayar).
  tunjukKategori?: boolean;
}

export default function BarisResit({ resit, tunjukKategori = true }: PropsBarisResit) {
  const kategori = kategoriUnikResit(resit);
  const kategoriDipapar = kategori.slice(0, BILANGAN_CHIP_KATEGORI_MAKS);
  const bakiKategori = kategori.length - kategoriDipapar.length;

  return (
    <Link href={`/rekod/${resit.id}`} className="flex justify-between gap-3 border-b border-hairline py-3.5">
      <div>
        <div className="text-base font-semibold text-ink">{resit.kedai}</div>
        {tunjukKategori ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {kategoriDipapar.map((k) => (
              <Chip key={k} varian="tint" className="px-[7px] py-[3px] text-[11px]">
                {namaKategori(k)}
              </Chip>
            ))}
            {bakiKategori > 0 && (
              <Chip varian="tint" className="px-[7px] py-[3px] text-[11px]">
                +{bakiKategori}
              </Chip>
            )}
            {resit.tiadaBukti && (
              <Chip varian="garis" className="border-maroon px-[6px] py-[2px] text-[11px] text-maroon">
                Tiada bukti
              </Chip>
            )}
          </div>
        ) : (
          <div className="mt-1 text-xs text-muted">
            {formatTarikh(resit.tarikh)} · {resit.item.length} item · {labelCaraBayar(resit.caraBayar)}
          </div>
        )}
      </div>
      <div className={tunjukKategori ? "shrink-0 text-right" : ""}>
        <div className="text-base font-extrabold text-ink">{formatRM(resit.jumlah)}</div>
        {tunjukKategori && <div className="mt-1 text-xs text-muted">{formatTarikh(resit.tarikh)}</div>}
      </div>
    </Link>
  );
}
