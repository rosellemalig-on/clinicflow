// ============================================================
// OWNER   : Padilla
// FEATURE : Feature 9 Reports & Analytics
// ============================================================

import { useMemo } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export default function ReportsPage() {
  const { state } = useClinicFlowStore();

  const mostRequestedService = useMemo(() => {
    const counts = {};
    state.appointments.forEach((a) => {
      counts[a.serviceName] = (counts[a.serviceName] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]
      ? { name: sorted[0][0], count: sorted[0][1] }
      : { name: "General Consultation", count: 0 };
  }, [state.appointments]);

  const maxPatients = Math.max(1, ...state.dailyStats.map((d) => d.patients));
  const totalWeeklyPatients = state.dailyStats.reduce((sum, d) => sum + d.patients, 0);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Analytics Header Banner with Embedded Summary Tiles */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
            Clinic insights
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1.5 text-xs text-teal-100/85 sm:text-sm">
            Track weekly patient volume, total bookings, and top clinic services at a glance.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-teal-300/30 bg-white/10 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-teal-200">
                Recorded Appointments
              </p>
              <p className="mt-1 text-3xl font-extrabold text-white">
                {state.appointments.length}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/15 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                Patients This Week
              </p>
              <p className="mt-1 text-3xl font-extrabold text-white">
                {totalWeeklyPatients}
              </p>
            </div>

            <div className="rounded-xl border border-amber-300/35 bg-amber-300/15 p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                Most Requested Service
              </p>
              <p className="mt-1 text-lg font-bold leading-snug text-white">
                {mostRequestedService.name}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-amber-100/90">
                {mostRequestedService.count} booking{mostRequestedService.count === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bar Chart: Patients Per Day */}
      <section className="mt-6 rounded-2xl border border-teal-200/80 border-l-4 border-l-teal-600 bg-gradient-to-b from-white to-teal-50/35 p-5 shadow-2xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#062b26]">Patients Per Day</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Daily clinic volume with peak day highlighted
            </p>
          </div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
            Peak: {maxPatients} patient{maxPatients === 1 ? "" : "s"}
          </span>
        </div>

        <div
          className="mt-5 grid h-52 items-end gap-2 border-b border-teal-200/80 pt-4 sm:gap-3"
          style={{ gridTemplateColumns: `repeat(${state.dailyStats.length}, minmax(0, 1fr))` }}
        >
          {state.dailyStats.map((item) => {
            const heightPct = Math.round((item.patients / maxPatients) * 100);
            const isPeak = item.patients > 0 && item.patients === maxPatients;
            return (
              <div
                key={item.day}
                className="flex h-full flex-col items-center justify-end"
              >
                <span
                  className={`mb-1.5 text-xs font-bold ${
                    isPeak ? "text-amber-700" : "text-[#062b26]"
                  }`}
                >
                  {item.patients}
                </span>
                <div
                  className={`w-full max-w-[46px] rounded-t-xl shadow-2xs transition-all ${
                    isPeak
                      ? "bg-gradient-to-t from-amber-500 to-amber-300"
                      : "bg-gradient-to-t from-[#052622] via-teal-700 to-teal-500"
                  }`}
                  style={{ height: `${heightPct}%`, minHeight: 10 }}
                />
              </div>
            );
          })}
        </div>
        <div
          className="mt-2.5 grid gap-2 sm:gap-3"
          style={{ gridTemplateColumns: `repeat(${state.dailyStats.length}, minmax(0, 1fr))` }}
        >
          {state.dailyStats.map((item) => (
            <div
              key={item.day}
              className="text-center text-xs font-semibold text-teal-900/75 sm:text-sm"
            >
              {item.day}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
