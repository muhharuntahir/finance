"use client";

import { useEffect, useState, useRef } from "react";
import { DateRange, Range } from "react-date-range";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import KreditRow from "./KreditRow";
import { Button } from "./ui/button";
import { toRupiah, hitungHari, bungaHarian } from "@/lib/utils";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type Kredit = {
  id: string;
  amount: number;
  tanggalPengambilan: string;
  tanggalPengembalian?: string | null;
};

export default function KreditTable() {
  const [data, setData] = useState<Kredit[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    fetch("/api/kredit")
      .then((res) => res.json())
      .then(setData);
  }, [refreshKey]);

  const [range, setRange] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);

  const start = range[0].startDate;
  const end = range[0].endDate;

  const filtered = data.filter((item) => {
    const tgl = new Date(item.tanggalPengambilan);
    if (!start || !end) return true;
    return tgl >= (start as Date) && tgl <= (end as Date);
  });

  const rows = filtered.sort(
    (a, b) =>
      new Date(a.tanggalPengambilan).getTime() -
      new Date(b.tanggalPengambilan).getTime()
  );

  const totalKredit = rows.reduce((acc, d) => {
    const hari = hitungHari(
      new Date(d.tanggalPengambilan),
      d.tanggalPengembalian ? new Date(d.tanggalPengembalian) : new Date()
    );
    return acc + d.amount + bungaHarian(d.amount) * hari;
  }, 0);

  const totalBerjalan = rows.reduce((acc, d) => {
    if (d.tanggalPengembalian) return acc;
    const hari = hitungHari(new Date(d.tanggalPengambilan), new Date());
    return acc + d.amount + bungaHarian(d.amount) * hari;
  }, 0);

  const totalPengembalian = rows.reduce((acc, d) => {
    if (!d.tanggalPengembalian) return acc;
    const hari = hitungHari(
      new Date(d.tanggalPengambilan),
      new Date(d.tanggalPengembalian)
    );
    return acc + d.amount + bungaHarian(d.amount) * hari;
  }, 0);

  return (
    <>
      {/* Top Right Controls */}
      <div className="flex justify-end mb-4 gap-4">
        <div className="flex flex-col items-end gap-2 relative">
          {/* Button + Calendar Popover */}
          <div className="relative inline-block">
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {start && end
                ? `${format(start, "dd MMM yyyy", { locale: id })} - ${format(
                    end,
                    "dd MMM yyyy",
                    { locale: id }
                  )}`
                : "Filter Tanggal"}
            </Button>

            {showCalendar && (
              <div className="absolute right-0 mt-2 z-50 shadow-lg border rounded-md bg-white">
                <DateRange
                  className="bg-white"
                  editableDateInputs={true}
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  months={2}
                  direction="horizontal"
                  locale={id}
                />
              </div>
            )}
          </div>

          {/* Reset Filter */}
          <Button
            className="text-sm text-red-700 bg-red-200 hover:bg-red-300 dark:bg-red-600 dark:hover:bg-red-500"
            variant="secondary"
            size="sm"
            onClick={() => {
              setRange([
                { startDate: undefined, endDate: undefined, key: "selection" },
              ]);
              setShowCalendar(false);
            }}
          >
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[800px] border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Pengambilan Kredit</th>
              <th className="border px-2 py-1">Pengambilan</th>
              <th className="border px-2 py-1">Pengembalian</th>
              <th className="border px-2 py-1">Hari</th>
              <th className="border px-2 py-1">Bunga Harian</th>
              <th className="border px-2 py-1">Bunga Berjalan</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Total Kredit</th>
              <th className="border px-2 py-1">Berjalan</th>
              <th className="border px-2 py-1">Pengembalian</th>
              <th className="border px-2 py-1">Hapus</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <KreditRow key={item.id} data={item} onRefresh={refresh} />
            ))}
          </tbody>
          <tfoot className="font-bold">
            <tr>
              <td colSpan={7}></td>
              <td className="border px-2 py-1">{toRupiah(totalKredit)}</td>
              <td className="border px-2 py-1 text-red-600">
                {toRupiah(totalBerjalan)}
              </td>
              <td className="border px-2 py-1 text-green-600">
                {toRupiah(totalPengembalian)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
