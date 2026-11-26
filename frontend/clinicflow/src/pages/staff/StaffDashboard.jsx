import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export default function StaffDashboard() {
  const { state } = useClinicFlowStore();

  const waitingCount = state.queue.entries.filter((e) => e.status === "Waiting").length;
  const servingEntry = state.queue.entries.find((e) => e.status === "Serving");
  const servingCount = servingEntry ? 1 : 0;
  const completedCount = state.queue.entries.filter((e) => e.status === "Completed").length;
  const totalQueueItems = Math.max(1, waitingCount + servingCount + completedCount);

  const nowServingLabel = servingEntry
    ? servingEntry.code
    : `Q-${String(state.queue.nowServingNumber).padStart(3, "0")}`;

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

  const kpis = [
    {
      label: "Appointments",
      value: state.appointments.length,
      sub: "Total recorded bookings",
      surface: "border-teal-200/80 bg-gradient-to-br from-white to-teal-50/70",
      bar: "bg-teal-600",
      subColor: "text-teal-700",
      fill: "w-2/3",
    },
    {
      label: "Waiting patients",
      value: waitingCount,
      sub: "Currently in queue",
      surface: "border-amber-200/80 bg-gradient-to-br from-white to-amber-50/70",
      bar: "bg-amber-500",
      subColor: "text-amber-700",
      fill: waitingCount > 0 ? "w-1/2" : "w-1/4",
    },
    {
      label: "Now serving",
      value: nowServingLabel,
      sub: servingEntry ? servingEntry.patientName : "Ready for next call",
      surface: "border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/70",
      bar: "bg-emerald-600",
      subColor: "text-emerald-700",
      fill: servingEntry ? "w-3/4" : "w-1/3",
    },
    {
      label: "Completed",
      value: completedCount,
      sub: "Finished consultations",
      surface: "border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/65",
      bar: "bg-indigo-600",
      subColor: "text-indigo-700",
      fill: completedCount > 0 ? "w-1/2" : "w-1/4",
    },
  ];

  const pulseRows = [
    { label: "Waiting", count: waitingCount, bar: "bg-amber-500", text: "text-amber-800" },
    { label: "Serving", count: servingCount, bar: "bg-emerald-600", text: "text-emerald-800" },
    { label: "Completed", count: completedCount, bar: "bg-teal-600", text: "text-teal-800" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Operations Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Staff overview
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Clinic operations
            </h1>
            <p className="mt-1.5 text-xs text-teal-100/85 sm:text-sm">
              Monitor today&apos;s appointments, patient flow, and service performance.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              to="/staff/queue"
              className="inline-flex items-center rounded-xl bg-teal-400 px-4 py-2.5 text-xs font-extrabold text-[#052622] shadow-sm transition hover:bg-teal-300"
            >
              Manage queue →
            </Link>
            <Link
              to="/staff/appointments"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              View appointments
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Color-Tinted KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border p-5 shadow-2xs ${item.surface}`}
          >
            <p className="text-xs font-semibold text-slate-600">{item.label}</p>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-[#062b26]">
              {item.value}
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
              <div className={`h-full rounded-full ${item.bar} ${item.fill}`} />
            </div>
            <p className={`mt-2 truncate text-[11px] font-semibold ${item.subColor}`}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-teal-200/80 border-l-4 border-l-teal-600 bg-gradient-to-r from-teal-50/45 to-white p-6 shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-teal-700">
                Queue pulse
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#062b26]">
                Today&apos;s patient flow
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              Live Records
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {pulseRows.map((row) => {
              const pct =
                row.count === 0 ? 0 : Math.max(8, Math.round((row.count / totalQueueItems) * 100));
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={row.text}>{row.label}</span>
                    <span className="font-bold text-[#062b26]">{row.count}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                    <div
                      className={`h-full rounded-full transition-all ${row.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0f5b51] p-6 text-white shadow-lg shadow-teal-950/15">
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-40 rounded-full bg-amber-300/15 blur-2xl" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-amber-300/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-amber-200">
              Most requested
            </span>
            <h2 className="mt-3 text-xl font-bold leading-snug text-white">
              {mostRequestedService.name}
            </h2>
            <p className="mt-3 text-xs leading-5 text-teal-100/80">
              Service demand updates automatically as real appointments are created.
            </p>
          </div>

          <div className="relative mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs">
            <span className="text-teal-200/85">Recorded demand</span>
            <span className="rounded-full bg-teal-400 px-3 py-1 font-extrabold text-[#052622]">
              {mostRequestedService.count} booking{mostRequestedService.count === 1 ? "" : "s"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
