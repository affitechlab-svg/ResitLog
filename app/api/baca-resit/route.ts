import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { CaraBayar } from "@/jenis";

// Route handler pelayan — kunci API TIDAK PERNAH sampai ke kod klien.
// Rujuk 02-TECH-STACK.md §5.

export const runtime = "nodejs";

// Model paling murah yang mencukupi untuk tugasan ekstrak data berstruktur
// (bukan reasoning kompleks) — rujuk keputusan dalam DEV-LOG.md.
const MODEL = "claude-haiku-4-5";

const SKEMA_RESIT = {
  type: "object",
  properties: {
    berjaya: { type: "boolean" },
    sebab_gagal: { type: "string", enum: ["gelap", "bukan_resit", "tidak_jelas", "tiada"] },
    kedai: { type: "string" },
    no_invois: { type: "string" },
    tarikh: { type: "string" },
    cara_bayar: { type: "string", enum: ["tunai", "kad", "ewallet"] },
    jumlah: { type: "number" },
    item: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nama: { type: "string" },
          harga: { type: "number" },
        },
        required: ["nama", "harga"],
        additionalProperties: false,
      },
    },
  },
  required: ["berjaya", "sebab_gagal", "kedai", "no_invois", "tarikh", "cara_bayar", "jumlah", "item"],
  additionalProperties: false,
} as const;

const ARAHAN_SISTEM = `Anda membaca gambar resit belanja dari Malaysia dan mengeluarkan butirannya dalam format berstruktur.

Peraturan:
- "berjaya" = false jika gambar terlalu gelap untuk dibaca, dan "sebab_gagal" = "gelap".
- "berjaya" = false jika gambar ini jelas bukan resit (cth. gambar rawak, muka orang, dokumen lain), dan "sebab_gagal" = "bukan_resit".
- "berjaya" = false jika gambar resit tetapi terlalu kabur atau terpotong untuk baca butiran dengan yakin, dan "sebab_gagal" = "tidak_jelas".
- Jika berjaya, "sebab_gagal" = "tiada".
- "tarikh" dalam format YYYY-MM-DD. Jika tahun tiada pada resit, anggap tahun semasa.
- "cara_bayar" — jika tidak jelas pada resit, anggap "tunai".
- "jumlah" ialah jumlah keseluruhan yang tertera pada resit (bukan dikira semula daripada item).
- "item" ialah senarai baris barang dengan nama dan harga selepas potongan promosi, ikut turutan pada resit.
- Jika berjaya = false, tetap isi semua medan lain dengan nilai kosong munasabah (kedai: "", no_invois: "", tarikh hari ini, cara_bayar: "tunai", jumlah: 0, item: []).`;

interface KeputusanSkema {
  berjaya: boolean;
  sebab_gagal: "gelap" | "bukan_resit" | "tidak_jelas" | "tiada";
  kedai: string;
  no_invois: string;
  tarikh: string;
  cara_bayar: string;
  jumlah: number;
  item: { nama: string; harga: number }[];
}

export async function POST(req: Request) {
  // TODO Fasa 7: sahkan sesi pengguna sebenar (Supabase Auth) sebelum teruskan.
  // Tiada sistem auth sebenar lagi setakat fasa ini — rujuk 09-BUILD-PHASES.md Fasa 7
  // dan nota dalam DEV-LOG.md. Bahagian C acceptance criteria "ditolak jika tiada sesi
  // sah" akan dipenuhi sepenuhnya pada Fasa 7.

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("baca-resit: ANTHROPIC_API_KEY tidak ditetapkan");
    return NextResponse.json({ ok: false, kod: "ralat_pelayan" }, { status: 500 });
  }

  let fail: File | null = null;
  try {
    const borang = await req.formData();
    const nilai = borang.get("gambar");
    if (nilai instanceof File) fail = nilai;
  } catch {
    return NextResponse.json({ ok: false, kod: "ralat_pelayan" }, { status: 400 });
  }

  if (!fail) {
    return NextResponse.json({ ok: false, kod: "ralat_pelayan" }, { status: 400 });
  }

  const mediaType = fail.type || "image/jpeg";
  const bait = Buffer.from(await fail.arrayBuffer());
  const base64 = bait.toString("base64");

  const client = new Anthropic({ apiKey });

  let respons;
  try {
    respons = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: ARAHAN_SISTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType as "image/jpeg" | "image/png" | "image/webp", data: base64 },
            },
            { type: "text", text: "Baca resit dalam gambar ini." },
          ],
        },
      ],
      output_config: { format: { type: "json_schema", schema: SKEMA_RESIT } },
    });
  } catch (ralat) {
    console.error("baca-resit: panggilan Claude API gagal", ralat);
    return NextResponse.json({ ok: false, kod: "ralat_pelayan" }, { status: 502 });
  }

  if (respons.stop_reason !== "end_turn" && respons.stop_reason !== "max_tokens") {
    console.error("baca-resit: stop_reason luar jangka", respons.stop_reason);
    return NextResponse.json({ ok: false, kod: "ralat_pelayan" }, { status: 502 });
  }

  const blokTeks = respons.content.find((b) => b.type === "text");
  if (!blokTeks || blokTeks.type !== "text") {
    return NextResponse.json({ ok: false, kod: "ralat_pelayan" }, { status: 502 });
  }

  let data: KeputusanSkema;
  try {
    data = JSON.parse(blokTeks.text) as KeputusanSkema;
  } catch {
    console.error("baca-resit: balasan bukan JSON sah", blokTeks.text);
    return NextResponse.json({ ok: false, kod: "ralat_pelayan" }, { status: 502 });
  }

  if (!data.berjaya) {
    const kod =
      data.sebab_gagal === "gelap" || data.sebab_gagal === "bukan_resit" || data.sebab_gagal === "tidak_jelas"
        ? data.sebab_gagal
        : "tidak_jelas";
    return NextResponse.json({ ok: false, kod });
  }

  const caraBayarSah: CaraBayar =
    data.cara_bayar === "tunai" || data.cara_bayar === "kad" || data.cara_bayar === "ewallet"
      ? data.cara_bayar
      : "tunai";

  return NextResponse.json({
    ok: true,
    keputusan: {
      kedai: data.kedai || "Kedai tidak diketahui",
      noInvois: data.no_invois || null,
      tarikh: data.tarikh,
      caraBayar: caraBayarSah,
      jumlahResit: data.jumlah,
      item: data.item.map((i) => ({ nama: i.nama, harga: i.harga })),
    },
  });
}
