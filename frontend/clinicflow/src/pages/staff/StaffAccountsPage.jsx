import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const EMPTY_FORM = {
  name: "",
  email: "",
  contactNumber: "",
  password: "",
};

export default function StaffAccountsPage() {
  const { user } = useAuth();
  const { state, addStaffAccount, toggleStaffAccountStatus } = useClinicFlowStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

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
      <p className="eyebrow">Staff administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
        Staff accounts
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Create clinic staff logins and manage active portal access.
      </p>

      {statusMessage && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#062b26]">Add staff account</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              New staff members can immediately sign in through the Staff Portal.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Full name
              </span>
              <input
                placeholder="e.g., Elena Reyes"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                required
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Email address
              </span>
              <input
                type="email"
                placeholder="staff@clinicflow.ph"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                required
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Contact number
              </span>
              <input
                placeholder="+63 917 555 0100"
                value={form.contactNumber}
                onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Temporary password
              </span>
              <input
                type="password"
                minLength={8}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
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
                  <td className="font-mono text-xs font-semibold text-slate-500">
                    {account.id}
                  </td>
                  <td className="font-semibold text-[#062b26]">
                    {account.name}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
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
                      className={`status-pill ${account.active ? "status-positive" : ""}`}
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
