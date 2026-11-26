import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export function PortalLayout({ links, role }) {
  const { user, logout } = useAuth();
  const { state } = useClinicFlowStore();
  const navigate = useNavigate();
  const [liveToast, setLiveToast] = useState(null);

  useEffect(() => {
    if (role !== "patient") return undefined;

    let dismissTimer = null;
    const handleNotification = (event) => {
      const notification = event.detail;
      if (!notification) return;
      setLiveToast(notification);
      if (dismissTimer) window.clearTimeout(dismissTimer);
      dismissTimer = window.setTimeout(() => {
        setLiveToast(null);
      }, 6500);
    };

    window.addEventListener("clinicflow:notification", handleNotification);
    return () => {
      window.removeEventListener("clinicflow:notification", handleNotification);
      if (dismissTimer) window.clearTimeout(dismissTimer);
    };
  }, [role]);

  if (!user) {
    return <Navigate to={role === "staff" ? "/staff-login" : "/login"} replace />;
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === "staff" ? "/staff/dashboard" : "/patient/dashboard"}
        replace
      />
    );
  }

  const unreadNotifications =
    role === "patient" ? state.notifications.filter((n) => !n.read).length : 0;

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f4f7f6] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex flex-col bg-[#052622] px-4 py-4 text-white lg:sticky lg:top-0 lg:h-dvh lg:self-start lg:overflow-hidden lg:px-4 lg:py-5">
        <div className="flex shrink-0 items-center justify-between gap-3 px-1">
          <Logo inverse />
          <div className="flex items-center gap-3 lg:hidden">
            <div className="hidden text-right sm:block">
              <p className="max-w-[140px] truncate text-xs font-semibold text-white">
                {user.name}
              </p>
              <p className="text-[11px] font-medium text-teal-400">
                {role === "staff" ? "Staff" : "Patient"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-teal-100 transition hover:bg-white/15 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav
          aria-label={role === "staff" ? "Staff navigation" : "Patient navigation"}
          className="sidebar-scroll mt-4 flex gap-1.5 overflow-x-auto pb-1 lg:mt-5 lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0"
        >
          {links.map(([path, label]) => {
            const showUnreadBadge =
              role === "patient" && path === "notifications" && unreadNotifications > 0;
            return (
              <NavLink
                key={path}
                to={`/${role}/${path}`}
                className={({ isActive }) =>
                  `flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
                    isActive
                      ? "bg-white font-semibold text-[#052622] shadow-xs"
                      : "text-teal-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{label}</span>
                    {showUnreadBadge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold leading-none ${
                          isActive
                            ? "bg-teal-700 text-white"
                            : "bg-teal-400 text-[#052622]"
                        }`}
                      >
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-4 hidden shrink-0 border-t border-white/10 px-2 pt-4 lg:flex lg:flex-col lg:items-start lg:gap-2.5">
          <div className="w-full min-w-0">
            <p className="truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="mt-0.5 text-[11px] font-medium text-teal-400">
              {role === "staff" ? "Staff Account" : "Patient Account"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs font-medium text-teal-100/85 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10">
        <Outlet />
      </main>

      {role === "patient" && liveToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border border-teal-500/30 bg-[#052622] p-4 text-white shadow-2xl shadow-teal-950/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-teal-300">
                New notification
              </p>
              <p className="mt-1 text-sm font-bold text-white">{liveToast.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-teal-100/85">
                {liveToast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLiveToast(null)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-teal-200/80 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setLiveToast(null);
                navigate("/patient/notifications");
              }}
              className="rounded-lg bg-teal-400 px-3 py-1.5 text-xs font-bold text-[#052622] transition hover:bg-teal-300"
            >
              View notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
