import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-[#f9fbfa] lg:grid-cols-[0.92fr_1.08fr]">
      <section className="flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-teal-600 hover:text-teal-800"
            >
              <span aria-hidden="true">←</span>
              Back to home
            </Link>
          </div>
          <Outlet />
        </div>
      </section>
      <aside className="relative hidden overflow-hidden bg-[#052622] p-14 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border-[56px] border-teal-800/35" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 size-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="relative max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-300">
            Connected care, less waiting
          </p>
          <p className="mt-5 text-4xl font-semibold leading-tight tracking-tight">
            One clear flow from appointment booking to completed consultation.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <p className="text-lg font-bold text-white">24/7</p>
              <p className="mt-0.5 text-xs text-teal-200/70">Booking access</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">Live</p>
              <p className="mt-0.5 text-xs text-teal-200/70">Queue status</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">Private</p>
              <p className="mt-0.5 text-xs text-teal-200/70">Patient records</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
