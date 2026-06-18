import Link from "next/link";
import type { Booking } from "@/app/_lib/api";
import { formatCurrency, formatDate, formatTimeRange } from "@/app/_lib/format";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function BookingTable({ bookings }: { bookings: Booking[] }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3 text-white">
        <Link
          href="/bookings/new"
          className="inline-flex items-center gap-3 rounded-2xl bg-[var(--brand-500)] px-6 py-4 font-semibold text-white shadow-[0_14px_28px_rgba(79,144,164,0.26)] transition-transform hover:-translate-y-0.5"
        >
          <PlusIcon />
          Pesan Ruangan
        </Link>
      </div>

      <div className="overflow-hidden rounded-[30px] border border-white/70 bg-[var(--panel)] shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] bg-white">
                {[
                  "Unit",
                  "Ruang Meeting",
                  "Kapasitas",
                  "Tanggal Rapat",
                  "Waktu",
                  "Jumlah Peserta",
                  "Jenis Konsumsi"
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-9 py-10 text-left font-[family-name:var(--font-manrope)] text-[1.05rem] font-extrabold uppercase tracking-[0.02em] text-[#141b21]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-9 py-16 text-center text-lg text-[var(--text-muted)]">
                    Belum ada booking meeting room.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-[var(--soft-line)] last:border-b-0">
                    <td className="px-9 py-9 align-top font-[family-name:var(--font-manrope)] text-lg font-extrabold uppercase text-[#182028]">
                      {booking.unit.name}
                    </td>
                    <td className="px-9 py-9 align-top text-lg font-semibold text-[#7f8a93]">
                      {booking.room.name}
                    </td>
                    <td className="px-9 py-9 align-top text-lg font-semibold text-[#7f8a93]">
                      {booking.room.capacity} Orang
                    </td>
                    <td className="px-9 py-9 align-top text-lg font-semibold text-[#7f8a93]">
                      {formatDate(booking.meetingDate)}
                    </td>
                    <td className="px-9 py-9 align-top text-lg font-semibold text-[#7f8a93]">
                      {formatTimeRange(booking.startTime, booking.endTime)}
                    </td>
                    <td className="px-9 py-9 align-top text-lg font-semibold text-[#7f8a93]">
                      {booking.participantQty} Orang
                    </td>
                    <td className="px-9 py-9 align-top text-lg font-semibold leading-9 text-[#7f8a93]">
                      {booking.consumptions.length === 0
                        ? "-"
                        : booking.consumptions.map((item) => item.consumption.name).join(", ")}
                    </td>
                    <td className="px-9 py-9 align-top">
                      {/* <div className="space-y-3">
                        <p className="text-lg font-semibold text-[#7f8a93]">
                          {formatCurrency(booking.consumptionFee)}
                        </p>
                        <span className="inline-flex rounded-full bg-[var(--success-100)] px-3 py-1 text-sm font-bold tracking-wide text-[var(--success-700)]">
                          {booking.status}
                        </span>
                      </div> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--soft-line)] px-9 py-8 text-[1.05rem] text-[var(--text-muted)]">
          <p>
            Showing <span className="font-extrabold text-[#151d24]">1-{bookings.length}</span> of{" "}
            <span className="font-extrabold text-[#151d24]">{bookings.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[var(--line)] px-5 py-3 font-medium text-[#67757f]"
            >
              Back
            </button>
            <button
              type="button"
              className="rounded-xl border border-[#9dc2d0] bg-[var(--brand-100)] px-4 py-3 font-bold text-[var(--brand-700)]"
            >
              1
            </button>
            <button
              type="button"
              className="rounded-xl border border-[var(--line)] px-5 py-3 font-medium text-[#67757f]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
