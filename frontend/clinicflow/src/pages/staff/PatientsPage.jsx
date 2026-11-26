import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const QUEUE_STATUS_STYLES = {
  Serving: "bg-emerald-100 text-emerald-800",
  Waiting: "bg-sky-100 text-sky-800",
  "On Hold": "bg-amber-100 text-amber-900",
  Skipped: "bg-rose-100 text-rose-800",
  Completed: "bg-teal-100 text-teal-800",
};

export default function PatientsPage() {
  const { state } = useClinicFlowStore();
  const [query, setQuery] = useState("");

  const allPatients = state.patients.length > 0
    ? state.patients
    : state.queue.entries.map((entry) => ({
        id: entry.id,
        fullName: entry.patientName,
        email: "—",
        phone: "—",
        lastService: entry.serviceName,
        queueStatus: entry.status,
      }));

  const filtered = allPatients.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Header Banner with Integrated Search */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Staff administration
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Patient management
              </h1>
              <span className="rounded-full bg-teal-400 px-3 py-1 text-xs font-extrabold text-[#052622]">
                {allPatients.length} registered
              </span>
            </div>
            <p className="mt-1.5 text-xs text-teal-100/85 sm:text-sm">
              Search registered patients and view their latest clinic visits.
            </p>
          </div>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients by name, email, or ID..."
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-teal-200/75 outline-none backdrop-blur-xs transition focus:border-teal-300 focus:bg-white focus:text-[#062b26] focus:placeholder:text-slate-400 sm:max-w-xs"
          />
        </div>
      </section>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-teal-200/75 bg-white shadow-2xs">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Latest Service</th>
              <th>Queue Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => {
              const badgeClasses =
                QUEUE_STATUS_STYLES[patient.queueStatus] || "bg-slate-100 text-slate-600";
              return (
                <tr key={`${patient.id}-${patient.fullName}`}>
                  <td className="font-mono text-xs font-semibold text-teal-700">{patient.id}</td>
                  <td className="font-semibold text-[#062b26]">{patient.fullName}</td>
                  <td>
                    <div className="text-slate-700">{patient.email}</div>
                    <div className="text-xs text-slate-400">{patient.phone}</div>
                  </td>
                  <td className="font-medium text-slate-700">{patient.lastService}</td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${badgeClasses}`}
                    >
                      {patient.queueStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No patients match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
