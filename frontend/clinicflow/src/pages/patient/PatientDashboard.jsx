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

  const stats = [
    {
      label: "Upcoming appointments",
      value: upcomingAppointments.length,
      sub: "Confirmed bookings",
      accent: upcomingAppointments.length > 0 ? "bg-teal-600" : "bg-teal-600",
      fill: upcomingAppointments.length > 0 ? "w-2/3" : "w-1/3",
    },
    {
      label: "Queue number",
      value: activeQueueCode || "—",
      sub: activeQueueCode ? "Live queue ticket" : "No active queue",
      accent: activeQueueCode ? "bg-teal-600" : "bg-slate-300",
      fill: activeQueueCode ? "w-1/2" : "w-1/4",
    },
    {
      label: "Unread updates",
      value: unreadNotifications,
      sub: "Notifications",
      accent: "bg-teal-600",
      fill: unreadNotifications > 0 ? "w-1/2" : "w-1/4",
    },
    {
      label: "Payment status",
      value: latestAppointment ? latestAppointment.paymentStatus : "—",
      sub: "Latest billing record",
      accent:
        latestAppointment?.paymentStatus === "Paid"
          ? "bg-emerald-500"
          : latestAppointment
            ? "bg-amber-400"
            : "bg-slate-300",
      fill: latestAppointment ? "w-1/2" : "w-1/4",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Patient overview</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
        Good day, {firstName}
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Here is what is happening with your clinic care today.
      </p>

      {/* 4 Stat Cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
          >
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-[#062b26]">
              {stat.value}
            </p>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${stat.accent} ${stat.fill}`} />
            </div>
            <p className="mt-2 text-[11px] font-medium text-teal-700">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
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
                <p className="mt-1 text-sm text-slate-500">
                  {nextAppointment.doctorName} · {nextAppointment.date} at{" "}
                  {nextAppointment.time}
                </p>
              </div>
              <span className="rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-teal-800">
                Queue {nextAppointment.queueNumber}
              </span>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No upcoming appointment. Use Book appointment when you are ready.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-amber-200/80 bg-[#fefce8] p-6 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-amber-800">
            Care reminder
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Arrive 10 minutes before your schedule and keep your contact information current.
          </p>
        </section>
      </div>
    </div>
  );
}
