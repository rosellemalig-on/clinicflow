import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export default function AppointmentsPage() {
  const { state, updateAppointmentStatus } = useClinicFlowStore();
  const [filter, setFilter] = useState("All");

  const filtered = state.appointments.filter((apt) =>
    filter === "All" ? true : apt.status === filter,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Clinic schedule</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
            Appointments
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Track bookings, payment statuses, and consultation completion.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Confirmed", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === tab
                  ? "bg-[#052622] text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:border-teal-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <table className="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Service & Doctor</th>
              <th>Schedule</th>
              <th>Queue</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((apt) => (
              <tr key={apt.id}>
                <td className="font-mono text-xs font-semibold text-slate-500">{apt.id}</td>
                <td>
                  <div className="font-semibold text-[#062b26]">{apt.serviceName}</div>
                  <div className="text-xs text-slate-500">{apt.doctorName}</div>
                </td>
                <td>
                  <div className="text-slate-700">{apt.date}</div>
                  <div className="text-xs text-slate-400">{apt.time}</div>
                </td>
                <td className="font-semibold text-teal-800">{apt.queueNumber}</td>
                <td>
                  <span
                    className={`status-pill ${
                      apt.paymentStatus === "Paid" ? "status-positive" : ""
                    }`}
                  >
                    {apt.paymentStatus}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      apt.status === "Confirmed" ? "status-positive" : ""
                    }`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    {apt.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                        className="table-action"
                      >
                        Complete
                      </button>
                    )}
                    {apt.status === "Confirmed" && (
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                        className="table-action"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No appointments in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
