"use client";

// Storan data dalam memori untuk Fasa 0-6 (bina tempatan, data dummy). Simpan/tambah
// hanya ubah state pelayar — kembali asal bila halaman dimuat semula. Itu dijangka
// dan betul untuk fasa ini (rujuk 09-BUILD-PHASES.md). Fasa 7 gantikan storan ini
// dengan panggilan Supabase sebenar; skrin yang guna useDataResit() tidak perlu ubah
// banyak kerana bentuk data (ResitPenuh) kekal sama.

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Item, ResitPenuh } from "@/jenis";
import { penggunaSemasa, senaraiResitPenuh } from "@/lib/data";

type ItemBaru = Omit<Item, "id" | "resitId">;

interface DetailResitBaru {
  kedai: string;
  noInvois: string | null;
  tarikh: string;
  caraBayar: ResitPenuh["caraBayar"];
  sumber: ResitPenuh["sumber"];
  gambarLaluan: string | null;
  tiadaBukti: boolean;
  item: ItemBaru[];
}

interface NilaiKonteksData {
  pengguna: ReturnType<typeof penggunaSemasa>;
  senaraiResit: ResitPenuh[];
  tambahResit: (butiran: DetailResitBaru) => void;
  padamResit: (id: string) => void;
}

const KonteksData = createContext<NilaiKonteksData | null>(null);

function nomborRefSeterusnya(senarai: ResitPenuh[]): number {
  const nomborTertinggi = senarai.reduce((tertinggi, r) => {
    const nombor = Number(r.ref.replace("RL-", ""));
    return Number.isFinite(nombor) && nombor > tertinggi ? nombor : tertinggi;
  }, 0);
  return nomborTertinggi + 1;
}

export function PembekalDataDummy({ children }: { children: ReactNode }) {
  const [senaraiResit, setSenaraiResit] = useState<ResitPenuh[]>(() => senaraiResitPenuh());
  const pengguna = useMemo(() => penggunaSemasa(), []);

  const tambahResit = useCallback((butiran: DetailResitBaru) => {
    setSenaraiResit((semasa) => {
      const idResit = crypto.randomUUID();
      const kini = new Date().toISOString();
      const resitBaru: ResitPenuh = {
        id: idResit,
        ref: `RL-${String(nomborRefSeterusnya(semasa)).padStart(6, "0")}`,
        penggunaId: pengguna.id,
        isiRumahId: pengguna.isiRumahId,
        kedai: butiran.kedai,
        noInvois: butiran.noInvois,
        tarikh: butiran.tarikh,
        caraBayar: butiran.caraBayar,
        jumlah: butiran.item.reduce((jum, i) => jum + i.harga, 0),
        sumber: butiran.sumber,
        gambarLaluan: butiran.gambarLaluan,
        tiadaBukti: butiran.tiadaBukti,
        diciptaPada: kini,
        dikemasPada: kini,
        item: butiran.item.map((i, indeks) => ({
          ...i,
          id: crypto.randomUUID(),
          resitId: idResit,
          susunan: indeks,
        })),
      };
      return [resitBaru, ...semasa];
    });
  }, [pengguna]);

  const padamResit = useCallback((id: string) => {
    setSenaraiResit((semasa) => semasa.filter((r) => r.id !== id));
  }, []);

  const nilai = useMemo(
    () => ({ pengguna, senaraiResit, tambahResit, padamResit }),
    [pengguna, senaraiResit, tambahResit, padamResit],
  );

  return <KonteksData.Provider value={nilai}>{children}</KonteksData.Provider>;
}

export function useDataResit(): NilaiKonteksData {
  const konteks = useContext(KonteksData);
  if (!konteks) {
    throw new Error("useDataResit() mesti dipanggil dalam <PembekalDataDummy>");
  }
  return konteks;
}
