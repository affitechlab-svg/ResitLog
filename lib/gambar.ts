// Mampat gambar resit di pelayar sebelum dihantar — lebar maksimum 1400px,
// kualiti mula 0.82, kurangkan lagi jika masih melebihi 300KB. Rujuk 02-TECH-STACK.md §5.

const LEBAR_MAKS = 1400;
const KUALITI_MULA = 0.82;
const SAIZ_MAKS_BAIT = 300 * 1024;
const CUBAAN_MAKS = 5;

async function lukisDanMampat(bitmap: ImageBitmap, lebar: number, tinggi: number, kualiti: number): Promise<Blob> {
  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  const konteks = kanvas.getContext("2d");
  if (!konteks) {
    throw new Error("Peranti ini tidak menyokong pemampatan gambar. Cuba masuk manual.");
  }
  konteks.drawImage(bitmap, 0, 0, lebar, tinggi);

  const blob = await new Promise<Blob | null>((selesai) => {
    kanvas.toBlob(selesai, "image/jpeg", kualiti);
  });
  if (!blob) {
    throw new Error("Gagal mampat gambar. Cuba semula, atau masuk manual.");
  }
  return blob;
}

export async function mampatGambar(fail: File): Promise<Blob> {
  const bitmap = await createImageBitmap(fail);
  const skala = Math.min(1, LEBAR_MAKS / bitmap.width);
  const lebar = Math.round(bitmap.width * skala);
  const tinggi = Math.round(bitmap.height * skala);

  let kualiti = KUALITI_MULA;
  let blob = await lukisDanMampat(bitmap, lebar, tinggi, kualiti);

  let cubaan = 0;
  while (blob.size > SAIZ_MAKS_BAIT && cubaan < CUBAAN_MAKS) {
    kualiti = Math.max(0.4, kualiti - 0.12);
    blob = await lukisDanMampat(bitmap, lebar, tinggi, kualiti);
    cubaan += 1;
  }

  return blob;
}
