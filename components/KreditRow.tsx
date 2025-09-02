"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toRupiah, hitungHari, bungaHarian } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Kredit = {
  id: string;
  amount: bigint;
  tanggalPengambilan: string;
  tanggalPengembalian?: string | null;
};

export default function KreditRow({
  data,
  onRefresh,
}: {
  data: Kredit;
  onRefresh: () => void;
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const pengambilan = new Date(data.tanggalPengambilan);
  const pengembalian = data.tanggalPengembalian
    ? new Date(data.tanggalPengembalian)
    : null;

  const hari = hitungHari(pengambilan, pengembalian ?? new Date());
  // const rawHari = hitungHari(pengambilan, pengembalian ?? new Date());
  // const hari = Math.max(rawHari, 1);

  const bunga = bungaHarian(Number(data.amount));
  const totalBunga = bunga * hari;
  const totalKredit = Number(data.amount) + totalBunga;

  const handleTanggalPengembalian = async (tanggal: Date | undefined) => {
    setShowCalendar(false);
    if (!tanggal) return;

    await fetch(`/api/kredit/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({
        amount: data.amount.toString(),
        tanggalPengembalian: tanggal.toISOString(),
      }),
    });

    onRefresh();
  };

  const handleDelete = async () => {
    await fetch(`/api/kredit/${data.id}`, {
      method: "DELETE",
    });

    onRefresh();
  };

  const status = pengembalian ? "Lunas" : "Berjalan";

  return (
    <tr>
      <td className="border px-2 py-1">{toRupiah(Number(data.amount))}</td>
      <td className="border px-2 py-1">
        {format(pengambilan, "dd MMM yyyy", { locale: id })}
      </td>
      <td className="border px-2 py-1 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCalendar((s) => !s)}
        >
          {pengembalian ? format(pengembalian, "dd/MM/yyyy") : "Pilih tanggal"}
        </Button>

        {showCalendar && (
          <div className="absolute z-50 bg-white shadow border rounded mt-2">
            <Calendar
              mode="single"
              selected={pengembalian ?? undefined}
              onSelect={handleTanggalPengembalian}
              defaultMonth={pengembalian ?? pengambilan}
            />
          </div>
        )}
      </td>
      <td className="border px-2 py-1">{hari}</td>
      <td className="border px-2 py-1">{toRupiah(bunga)}</td>
      <td className="border px-2 py-1">{toRupiah(totalBunga)}</td>
      <td className="border px-2 py-1">{status}</td>
      <td className="border px-2 py-1">{toRupiah(totalKredit)}</td>
      <td className="border px-2 py-1 text-red-600">
        {status === "Berjalan" ? toRupiah(totalKredit) : "Rp0"}
      </td>
      <td className="border px-2 py-1 text-green-600">
        {status === "Lunas" ? toRupiah(totalKredit) : "-"}
      </td>
      <td className="border px-2 py-1 text-center">
        {/* Hapus dengan Modal */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-red-600 hover:text-red-800">
              <Trash2 size={16} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 size={20} className="text-red-600" />
                Hapus Data Kredit?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus data pengambilan kredit secara
                permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}
