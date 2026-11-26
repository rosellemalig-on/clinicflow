import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Staff administration</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
            Patient management
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Search registered patients and view their latest clinic visits.
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients by name, email, or ID..."
          className="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
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
            {filtered.map((patient) => (
              <tr key={`${patient.id}-${patient.fullName}`}>
                <td className="font-mono text-xs font-semibold text-slate-500">{patient.id}</td>
                <td className="font-semibold text-[#062b26]">{patient.fullName}</td>
                <td>
                  <div className="text-slate-700">{patient.email}</div>
                  <div className="text-xs text-slate-400">{patient.phone}</div>
                </td>
                <td>{patient.lastService}</td>
                <td>
                  <span className="status-pill">{patient.queueStatus}</span>
                </td>
              </tr>
            ))}
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
