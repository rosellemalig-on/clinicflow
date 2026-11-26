import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const EMPTY_FORM = {
  name: "",
  email: "",
  contactNumber: "",
  password: "",
};

const INPUT_CLASS =
  "w-full min-w-0 rounded-xl border border-teal-200/80 bg-teal-50/30 px-3.5 py-2.5 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20";

export default function StaffAccountsPage() {
  const { user } = useAuth();
  const { state, addStaffAccount, toggleStaffAccountStatus } = useClinicFlowStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const activeStaffCount = state.staffAccounts.filter((a) => a.active).length;
  const inactiveStaffCount = state.staffAccounts.length - activeStaffCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setSubmitting(true);
    try {
      const created = await addStaffAccount(form);
      setForm(EMPTY_FORM);
      setStatusMessage({
        type: "success",
        text: `Staff account created for ${created.name} (${created.email}).`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to create staff account.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (account) => {
    setStatusMessage(null);
    try {
      await toggleStaffAccountStatus(account.staffId, !account.active);
      setStatusMessage({
        type: "success",
        text: `${account.name} has been ${account.active ? "deactivated" : "reactivated"}.`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Unable to update staff account status.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Staff Accounts Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Staff administration
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Staff accounts
            </h1>
            <p className="mt-1.5 text-xs text-teal-100/85 sm:text-sm">
              Create clinic staff logins and manage active portal access.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/15 px-3.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Active
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-white">{activeStaffCount}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 px-3.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200/85">
                Inactive
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-teal-200">{inactiveStaffCount}</p>
            </div>
          </div>
        </div>
      </section>

      {statusMessage && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xs ${
            statusMessage.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-rose-300 bg-rose-50 text-rose-800"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Add Staff Account Form */}
      <section className="mt-6 rounded-2xl border border-teal-200/75 bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
              +
            </span>
            <div>
              <h2 className="text-base font-bold text-[#062b26]">Add staff account</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                New staff members can immediately sign in through the Staff Portal.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                Full name
              </span>
              <input
                placeholder="e.g., Elena Reyes"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                Email address
              </span>
              <input
                type="email"
                placeholder="staff@clinicflow.ph"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                Contact number
              </span>
              <input
                placeholder="+63 917 555 0100"
                value={form.contactNumber}
                onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))}
                className={INPUT_CLASS}
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                Temporary password
              </span>
              <input
                type="password"
                minLength={8}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="primary-button px-5 py-2.5 disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add staff account"}
            </button>
          </div>
        </form>
      </section>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-teal-200/75 bg-white shadow-2xs">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.staffAccounts.map((account) => {
              const isSelf = user?.userId != null && user.userId === account.userId;
              return (
                <tr key={account.id}>
                  <td className="font-mono text-xs font-semibold text-teal-700">
                    {account.id}
                  </td>
                  <td className="font-semibold text-[#062b26]">
                    {account.name}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                        You
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="text-slate-700">{account.email}</div>
                    <div className="text-xs text-slate-400">
                      {account.contactNumber || "—"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        account.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {account.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => handleToggle(account)}
                      className={`table-action ${
                        isSelf ? "cursor-not-allowed opacity-45" : ""
                      }`}
                    >
                      {account.active ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {state.staffAccounts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No staff accounts loaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
