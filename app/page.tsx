import { redirect } from "next/navigation";

// Fasa 0-6: tiada auth sebenar lagi — pengguna dummy dianggap sentiasa log masuk,
// jadi "/" terus ke "/utama". Fasa 7 (Supabase Auth) tukar ini ikut status sesi
// sebenar: log masuk → /utama, belum → /mula (03-SITEMAP-ROUTING.md).
export default function Halaman() {
  redirect("/utama");
}
