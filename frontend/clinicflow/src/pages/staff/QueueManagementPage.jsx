// ============================================================
// OWNER   : Padilla
// FEATURE : Feature 8 Queue Management
// ============================================================

import { useClinicFlowStore } from "@/data/clinicFlowStore";

const ENTRY_STYLES = {
  Serving: {
    badge: "bg-emerald-100 text-emerald-900",
    card: "border-emerald-200/80 border-l-emerald-500 bg-gradient-to-r from-emerald-50/60 to-white",
  },
  Waiting: {
    badge: "bg-sky-100 text-sky-900",
    card: "border-sky-200/80 border-l-sky-500 bg-gradient-to-r from-sky-50/50 to-white",
  },
  "On Hold": {
    badge: "bg-amber-100 text-amber-900",
    card: "border-amber-200/80 border-l-amber-500 bg-gradient-to-r from-amber-50/55 to-white",
  },
  Skipped: {
    badge: "bg-rose-100 text-rose-800",
    card: "border-rose-200/80 border-l-rose-500 bg-gradient-to-r from-rose-50/50 to-white",
  },
  Cancelled: {
    badge: "bg-rose-100 text-rose-800",
    card: "border-rose-200/80 border-l-rose-400 bg-gradient-to-r from-rose-50/40 to-white",
  },
  Completed: {
    badge: "bg-teal-100 text-teal-800",
    card: "border-slate-200/80 border-l-teal-500 bg-gradient-to-r from-slate-50/70 to-white",
  },
};

export default function QueueManagementPage() {
  const { state, queueAction } = useClinicFlowStore();
  const servingEntry = state.queue.entries.find((e) => e.status === "Serving");
  const waitingCount = state.queue.entries.filter((e) => e.status === "Waiting").length;
  const onHoldCount = state.queue.entries.filter((e) => e.status === "On Hold").length;
  const completedCount = state.queue.entries.filter((e) => e.status === "Completed").length;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Now Serving & Queue Control Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
                Front desk queue control
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Queue Management
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-sky-300/30 bg-sky-400/15 px-3 py-1 font-bold text-sky-100">
                {waitingCount} waiting
              </span>
              {onHoldCount > 0 && (
                <span className="rounded-full border border-amber-300/35 bg-amber-300/15 px-3 py-1 font-bold text-amber-100">
                  {onHoldCount} on hold
                </span>
              )}
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 font-bold text-emerald-100">
                {completedCount} completed
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-5 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs sm:p-5 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-teal-300">
                Now Serving
              </p>
              <p className="mt-1 break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {servingEntry
                  ? `${servingEntry.code} — ${servingEntry.patientName}`
                  : `Q-${String(state.queue.nowServingNumber).padStart(3, "0")}`}
              </p>
              <p className="mt-1 text-sm text-teal-100/85">
                {servingEntry ? servingEntry.serviceName : "Ready for next patient"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => queueAction("CALL_NEXT")}
                className="rounded-xl bg-teal-400 px-5 py-2.5 text-xs font-extrabold tracking-wide text-[#052622] shadow-sm transition hover:bg-teal-300 sm:text-sm"
              >
                CALL NEXT
              </button>
              <button
                type="button"
                onClick={() => queueAction("HOLD")}
                className="rounded-xl bg-amber-200 px-4 py-2.5 text-xs font-bold text-amber-950 transition hover:bg-amber-300 sm:text-sm"
              >
                Hold Current
              </button>
              <button
                type="button"
                onClick={() => queueAction("SKIP")}
                className="rounded-xl bg-rose-200 px-4 py-2.5 text-xs font-bold text-rose-950 transition hover:bg-rose-300 sm:text-sm"
              >
                Skip Current
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-teal-200/75 bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-[#062b26]">Queue Entries &amp; Live Statuses</h2>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            {state.queue.entries.length} total ticket{state.queue.entries.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {state.queue.entries.map((entry) => {
            const style = ENTRY_STYLES[entry.status] || ENTRY_STYLES.Waiting;
            return (
              <div
                key={entry.id}
                className={`flex flex-col justify-between gap-3 rounded-xl border border-l-4 p-3.5 sm:flex-row sm:items-center sm:px-4 ${style.card}`}
              >
                <div className="min-w-0 text-sm">
                  <strong className="rounded-md bg-[#052622] px-2 py-0.5 font-mono text-xs text-teal-300">
                    {entry.code}
                  </strong>
                  <span className="mx-2 font-semibold text-[#062b26]">{entry.patientName}</span>
                  <span className="text-xs font-medium text-slate-500">({entry.serviceName})</span>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}>
                    {entry.status}
                  </span>

                  {entry.status !== "Serving" &&
                    entry.status !== "Completed" &&
                    entry.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => queueAction("RECALL", entry.id)}
                      className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800"
                    >
                      Recall / Call
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {state.queue.entries.length === 0 && (
            <p className="rounded-xl border border-teal-100 bg-teal-50/40 py-8 text-center text-sm text-slate-500">
              No patients in the queue yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
