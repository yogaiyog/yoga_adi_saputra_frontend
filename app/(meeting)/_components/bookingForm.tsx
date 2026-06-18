"use client";

import Link from "next/link";
import { startTransition, useMemo, useState } from "react";
import type { Consumption, MeetingRoom, Unit } from "@/app/_lib/api";
import { formatCurrency } from "@/app/_lib/format";

type BookingFormProps = {
  apiBaseUrl: string;
  consumptions: Consumption[];
  meetingRooms: MeetingRoom[];
  units: Unit[];
};

type FormState = {
  unitId: string;
  roomId: string;
  meetingDate: string;
  startSlot: string;
  endSlot: string;
  participantQty: string;
  consumptionIds: string[];
};

const timeSlots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const initialState: FormState = {
  unitId: "",
  roomId: "",
  meetingDate: "",
  startSlot: "",
  endSlot: "",
  participantQty: "",
  consumptionIds: [],
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
    </svg>
  );
}

export default function BookingForm({
  apiBaseUrl,
  consumptions,
  meetingRooms,
  units,
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const selectedRoom = useMemo(
    () => meetingRooms.find((room) => room.id === form.roomId) || null,
    [form.roomId, meetingRooms]
  );

  const selectedConsumptions = useMemo(
    () =>
      consumptions.filter((item) => form.consumptionIds.includes(item.id)),
    [consumptions, form.consumptionIds]
  );

  const participantQty = Number(form.participantQty || "0");
  const consumptionFee = selectedConsumptions.reduce(
    (total, item) => total + item.price * participantQty,
    0
  );

  const endTimeOptions = useMemo(() => {
    if (!form.startSlot) {
      return timeSlots;
    }

    return timeSlots.filter((slot) => slot > form.startSlot);
  }, [form.startSlot]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleConsumption(id: string) {
    setForm((current) => ({
      ...current,
      consumptionIds: current.consumptionIds.includes(id)
        ? current.consumptionIds.filter((item) => item !== id)
        : [...current.consumptionIds, id],
    }));
  }

  function buildIsoDateTime(date: string, time: string) {
    return `${date}T${time}:00.000Z`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.unitId || !form.roomId || !form.meetingDate || !form.startSlot || !form.endSlot) {
      setErrorMessage("Lengkapi data utama booking terlebih dahulu.");
      return;
    }

    if (!form.participantQty || Number(form.participantQty) <= 0) {
      setErrorMessage("Jumlah peserta harus lebih dari 0.");
      return;
    }

    if (selectedRoom && Number(form.participantQty) > selectedRoom.capacity) {
      setErrorMessage("Jumlah peserta melebihi kapasitas ruangan.");
      return;
    }

    setIsPending(true);

    startTransition(async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            unitId: form.unitId,
            roomId: form.roomId,
            meetingDate: form.meetingDate,
            startTime: buildIsoDateTime(form.meetingDate, form.startSlot),
            endTime: buildIsoDateTime(form.meetingDate, form.endSlot),
            participantQty: Number(form.participantQty),
            consumptionIds: form.consumptionIds,
          }),
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          throw new Error(payload.message || "Gagal menyimpan booking.");
        }

        setSuccessMessage("Booking ruangan berhasil disimpan dan otomatis approved.");
        setForm(initialState);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan booking."
        );
      } finally {
        setIsPending(false);
      }
    });
  }

  return (
    <section className="rounded-[30px] border border-white/70 bg-[var(--panel)] p-6 shadow-[var(--shadow-card)] md:p-10">
      <div className="mb-8 border-b border-[var(--soft-line)] pb-7">
        <h2 className="font-[family-name:var(--font-manrope)] text-[2rem] font-extrabold tracking-tight">
          Informasi Ruang Meeting
        </h2>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-3">
            <span className="text-lg font-bold text-[#1c252c]">Unit</span>
            <select
              value={form.unitId}
              onChange={(event) => updateField("unitId", event.target.value)}
              className="h-15 w-full rounded-2xl border border-[var(--line)] bg-white px-5 text-lg text-[#2a3540] outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-100)]"
            >
              <option value="">Pilih Unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-3">
            <span className="text-lg font-bold text-[#1c252c]">Pilihan Ruangan Meeting</span>
            <select
              value={form.roomId}
              onChange={(event) => updateField("roomId", event.target.value)}
              className="h-15 w-full rounded-2xl border border-[var(--line)] bg-white px-5 text-lg text-[#2a3540] outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-100)]"
            >
              <option value="">Pilih Ruangan Meeting</option>
              {meetingRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-3">
            <span className="text-lg font-bold text-[#1c252c]">Kapasitas Ruangan</span>
            <div className="flex h-15 items-center rounded-2xl bg-[var(--panel-muted)] px-5 text-lg text-[var(--text-muted)]">
              {selectedRoom ? `${selectedRoom.capacity} Orang` : "Kapasitas Ruangan"}
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--soft-line)] pt-8">
          <h3 className="mb-7 font-[family-name:var(--font-manrope)] text-[2rem] font-extrabold tracking-tight">
            Informasi Rapat
          </h3>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr]">
            <label className="space-y-3">
              <span className="text-lg font-bold text-[#1c252c]">
                Tanggal Rapat <span className="text-[var(--danger-600)]">*</span>
              </span>
              <div className="relative">
                <input
                  type="date"
                  value={form.meetingDate}
                  onChange={(event) => updateField("meetingDate", event.target.value)}
                  className="h-15 w-full rounded-2xl border border-[var(--line)] bg-white px-5 pr-12 text-lg text-[#2a3540] outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-100)]"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brand-500)]">
                  <CalendarIcon />
                </span>
              </div>
            </label>

            <label className="space-y-3">
              <span className="text-lg font-bold text-[#1c252c]">Pilihan Waktu Mulai</span>
              <select
                value={form.startSlot}
                onChange={(event) => {
                  updateField("startSlot", event.target.value);
                  if (form.endSlot && form.endSlot <= event.target.value) {
                    updateField("endSlot", "");
                  }
                }}
                className="h-15 w-full rounded-2xl border border-[var(--line)] bg-white px-5 text-lg text-[#2a3540] outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-100)]"
              >
                <option value="">Pilih Waktu Mulai</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-3">
              <span className="text-lg font-bold text-[#1c252c]">Waktu Selesai</span>
              <select
                value={form.endSlot}
                onChange={(event) => updateField("endSlot", event.target.value)}
                className="h-15 w-full rounded-2xl border border-[var(--line)] bg-white px-5 text-lg text-[#2a3540] outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-100)]"
              >
                <option value="">Pilih Waktu Selesai</option>
                {endTimeOptions.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="space-y-3">
              <span className="text-lg font-bold text-[#1c252c]">Jumlah Peserta</span>
              <input
                type="number"
                min="1"
                value={form.participantQty}
                onChange={(event) => updateField("participantQty", event.target.value)}
                placeholder="Masukan Jumlah Peserta"
                className="h-15 w-full rounded-2xl border border-[var(--line)] bg-white px-5 text-lg text-[#2a3540] outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-100)]"
              />
            </label>
          </div>

          <div className="mt-8 border-t border-[var(--soft-line)] pt-8">
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h4 className="mb-5 text-lg font-bold text-[#1c252c]">Jenis Konsumsi</h4>
                <div className="space-y-4">
                  {consumptions.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-transparent px-1 py-1 text-lg text-[#6c7982] transition hover:border-[var(--soft-line)]"
                    >
                      <input
                        type="checkbox"
                        checked={form.consumptionIds.includes(item.id)}
                        onChange={() => toggleConsumption(item.id)}
                        className="h-6 w-6 rounded-md border border-[var(--line)] text-[var(--brand-500)] focus:ring-[var(--brand-500)]"
                      />
                      <span>{item.name}</span>
                      <span className="ml-auto text-base font-semibold text-[var(--brand-700)]">
                        {formatCurrency(item.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* <div className="space-y-3">
                <span className="text-lg font-bold text-[#1c252c]">Nominal Konsumsi</span>
                <div className="flex overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
                  <div className="grid w-18 place-items-center bg-[var(--brand-500)] text-lg font-bold text-white">
                    Rp
                  </div>
                  <div className="flex h-15 flex-1 items-center px-5 text-lg font-semibold text-[#44515a]">
                    {new Intl.NumberFormat("id-ID").format(consumptionFee)}
                  </div>
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  Nominal dihitung otomatis berdasarkan pilihan konsumsi dan jumlah peserta.
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={`rounded-2xl border px-5 py-4 text-base font-medium ${
              errorMessage
                ? "border-[var(--danger-100)] bg-[var(--danger-100)] text-[var(--danger-600)]"
                : "border-[var(--success-100)] bg-[var(--success-100)] text-[var(--success-700)]"
            }`}
          >
            {errorMessage || successMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-[var(--soft-line)] pt-8">
          <Link
            href="/bookings"
            className="rounded-2xl bg-[var(--danger-100)] px-10 py-4 text-lg font-bold text-[var(--danger-600)] transition hover:opacity-90"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-2xl bg-[var(--brand-500)] px-10 py-4 text-lg font-bold text-white shadow-[0_14px_28px_rgba(79,144,164,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </section>
  );
}
