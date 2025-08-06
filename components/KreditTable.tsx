"use client";

import { useEffect, useRef, useState } from "react";
import { DateRange, Range } from "react-date-range";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import KreditRow from "./KreditRow";
import { Button } from "./ui/button";
import { toRupiah, hitungHari, bungaHarian } from "@/lib/utils";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "@/styles/date-range-custom.css";

type Kredit = {
  id: string;
  amount: number;
  tanggalPengambilan: string;
  tanggalPengembalian?: string | null;
};

export default function KreditTable() {
  const [data, setData] = useState<Kredit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarRef = useRef<HTMLDivElement | null>(null);

  const refresh = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/kredit")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const filtered = data.filter((item) => {
    const tgl = new Date(item.tanggalPengambilan);
    if (!start || !end) return true;
    return tgl >= start && tgl <= end;
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
      {/* Filter Controls */}
      <div className="flex justify-end mb-4 gap-4 relative">
        <div className="flex flex-col items-end gap-2">
          <div className="relative inline-block">
            <Button
              variant="outline"
              onClick={() => setShowCalendar((prev) => !prev)}
            >
              {start && end
                ? `${format(start, "dd MMM yyyy", { locale: id })} - ${format(
                    end,
                    "dd MMM yyyy",
                    { locale: id }
                  )}`
                : "Filter Tanggal"}
            </Button>

            {showCalendar ? (
              <div
                ref={calendarRef}
                className="absolute right-0 mt-2 z-50 bg-white rounded-lg shadow-lg border p-4"
              >
                <DateRange
                  className="bg-white"
                  editableDateInputs
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  months={2}
                  direction="horizontal"
                  locale={id}
                />
              </div>
            ) : null}
          </div>

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
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <KreditRow key={item.id} data={item} onRefresh={refresh} />
              ))
            )}
          </tbody>
          {!loading && (
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
          )}
        </table>
      </div>
    </>
  );
}
