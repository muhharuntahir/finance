// components/KreditRow.tsx
import { format } from "date-fns";
import { cn, hitungHari, bungaHarian, toRupiah } from "@/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Trash } from "lucide-react";

type Kredit = {
  id: string;
  amount: number;
  tanggalPengambilan: string;
  tanggalPengembalian?: string | null;
};

type Props = {
  data: Kredit;
  onRefresh: () => void;
};

export default function KreditRow({ data, onRefresh }: Props) {
  const tglAmbil = new Date(data.tanggalPengambilan);
  const tglReturn = data.tanggalPengembalian
    ? new Date(data.tanggalPengembalian)
    : new Date();
  const hari = hitungHari(tglAmbil, tglReturn);
  const harian = bungaHarian(data.amount);
  const bunga = harian * hari;
  const totalKredit = data.amount + bunga;
  const status = data.tanggalPengembalian ? "Lunas" : "Berjalan";
  const berjalan = status === "Lunas" ? 0 : totalKredit;
  const pengembalian = status === "Lunas" ? totalKredit : 0;

  const handleReturn = async (date: Date) => {
    await fetch(`/api/kredit/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({ tanggalPengembalian: date }),
    });
    onRefresh();
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!confirm) return;

    await fetch(`/api/kredit/${data.id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <tr>
      <td className="border px-2 py-1">{toRupiah(data.amount)}</td>
      <td className="border px-2 py-1">{format(tglAmbil, "dd/MM/yyyy")}</td>
      <td className="border px-2 py-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-xs w-full">
              {data.tanggalPengembalian
                ? format(new Date(data.tanggalPengembalian), "dd/MM/yyyy")
                : "dd/mm/yyyy"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-white p-0 rounded-md shadow-md">
            <Calendar
              mode="single"
              selected={new Date()}
              onSelect={(date) => date && handleReturn(date)}
            />
          </PopoverContent>
        </Popover>
      </td>
      <td className="border px-2 py-1">{hari} hari</td>
      <td className="border px-2 py-1">{toRupiah(harian)}</td>
      <td className="border px-2 py-1">{toRupiah(bunga)}</td>
      <td className="border px-2 py-1">
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs",
            status === "Lunas"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          )}
        >
          {status}
        </span>
      </td>
      <td className="border px-2 py-1">{toRupiah(totalKredit)}</td>
      <td className="border px-2 py-1">{toRupiah(berjalan)}</td>
      <td className="border px-2 py-1">{toRupiah(pengembalian)}</td>
      <td className="border px-2 py-1 text-center">
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash size={16} className="text-red-500" />
        </Button>
      </td>
    </tr>
  );
}
