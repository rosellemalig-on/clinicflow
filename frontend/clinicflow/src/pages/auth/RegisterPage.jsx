import { Link } from "react-router-dom";
import { AuthForm } from "@/components/forms/AuthForm";

export function RegisterPage({ role = "patient" }) {
  const isStaff = role === "staff";

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-xl border border-teal-200/70 bg-teal-50/60 p-1">
        <Link
          to="/register"
          className={`rounded-lg py-2 text-center text-xs font-bold transition ${
            !isStaff
              ? "bg-[#052622] text-white shadow-xs"
              : "text-teal-900/75 hover:bg-white/70 hover:text-[#052622]"
          }`}
        >
          Patient Sign Up
        </Link>
        <Link
          to="/staff-register"
          className={`rounded-lg py-2 text-center text-xs font-bold transition ${
            isStaff
              ? "bg-[#052622] text-white shadow-xs"
              : "text-teal-900/75 hover:bg-white/70 hover:text-[#052622]"
          }`}
        >
          Staff Sign Up
        </Link>
      </div>

      <span
        className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] ${
          isStaff ? "bg-amber-100 text-amber-900" : "bg-teal-100 text-teal-800"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${isStaff ? "bg-amber-500" : "bg-teal-600"}`}
          aria-hidden="true"
        />
        {isStaff ? "Authorized staff onboarding" : "New patient account"}
      </span>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#062b26]">
        {isStaff ? "Create a staff account" : "Create your patient account"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isStaff
          ? "Enter your clinic staff invite code to set up access to schedules, queues, and patient records."
          : "Register once, keep your information secure, and reuse it for every future appointment."}
      </p>
      <AuthForm mode="register" role={role} />
    </>
  );
}
