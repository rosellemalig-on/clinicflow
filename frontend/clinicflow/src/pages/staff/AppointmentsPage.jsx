import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const TABS = ["All", "Confirmed", "Completed", "Cancelled"];

export default function AppointmentsPage() {
  const { state, updateAppointmentStatus, confirmPayment } = useClinicFlowStore();
  const [filter, setFilter] = useState("All");

  const filtered = state.appointments.filter((apt) =>
    filter === "All" ? true : apt.status === filter,
  );

  const counts = {
    All: state.appointments.length,
    Confirmed: state.appointments.filter((a) => a.status === "Confirmed").length,
    Completed: state.appointments.filter((a) => a.status === "Completed").length,
    Cancelled: state.appointments.filter((a) => a.status === "Cancelled").length,
  };
  const verifyingCount = state.appointments.filter(
    (a) => a.paymentStatus === "For Verification",
  ).length;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Appointments Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Clinic schedule
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Appointments
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs text-teal-100/85 sm:text-sm">
              Track bookings, verify submitted payment reference numbers, confirm cash payments, and complete consultations.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/15 px-3.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Confirmed
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-white">{counts.Confirmed}</p>
            </div>
            <div className="rounded-xl border border-sky-300/30 bg-sky-400/15 px-3.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                To Verify
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-white">{verifyingCount}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 px-3.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200/85">
                Completed
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-teal-300">{counts.Completed}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-[#052622] text-white shadow-xs"
                  : "border border-teal-200/80 bg-white text-slate-700 hover:border-teal-500 hover:bg-teal-50/60"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  isActive ? "bg-teal-400 text-[#052622]" : "bg-teal-50 text-teal-800"
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-teal-200/75 bg-white shadow-2xs">
        <table className="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Patient &amp; Service</th>
              <th>Schedule</th>
              <th>Queue</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((apt) => {
              const isPaid = apt.paymentStatus === "Paid";
              const isVerifying = apt.paymentStatus === "For Verification";
              return (
                <tr key={apt.id}>
                  <td className="font-mono text-xs font-semibold text-teal-700">{apt.id}</td>
                  <td>
                    <div className="font-semibold text-[#062b26]">{apt.patientName}</div>
                    <div className="text-xs font-medium text-teal-800/80">{apt.serviceName}</div>
                    <div className="text-xs text-slate-400">{apt.doctorName}</div>
                  </td>
                  <td>
                    <div className="font-medium text-slate-700">{apt.date}</div>
                    <div className="text-xs text-slate-400">{apt.time}</div>
                  </td>
                  <td>
                    <span className="inline-flex rounded-lg bg-teal-50 px-2.5 py-1 font-mono text-xs font-bold text-teal-800">
                      {apt.queueNumber}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-800"
                          : isVerifying
                            ? "bg-sky-100 text-sky-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {apt.paymentStatus}
                    </span>
                    <div className="mt-1 text-xs text-slate-600">
                      {apt.paymentMethod && apt.paymentMethod !== "Unselected"
                        ? apt.paymentMethod
                        : "Not selected"}
                    </div>
                    {apt.paymentReference && (
                      <div className="mt-0.5 font-mono text-[11px] font-semibold text-teal-800">
                        Ref: {apt.paymentReference}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        apt.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : apt.status === "Completed"
                            ? "bg-teal-100 text-teal-800"
                            : apt.status === "Cancelled"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {!isPaid && apt.status !== "Cancelled" && (
                        <button
                          type="button"
                          onClick={() =>
                            confirmPayment(
                              apt.id,
                              apt.paymentMethod && apt.paymentMethod !== "Unselected"
                                ? apt.paymentMethod
                                : "Cash at Clinic",
                              apt.paymentReference || "",
                              "staff",
                            )
                          }
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                            isVerifying
                              ? "border-teal-700 bg-teal-700 text-white hover:bg-teal-800"
                              : "border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          }`}
                        >
                          {isVerifying ? "Verify & Mark Paid" : "Confirm Cash"}
                        </button>
                      )}
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
                          className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:border-rose-400 hover:bg-rose-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
