import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { state } = useClinicFlowStore();

  const fullName = state.patient.fullName || user?.name || "Patient";
  const firstName = fullName.trim().split(/\s+/)[0];

  const upcomingAppointments = state.appointments.filter((a) => a.status === "Confirmed");
  const nextAppointment = upcomingAppointments[0] || null;
  const unreadNotifications = state.notifications.filter((n) => !n.read).length;
  const latestAppointment = state.appointments[0] || null;
  const activeQueueCode = nextAppointment?.queueNumber || null;

  const paymentCardSurface =
    latestAppointment?.paymentStatus === "Paid"
      ? "border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/70"
      : latestAppointment?.paymentStatus === "For Verification"
        ? "border-sky-200/80 bg-gradient-to-br from-white to-sky-50/70"
        : latestAppointment
          ? "border-amber-200/80 bg-gradient-to-br from-white to-amber-50/70"
          : "border-slate-200/80 bg-white";

  const stats = [
    {
      label: "Upcoming appointments",
      value: upcomingAppointments.length,
      sub: "Confirmed bookings",
      surface: "border-teal-200/80 bg-gradient-to-br from-white to-teal-50/70",
      subColor: "text-teal-700",
      accent: "bg-teal-600",
      fill: upcomingAppointments.length > 0 ? "w-2/3" : "w-1/3",
    },
    {
      label: "Queue number",
      value: activeQueueCode || "—",
      sub: activeQueueCode ? "Live queue ticket" : "No active queue",
      surface: "border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/65",
      subColor: "text-emerald-700",
      accent: activeQueueCode ? "bg-emerald-600" : "bg-slate-300",
      fill: activeQueueCode ? "w-1/2" : "w-1/4",
    },
    {
      label: "Unread updates",
      value: unreadNotifications,
      sub: "Notifications",
      surface: "border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/65",
      subColor: "text-indigo-700",
      accent: unreadNotifications > 0 ? "bg-indigo-600" : "bg-teal-600",
      fill: unreadNotifications > 0 ? "w-1/2" : "w-1/4",
    },
    {
      label: "Payment status",
      value: latestAppointment ? latestAppointment.paymentStatus : "—",
      sub: "Latest billing record",
      surface: paymentCardSurface,
      subColor:
        latestAppointment?.paymentStatus === "Paid"
          ? "text-emerald-700"
          : latestAppointment?.paymentStatus === "For Verification"
            ? "text-sky-700"
            : "text-amber-700",
      accent:
        latestAppointment?.paymentStatus === "Paid"
          ? "bg-emerald-500"
          : latestAppointment?.paymentStatus === "For Verification"
            ? "bg-sky-500"
            : latestAppointment
              ? "bg-amber-400"
              : "bg-slate-300",
      fill: latestAppointment ? "w-1/2" : "w-1/4",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Patient overview
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Good day, {firstName}
            </h1>
            <p className="mt-1.5 text-xs text-teal-100/85 sm:text-sm">
              Here is what is happening with your clinic care today.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              to="/patient/book"
              className="inline-flex items-center rounded-xl bg-teal-400 px-4 py-2.5 text-xs font-extrabold text-[#052622] shadow-sm transition hover:bg-teal-300"
            >
              Book appointment →
            </Link>
            <Link
              to="/patient/queue"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Queue &amp; history
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Color-Tinted Stat Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border p-5 shadow-2xs ${stat.surface}`}
          >
            <p className="text-xs font-semibold text-slate-600">{stat.label}</p>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-[#062b26]">
              {stat.value}
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
              <div className={`h-full rounded-full ${stat.accent} ${stat.fill}`} />
            </div>
            <p className={`mt-2 text-[11px] font-semibold ${stat.subColor}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-teal-200/80 border-l-4 border-l-teal-600 bg-gradient-to-r from-teal-50/55 to-white p-6 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-teal-700">
              Next visit
            </p>
            <Link
              to="/patient/book"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Book appointment →
            </Link>
          </div>

          {nextAppointment ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-base font-bold text-[#062b26]">
                  {nextAppointment.serviceName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {nextAppointment.doctorName} · {nextAppointment.date} at{" "}
                  {nextAppointment.time}
                </p>
              </div>
              <span className="rounded-full bg-[#052622] px-3.5 py-1.5 text-xs font-bold text-teal-300">
                Queue {nextAppointment.queueNumber}
              </span>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              No upcoming appointment. Use Book appointment when you are ready.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-amber-300/80 border-l-4 border-l-amber-500 bg-gradient-to-br from-[#fefce8] to-amber-50 p-6 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-amber-800">
            Care reminder
          </p>
          <p className="mt-3 text-sm leading-6 text-amber-950/85">
            Arrive 10 minutes before your schedule and keep your contact information current.
          </p>
        </section>
      </div>
    </div>
  );
}
