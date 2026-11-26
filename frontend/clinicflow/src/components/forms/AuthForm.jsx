import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
    <form className="mt-7 space-y-4" onSubmit={submit}>
      {registerMode && (
        <label className="field-label">
          Full name
          <input className="field-input" name="name" placeholder="Juan Dela Cruz" required />
        </label>
      )}
      <label className="field-label">
        Email address
        <input
          className="field-input"
          name="email"
          type="email"
          placeholder={staffRole ? "staff@clinicflow.ph" : "you@example.com"}
          required
        />
      </label>
      {registerMode && (
        <label className="field-label">
          Contact number
          <input
            className="field-input"
            name="contactNumber"
            placeholder="+63 912 345 6789"
            required
          />
        </label>
      )}
      {registerMode && staffRole && (
        <label className="field-label">
          Clinic staff access code
          <input
            className="field-input"
            name="accessCode"
            placeholder="Enter clinic invite code"
            required
          />
        </label>
      )}
      <label className="field-label">
        Password
        <input
          className="field-input"
          name="password"
          type="password"
          minLength="8"
          placeholder="At least 8 characters"
          required
        />
      </label>
      {registerMode && (
        <label className="field-label">
          Confirm password
          <input
            className="field-input"
            name="confirmPassword"
            type="password"
            minLength="8"
            placeholder="Re-enter your password"
            required
          />
        </label>
      )}
      {message && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </p>
      )}
      <button className="primary-button mt-2 w-full" disabled={pending}>
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
      <div className="space-y-1.5 pt-1 text-center text-sm text-slate-500">
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
          <>
            <p>
              New clinic staff?{" "}
              <Link
                className="font-semibold text-teal-700 hover:text-teal-800"
                to="/staff-register"
              >
                Register with access code
              </Link>
            </p>
            <p>
              Need patient access?{" "}
              <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/login">
                Patient sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <p>
              New to ClinicFlow?{" "}
              <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/register">
                Create an account
              </Link>
            </p>
            <p>
              Clinic staff?{" "}
              <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/staff-login">
                Staff sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </form>
  );
}
