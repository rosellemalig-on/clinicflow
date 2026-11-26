import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AUTH_INPUT_CLASS =
  "mt-1.5 block w-full rounded-xl border border-teal-200/85 bg-teal-50/35 px-4 py-2.5 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20";

export function AuthForm({ mode = "login", role = "patient" }) {
  const { login, register, registerStaff } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const registerMode = mode === "register";
  const staffRole = role === "staff";

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      if (registerMode) {
        if (form.get("password") !== form.get("confirmPassword")) {
          throw new Error("Passwords do not match.");
        }
        const payload = {
          name: String(form.get("name") || "").trim(),
          email: String(form.get("email") || "").trim(),
          contactNumber: String(form.get("contactNumber") || "").trim(),
          password: String(form.get("password") || ""),
        };
        if (staffRole) {
          await registerStaff({
            ...payload,
            accessCode: String(form.get("accessCode") || "").trim(),
          });
          navigate("/staff/dashboard");
        } else {
          await register(payload);
          navigate("/patient/dashboard");
        }
      } else {
        await login(
          String(form.get("email") || "").trim(),
          String(form.get("password") || ""),
          role,
        );
        navigate(staffRole ? "/staff/dashboard" : "/patient/dashboard");
      }
    } catch (error) {
      setMessage(error.message || "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={submit}>
      {registerMode && (
        <label className="block text-xs font-semibold text-[#062b26]">
          Full name
          <input className={AUTH_INPUT_CLASS} name="name" placeholder="Juan Dela Cruz" required />
        </label>
      )}
      <label className="block text-xs font-semibold text-[#062b26]">
        Email address
        <input
          className={AUTH_INPUT_CLASS}
          name="email"
          type="email"
          placeholder={staffRole ? "staff@clinicflow.ph" : "you@example.com"}
          required
        />
      </label>
      {registerMode && (
        <label className="block text-xs font-semibold text-[#062b26]">
          Contact number
          <input
            className={AUTH_INPUT_CLASS}
            name="contactNumber"
            placeholder="+63 912 345 6789"
            required
          />
        </label>
      )}
      {registerMode && staffRole && (
        <label className="block text-xs font-semibold text-[#062b26]">
          Clinic staff access code
          <input
            className="mt-1.5 block w-full rounded-xl border border-amber-300/90 bg-amber-50/45 px-4 py-2.5 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
            name="accessCode"
            placeholder="Enter clinic invite code"
            required
          />
        </label>
      )}
      <label className="block text-xs font-semibold text-[#062b26]">
        Password
        <input
          className={AUTH_INPUT_CLASS}
          name="password"
          type="password"
          minLength="8"
          placeholder="At least 8 characters"
          required
        />
      </label>
      {registerMode && (
        <label className="block text-xs font-semibold text-[#062b26]">
          Confirm password
          <input
            className={AUTH_INPUT_CLASS}
            name="confirmPassword"
            type="password"
            minLength="8"
            placeholder="Re-enter your password"
            required
          />
        </label>
      )}
      {message && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {message}
        </p>
      )}
      <button
        className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#052622] to-teal-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-teal-950/15 transition hover:from-[#073630] hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
      >
        {pending
          ? "Please wait…"
          : registerMode
            ? staffRole
              ? "Create staff account"
              : "Create patient account"
            : staffRole
              ? "Sign in as staff"
              : "Sign in"}
      </button>
      <div className="space-y-1.5 border-t border-teal-100 pt-4 text-center text-sm text-slate-500">
        {registerMode ? (
          <p>
            Already registered?{" "}
            <Link
              className="font-semibold text-teal-700 hover:text-teal-800"
              to={staffRole ? "/staff-login" : "/login"}
            >
              {staffRole ? "Staff sign in" : "Sign in"}
            </Link>
          </p>
        ) : staffRole ? (
          <p>
            New clinic staff?{" "}
            <Link
              className="font-semibold text-teal-700 hover:text-teal-800"
              to="/staff-register"
            >
              Register with access code
            </Link>
          </p>
        ) : (
          <p>
            New to ClinicFlow?{" "}
            <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/register">
              Create an account
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
