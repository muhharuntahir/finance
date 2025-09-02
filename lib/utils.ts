// lib/utils.ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const hitungHari = (start: Date, end: Date) =>
//   Math.max(
//     0,
//     Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
//   );

export function hitungHari(start: Date, end: Date): number {
  // normalisasi tanggal supaya jam tidak mempengaruhi hasil
  const startDate = new Date(start);
  const endDate = new Date(end);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // selalu minimal 1 hari
  return diffDays + 1;
}

export const bungaHarian = (amount: number) => (amount * 0.1275) / 360;

export const toRupiah = (num: number) => "Rp" + num.toLocaleString("id-ID");
