// ============================================================
// OWNER   : Lepon
// FEATURE : Feature 4 Notifications
// ============================================================

import { useEffect, useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";
import {
  isNotificationSoundEnabled,
  playNotificationSound,
  setNotificationSoundEnabled,
} from "@/utils/notificationSound";

const TYPE_STYLES = {
  approaching: {
    label: "Turn Approaching",
    badge: "bg-amber-100 text-amber-900",
    stripe: "border-l-amber-500",
    unreadCard: "border-amber-300/90 bg-gradient-to-r from-amber-50/90 to-white",
    readCard: "border-slate-200/80 bg-white",
    dot: "bg-amber-500",
  },
  next: {
    label: "Next in Line",
    badge: "bg-teal-100 text-teal-900",
    stripe: "border-l-teal-600",
    unreadCard: "border-teal-300 bg-gradient-to-r from-teal-50/90 to-white",
    readCard: "border-slate-200/80 bg-white",
    dot: "bg-teal-500",
  },
  update: {
    label: "Appointment Update",
    badge: "bg-indigo-100 text-indigo-900",
    stripe: "border-l-indigo-500",
    unreadCard: "border-indigo-200 bg-gradient-to-r from-indigo-50/75 to-white",
    readCard: "border-slate-200/80 bg-white",
    dot: "bg-indigo-500",
  },
};

export default function NotificationsPage() {
  const { state, markNotificationRead, markAllNotificationsRead } = useClinicFlowStore();
  const [filter, setFilter] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(() => isNotificationSoundEnabled());

  useEffect(() => {
    const syncPref = (event) => {
      if (typeof event.detail === "boolean") {
        setSoundEnabled(event.detail);
      } else {
        setSoundEnabled(isNotificationSoundEnabled());
      }
    };
    window.addEventListener("clinicflow:sound-pref", syncPref);
    return () => window.removeEventListener("clinicflow:sound-pref", syncPref);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setNotificationSoundEnabled(next);
    if (next) {
      playNotificationSound("update", { force: true });
    }
  };

  const handleTestSound = () => {
    playNotificationSound("next", { force: true });
  };

  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const filtered = state.notifications.filter((n) =>
    filter === "all" ? true : n.type === filter,
  );

  const filterCounts = {
    all: state.notifications.length,
    approaching: state.notifications.filter((n) => n.type === "approaching").length,
    next: state.notifications.filter((n) => n.type === "next").length,
    update: state.notifications.filter((n) => n.type === "update").length,
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Colored Notifications Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Queue &amp; appointment alerts
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Notifications
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  unreadCount > 0
                    ? "bg-amber-300 text-[#052622]"
                    : "border border-white/15 bg-white/10 text-teal-100"
                }`}
              >
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </span>
            </div>
            <p className="mt-2 text-xs text-teal-100/80">
              Live chime alerts play automatically whenever a new clinic update or queue call arrives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                soundEnabled
                  ? "bg-teal-400 text-[#052622] hover:bg-teal-300"
                  : "border border-white/20 bg-white/10 text-teal-100 hover:bg-white/15"
              }`}
            >
              <span aria-hidden="true">{soundEnabled ? "🔔" : "🔕"}</span>
              {soundEnabled ? "Sound: On" : "Sound: Muted"}
            </button>
            <button
              type="button"
              onClick={handleTestSound}
              className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Test sound
            </button>
            <button
              type="button"
              onClick={markAllNotificationsRead}
              disabled={unreadCount === 0}
              className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Mark all read
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          ["all", "All"],
          ["approaching", "Turn Approaching"],
          ["next", "Next in Line"],
          ["update", "Appointment Updates"],
        ].map(([key, label]) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-[#052622] text-white shadow-xs"
                  : "border border-teal-200/80 bg-white text-slate-700 hover:border-teal-500 hover:bg-teal-50/60"
              }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  isActive ? "bg-teal-400 text-[#052622]" : "bg-teal-50 text-teal-800"
                }`}
              >
                {filterCounts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification Cards */}
      <div className="mt-5 space-y-3">
        {filtered.map((item) => {
          const style = TYPE_STYLES[item.type] || TYPE_STYLES.update;
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between gap-3 rounded-2xl border border-l-4 p-4 shadow-2xs transition sm:flex-row sm:items-start sm:p-5 ${
                style.stripe
              } ${item.read ? style.readCard : style.unreadCard}`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {!item.read && (
                    <span
                      className={`size-2 rounded-full ${style.dot}`}
                      aria-label="Unread notification"
                    />
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.badge}`}
                  >
                    {style.label}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{item.time}</span>
                </div>
                <p className="mt-2 font-bold text-[#062b26]">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.message}</p>
              </div>

              {!item.read && (
                <button
                  type="button"
                  onClick={() => markNotificationRead(item.id)}
                  className="self-start whitespace-nowrap rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-teal-800"
                >
                  Mark read
                </button>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/40 py-12 text-center text-sm text-slate-500">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
