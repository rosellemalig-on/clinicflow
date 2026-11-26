import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";

export function PortalLayout({ links, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="flex flex-col bg-[#052622] px-4 py-5 text-white lg:min-h-screen lg:px-4 lg:py-6">
        <div className="px-2">
          <Logo inverse />
        </div>

        <nav
          aria-label={role === "staff" ? "Staff navigation" : "Patient navigation"}
          className="mt-6 flex gap-1.5 overflow-x-auto pb-2 lg:mt-7 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
        >
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/${role}/${path}`}
              className={({ isActive }) =>
                `block min-w-max rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition ${
                  isActive
                    ? "bg-white font-semibold text-[#052622] shadow-xs"
                    : "text-teal-100/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 px-2 pt-5 lg:mt-10 lg:flex-col lg:items-start lg:gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="mt-0.5 text-[11px] font-medium text-teal-400">
              {role === "staff" ? "Staff Account" : "Patient Account"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-left text-xs font-medium text-teal-100/75 transition hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-6 md:px-10 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
