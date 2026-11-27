// ============================================================
// OWNER   : Lepon
// FEATURE : Feature 5 & 6 — My Queue & Appointment History
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const CANCEL_CUTOFF_MS = 20 * 60 * 1000;

const HISTORY_FILTERS = [
  ["all", "All"],
  ["Confirmed", "Upcoming"],
  ["Completed", "Completed"],
  ["Cancelled", "Cancelled"],
];

function parseScheduledTimestamp(apt) {
  if (!apt) return null;

  if (apt.scheduledAt) {
    const match = String(apt.scheduledAt).match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/,
    );
    if (match) {
      const [, y, m, d, hh, mm, ss = "0"] = match;
      return new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss),
      ).getTime();
    }
  }

  if (apt.date && apt.time) {
    const dateParts = String(apt.date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const timeParts = String(apt.time)
      .trim()
      .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (dateParts && timeParts) {
      let hours = Number(timeParts[1]);
      const minutes = Number(timeParts[2]);
      const meridiem = timeParts[3].toUpperCase();
      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
      return new Date(
        Number(dateParts[1]),
        Number(dateParts[2]) - 1,
        Number(dateParts[3]),
        hours,
        minutes,
        0,
      ).getTime();
    }
  }

  return null;
}

function getCancellationState(apt, nowMs, queueStatus = null) {
  if (!apt || apt.status !== "Confirmed") {
    return { canCancel: false, locked: false, reason: "" };
  }

  if (queueStatus === "Serving") {
    return {
      canCancel: false,
      locked: true,
      reason: "Currently being served — cannot cancel",
    };
  }

  const scheduledMs = parseScheduledTimestamp(apt);
  if (scheduledMs == null) {
    return { canCancel: true, locked: false, reason: "" };
  }

  const msRemaining = scheduledMs - nowMs;
  if (msRemaining <= 0) {
    return {
      canCancel: false,
      locked: true,
      reason: "Scheduled time has passed",
    };
  }

  if (msRemaining <= CANCEL_CUTOFF_MS) {
    const minsLeft = Math.max(1, Math.ceil(msRemaining / 60000));
    return {
      canCancel: false,
      locked: true,
      reason: `Cannot cancel within 20 mins (${minsLeft}m left)`,
    };
  }

  return { canCancel: true, locked: false, reason: "" };
}

export default function MyQueuePage() {
  const { state, cancelAppointment } = useClinicFlowStore();
  const [historyFilter, setHistoryFilter] = useState("all");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const {
    nowServingNumber,
    patientQueueNumber,
    patientQueueCode,
    patientQueueStatus,
    hasActiveTicket,
    patientServiceName,
    patientDoctorName,
    patientAppointmentId,
    avgMinutesPerPatient,
  } = state.queue;

  const hasTicket =
    patientQueueNumber > 0 && patientQueueStatus !== "Cancelled";
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

  const activeAppointment =
    (patientAppointmentId != null
      ? state.appointments.find((a) => a.appointmentId === patientAppointmentId)
      : null) ||
    (patientQueueCode
      ? state.appointments.find(
          (a) => a.queueNumber === patientQueueCode && a.status === "Confirmed",
        )
      : null) ||
    null;

  const activeCancelState = getCancellationState(
    activeAppointment,
    nowMs,
    patientQueueStatus,
  );

  const approachingAlert = state.notifications.find(
    (n) => !n.read && (n.type === "approaching" || n.type === "next"),
  );
  const showQueueAlert = Boolean(approachingAlert) || (isActiveTicket && peopleAhead <= 3);

  const filteredAppointments = state.appointments.filter((apt) =>
    historyFilter === "all" ? true : apt.status === historyFilter,
  );

  const handleConfirmCancel = async (apt) => {
    setCancelFeedback(null);
    setCancellingId(apt.id);
    try {
      await cancelAppointment(apt.id);
      setConfirmingId(null);
      setCancelFeedback({
        type: "success",
        text: `Cancelled ${apt.serviceName} (${apt.date} at ${apt.time}). Your slot has been released.`,
      });
    } catch (err) {
      setCancelFeedback({
        type: "error",
        text: err.message || "Unable to cancel this appointment.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Live queue &amp; visit log</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#062b26] sm:text-3xl">
        Queue &amp; Appointment History
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Track your current queue position in real time and manage or cancel upcoming appointments (up to 20 minutes before schedule).
      </p>

      {cancelFeedback && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xs ${
            cancelFeedback.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-rose-300 bg-rose-50 text-rose-800"
          }`}
        >
          {cancelFeedback.text}
        </div>
      )}

      {/* Live Queue Tracker */}
      <section className="mt-6 rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-5 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[.12em] text-teal-200/80">
              {serviceHeading}
              {patientDoctorName ? ` · ${patientDoctorName.toUpperCase()}` : ""}
            </p>
            <p className="mt-1 text-lg font-bold sm:text-xl">{statusText}</p>
            {activeAppointment && isActiveTicket && (
              <p className="mt-1 text-xs text-teal-200/85">
                Scheduled: {activeAppointment.date} at {activeAppointment.time}
              </p>
            )}
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

            {/* Active Ticket Cancellation Bar */}
            {isActiveTicket && activeAppointment && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
                {activeCancelState.canCancel ? (
                  confirmingId === `hero-${activeAppointment.id}` ? (
                    <>
                      <p className="text-xs font-medium text-amber-200">
                        Cancel {activeAppointment.serviceName} ({activeAppointment.date} at{" "}
                        {activeAppointment.time})?
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                        >
                          Keep appointment
                        </button>
                        <button
                          type="button"
                          disabled={cancellingId === activeAppointment.id}
                          onClick={() => handleConfirmCancel(activeAppointment)}
                          className="rounded-lg bg-rose-500 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
                        >
                          {cancellingId === activeAppointment.id
                            ? "Cancelling…"
                            : "Yes, cancel"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-teal-100/80">
                        Need to reschedule? You can cancel up to 20 minutes before your appointment.
                      </p>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(`hero-${activeAppointment.id}`)}
                        className="rounded-xl border border-rose-300/45 bg-rose-500/20 px-3.5 py-2 text-xs font-bold text-rose-100 transition hover:bg-rose-500/35"
                      >
                        Cancel appointment
                      </button>
                    </>
                  )
                ) : (
                  <p className="text-xs font-medium text-amber-200/95">
                    Cancellation locked: {activeCancelState.reason}
                  </p>
                )}
              </div>
            )}
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
              {state.appointments.length === 1 ? "recorded visit" : "recorded visits"} · Cancel upcoming visits anytime until 20 mins before schedule
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

            const isCurrentServingApt =
              patientQueueStatus === "Serving" &&
              (apt.appointmentId === patientAppointmentId ||
                apt.queueNumber === patientQueueCode);
            const cancelState = getCancellationState(
              apt,
              nowMs,
              isCurrentServingApt ? "Serving" : null,
            );
            const isConfirmingRow = confirmingId === `row-${apt.id}`;

            return (
              <div
                key={apt.id}
                className={`rounded-2xl border border-l-4 p-4 shadow-2xs sm:p-5 ${cardAccent}`}
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="font-bold text-[#062b26]">{apt.serviceName}</p>
                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                      {apt.doctorName} · {apt.date} at {apt.time} · Queue {apt.queueNumber}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2.5">
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

                    {cancelState.canCancel && !isConfirmingRow && (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(`row-${apt.id}`)}
                        className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:border-rose-400 hover:bg-rose-100"
                      >
                        Cancel
                      </button>
                    )}

                    {cancelState.locked && (
                      <span
                        title={cancelState.reason}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900"
                      >
                        {cancelState.reason}
                      </span>
                    )}
                  </div>
                </div>

                {isConfirmingRow && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rose-200/70 pt-3">
                    <p className="text-xs font-semibold text-rose-800">
                      Are you sure you want to cancel this appointment?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        disabled={cancellingId === apt.id}
                        onClick={() => handleConfirmCancel(apt)}
                        className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-60"
                      >
                        {cancellingId === apt.id ? "Cancelling…" : "Confirm cancel"}
                      </button>
                    </div>
                  </div>
                )}
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
