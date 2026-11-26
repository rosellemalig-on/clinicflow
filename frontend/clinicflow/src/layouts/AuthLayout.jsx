import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-gradient-to-br from-[#e7f6f2] via-[#f4faf8] to-[#dff2ec] lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex items-center justify-center px-5 py-10 md:px-10">
        <div className="w-full max-w-md rounded-3xl border border-teal-200/80 bg-white/95 p-6 shadow-xl shadow-teal-950/8 backdrop-blur-xs sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-teal-100 pb-5">
            <Logo />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50/70 px-3.5 py-1.5 text-xs font-semibold text-teal-900 transition hover:border-teal-500 hover:bg-teal-100"
            >
              <span aria-hidden="true">←</span>
              Back to home
            </Link>
          </div>
          <Outlet />
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-12 text-white lg:flex lg:items-center lg:justify-center xl:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border-[56px] border-teal-700/35" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 size-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-12 size-64 rounded-full bg-amber-300/15 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-xl flex-col gap-10">
          {/* Live Clinic Preview Card */}
          <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-teal-200">
                <span className="size-2 rounded-full bg-emerald-400" />
                ClinicFlow Live Portal
              </span>
              <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-[11px] font-extrabold text-[#052622]">
                Real-time sync
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200/80">
                  Queue Tracking
                </p>
                <p className="mt-1 text-sm font-bold text-white">Live ticket &amp; alerts</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200/90">
                  Appointments
                </p>
                <p className="mt-1 text-sm font-bold text-white">Instant slot check</p>
              </div>
            </div>
          </div>

          {/* Brand Message & Highlights */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-300">
              Connected care, less waiting
            </p>
            <p className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white">
              One clear flow from appointment booking to completed consultation.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              <div className="rounded-xl border border-teal-300/20 bg-white/5 p-3.5">
                <p className="text-lg font-extrabold text-teal-300">24/7</p>
                <p className="mt-0.5 text-xs text-teal-100/80">Booking access</p>
              </div>
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3.5">
                <p className="text-lg font-extrabold text-emerald-300">Live</p>
                <p className="mt-0.5 text-xs text-teal-100/80">Queue status</p>
              </div>
              <div className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-3.5">
                <p className="text-lg font-extrabold text-amber-200">Private</p>
                <p className="mt-0.5 text-xs text-teal-100/80">Patient records</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
