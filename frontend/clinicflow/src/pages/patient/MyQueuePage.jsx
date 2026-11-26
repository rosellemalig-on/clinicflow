// ============================================================
// OWNER   : Lepon
// FEATURE : Feature 5 & 6 — My Queue & Appointment History
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const HISTORY_FILTERS = [
  ["all", "All"],
  ["Confirmed", "Upcoming"],
  ["Completed", "Completed"],
  ["Cancelled", "Cancelled"],
];

export default function MyQueuePage() {
  const { state } = useClinicFlowStore();
  const [historyFilter, setHistoryFilter] = useState("all");

  const {
    nowServingNumber,
    patientQueueNumber,
    patientQueueCode,
    patientQueueStatus,
    hasActiveTicket,
    patientServiceName,
    patientDoctorName,
    avgMinutesPerPatient,
  } = state.queue;

  const hasTicket = patientQueueNumber > 0;
  const isActiveTicket = hasActiveTicket && hasTicket;
  const peopleAhead = hasTicket ? Math.max(0, patientQueueNumber - nowServingNumber) : 0;
  const estWaitMin = peopleAhead * avgMinutesPerPatient;
  const progressPct =
    !hasTicket
      ? 0
      : patientQueueStatus === "Completed" ||
          patientQueueStatus === "Serving" ||
          patientQueueNumber <= 1
        ? 100
        : Math.min(100, Math.max(8, Math.round((nowServingNumber / patientQueueNumber) * 100)));

  const statusText = !hasTicket
    ? "No active queue ticket yet"
    : patientQueueStatus === "Completed"
      ? "Visit completed"
      : patientQueueStatus === "On Hold"
        ? "Your queue ticket is on hold"
        : patientQueueStatus === "Skipped"
          ? "Ticket skipped — please check with front desk"
          : patientQueueStatus === "Serving" || peopleAhead === 0
            ? "It's your turn now!"
            : peopleAhead === 1
              ? "You are next in line"
              : peopleAhead <= 3
                ? "Approaching — stay near the clinic"
                : "In queue";

  const badgeLabel = !hasTicket ? "Not in Queue" : patientQueueStatus || "Live Status";
  const serviceHeading = (patientServiceName || "CLINIC QUEUE").toUpperCase();

  const approachingAlert = state.notifications.find(
    (n) => !n.read && (n.type === "approaching" || n.type === "next"),
  );
  const showQueueAlert = Boolean(approachingAlert) || (isActiveTicket && peopleAhead <= 3);

  const filteredAppointments = state.appointments.filter((apt) =>
    historyFilter === "all" ? true : apt.status === historyFilter,
  );

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Live queue &amp; visit log</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#062b26] sm:text-3xl">
        Queue &amp; Appointment History
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Track your current queue position in real time and review your recorded clinic visits.
      </p>

      {/* Live Queue Tracker */}
      <section className="mt-6 rounded-2xl bg-[#062b26] p-5 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[.12em] text-teal-200/80">
              {serviceHeading}
              {patientDoctorName ? ` · ${patientDoctorName.toUpperCase()}` : ""}
            </p>
            <p className="mt-1 text-lg font-bold sm:text-xl">{statusText}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              hasTicket ? "bg-teal-400 text-[#062b26]" : "bg-white/15 text-white"
            }`}
          >
            {badgeLabel}
          </span>
        </div>

        {hasTicket ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-4 text-[#062b26]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Your Number
                </p>
                <p className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
                  {patientQueueCode || `Q-${String(patientQueueNumber).padStart(3, "0")}`}
                </p>
              </div>

              <div className="rounded-xl bg-[#0f766e] p-4 text-white">
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-100/85">
                  Now Serving
                </p>
                <p className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
                  Q-{String(nowServingNumber).padStart(3, "0")}
                </p>
              </div>

              <div className="rounded-xl bg-[#113e38] p-4 text-white">
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-100/80">
                  People Ahead
                </p>
                <p className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
                  {patientQueueStatus === "Completed" || patientQueueStatus === "Skipped"
                    ? 0
                    : peopleAhead}
                </p>
              </div>

              <div className="rounded-xl bg-[#fde68a] p-4 text-[#062b26]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b4b12]">
                  Est. Wait
                </p>
                <p className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
                  {patientQueueStatus === "Completed" || patientQueueStatus === "Skipped"
                    ? "0 min"
                    : `${estWaitMin} min`}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-teal-100 sm:text-sm">
                <span>Queue Progress Toward Your Turn</span>
                <strong className="text-white">{progressPct}%</strong>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-teal-300 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <p className="text-sm text-teal-100/90">
              Clinic is currently serving{" "}
              <strong className="text-white">
                Q-{String(nowServingNumber).padStart(3, "0")}
              </strong>
              . Book an appointment to receive your live queue number.
            </p>
            <Link
              to="/patient/book"
              className="inline-flex shrink-0 items-center rounded-xl bg-teal-400 px-4 py-2.5 text-xs font-bold text-[#062b26] transition hover:bg-teal-300"
            >
              Book an appointment →
            </Link>
          </div>
        )}
      </section>

      {/* Approaching / Next Turn Alert */}
      {showQueueAlert && (
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
          <p className="text-sm font-bold">
            {approachingAlert?.title ||
              (peopleAhead === 0 ? "It's your turn now" : "Your turn is approaching")}
          </p>
          <p className="mt-1 text-sm text-amber-900">
            {approachingAlert
              ? approachingAlert.message
              : `Now serving Q-${String(nowServingNumber).padStart(3, "0")}. ${peopleAhead} patient(s) ahead of ${patientQueueCode || `Q-${String(patientQueueNumber).padStart(3, "0")}`}.`}
          </p>
        </div>
      )}

      {/* Past & Recorded Appointments */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#062b26]">
              Appointment History
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {state.appointments.length}{" "}
              {state.appointments.length === 1 ? "recorded visit" : "recorded visits"}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {HISTORY_FILTERS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setHistoryFilter(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  historyFilter === key
                    ? "bg-[#052622] text-white"
                    : "border border-slate-300 bg-white text-slate-600 hover:border-teal-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredAppointments.map((apt) => {
            const cardAccent =
              apt.status === "Completed"
                ? "border-emerald-200/80 border-l-emerald-500 bg-gradient-to-r from-emerald-50/40 to-white"
                : apt.status === "Cancelled"
                  ? "border-rose-200/80 border-l-rose-400 bg-gradient-to-r from-rose-50/40 to-white"
                  : "border-teal-200/80 border-l-teal-600 bg-gradient-to-r from-teal-50/45 to-white";

            return (
              <div
                key={apt.id}
                className={`flex flex-col justify-between gap-3 rounded-2xl border border-l-4 p-4 shadow-2xs sm:flex-row sm:items-center sm:p-5 ${cardAccent}`}
              >
                <div className="min-w-0">
                  <p className="font-bold text-[#062b26]">{apt.serviceName}</p>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                    {apt.doctorName} · {apt.date} at {apt.time} · Queue {apt.queueNumber}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      apt.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : apt.status === "Cancelled"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-teal-100 text-teal-800"
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span className="font-bold text-[#062b26]">
                    ₱{Number(apt.fee || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
          {filteredAppointments.length === 0 && (
            <div className="rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/40 py-10 text-center text-sm text-slate-500">
              {state.appointments.length === 0
                ? "No recorded appointments yet."
                : "No appointments match this filter."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
