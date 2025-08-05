// lib/utils.ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hitungHari = (start: Date, end: Date) =>
  Math.max(
    0,
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );

export const bungaHarian = (amount: number) => (amount * 0.1275) / 360;

export const toRupiah = (num: number) => "Rp" + num.toLocaleString("id-ID");
