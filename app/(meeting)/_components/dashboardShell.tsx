import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-7h5v7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 13c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6Z" />
      <path d="M4 22c1.367-3.156 4.23-5 8-5s6.633 1.844 8 5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
      <path d="M12 2a5 5 0 0 0-5 5v2.051c0 1.039-.302 2.056-.869 2.927L4.37 14.75A1.5 1.5 0 0 0 5.625 17H18.37a1.5 1.5 0 0 0 1.256-2.25l-1.762-2.772A5.35 5.35 0 0 1 17 9.05V7a5 5 0 0 0-5-5Z" />
      <path d="M9.75 19a2.25 2.25 0 0 0 4.5 0" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent text-[var(--foreground)]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-[linear-gradient(90deg,var(--brand-950),var(--brand-800),#2f6d84)] text-white shadow-[0_18px_48px_rgba(11,23,32,0.24)]">
        <div className="flex min-h-[92px] items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo-FTL-no-tagline 1.png"
              alt="FTL"
              width={132}
              height={46}
              className="h-auto w-[108px] md:w-[132px]"
              priority
            />
            <div className="border-l border-white/20 pl-4">
              <p className="font-[family-name:var(--font-manrope)] text-2xl font-semibold tracking-tight">
                iMeeting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-white transition-transform hover:-translate-y-0.5"
            >
              <BellIcon />
            </button>
            <div className="flex items-center gap-3 rounded-full bg-white/10 px-2 py-1.5 backdrop-blur">
              <Image
                src="/dummy_user.png"
                alt="John Doe"
                width={52}
                height={52}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
              />
              <div className="pr-2">
                <p className="font-[family-name:var(--font-manrope)] text-[1.05rem] font-semibold">
                  John Doe
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 pb-10 pt-[120px] md:px-8 md:pt-[132px]">
        <aside className="fixed bottom-0 left-0 top-[92px] z-30 hidden w-[96px] border-r border-black/5 bg-white/88 px-4 py-8 shadow-[var(--shadow-soft)] backdrop-blur md:flex md:flex-col md:items-center md:gap-5">
          <Link
            href="/bookings"
            className="grid h-13 w-13 place-items-center rounded-2xl bg-[var(--brand-500)] text-white shadow-[0_12px_22px_rgba(79,144,164,0.26)] transition-transform hover:-translate-y-0.5"
          >
            <HomeIcon />
          </Link>
          <div className="grid h-13 w-13 place-items-center rounded-2xl text-[var(--brand-500)]">
            <UserIcon />
          </div>
        </aside>

        <div className="mx-auto max-w-[1500px] md:pl-[116px]">
          <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/bookings"
                className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-500)] text-white shadow-[0_12px_24px_rgba(79,144,164,0.26)] transition-transform hover:-translate-y-0.5"
              >
                <BackArrowIcon />
              </Link>
              <div>
                <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#1a232b]">
                  Ruang Meeting
                </h1>
                <p className="mt-1 text-lg text-[var(--text-muted)]">
                  Ruang Meeting
                </p>
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
