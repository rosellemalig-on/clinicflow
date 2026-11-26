import { useMemo } from "react";
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
    return sorted[0]?.[0] || "General Consultation";
  }, [state.appointments]);

  const kpis = [
    { label: "Appointments", value: state.appointments.length },
    { label: "Waiting patients", value: waitingCount },
    { label: "Now serving", value: nowServingLabel },
    { label: "Completed", value: completedCount },
  ];

  const pulseRows = [
    { label: "Waiting", count: waitingCount },
    { label: "Serving", count: servingCount },
    { label: "Completed", count: completedCount },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Staff overview</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
        Clinic operations
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Monitor today&apos;s appointments, patient flow, and service performance.
      </p>

      {/* 4 KPI Cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
          >
            <p className="text-xs font-medium text-slate-500">{item.label}</p>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-[#062b26]">
              {item.value}
            </p>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/3 rounded-full bg-teal-600" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-teal-700">Current clinic data</p>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-teal-700">
                Queue pulse
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#062b26]">
                Today&apos;s patient flow
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              Live Records
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {pulseRows.map((row) => {
              const pct = row.count === 0 ? 0 : Math.max(8, Math.round((row.count / totalQueueItems) * 100));
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-teal-700">{row.label}</span>
                    <span className="font-semibold text-slate-700">{row.count}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-2xl bg-[#052622] p-6 text-white shadow-2xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-teal-300">
              Most requested
            </p>
            <h2 className="mt-3 text-xl font-bold leading-snug text-white">
              {mostRequestedService}
            </h2>
            <p className="mt-3 text-xs leading-5 text-teal-100/75">
              Service demand updates as real appointments are created.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
