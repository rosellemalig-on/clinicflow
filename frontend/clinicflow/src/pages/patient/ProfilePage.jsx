// ============================================================
// OWNER   : Malig-on
// FEATURE : Feature 1 Patient Information
// ============================================================

import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const INPUT_CLASS =
  "w-full min-w-0 rounded-xl border border-teal-200/80 bg-teal-50/30 px-3.5 py-2.5 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20";

function getInitials(name) {
  if (!name) return "PT";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function ProfileForm({ initialPatient, onSave, onEdit, saving }) {
  const [form, setForm] = useState(initialPatient);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    onEdit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {/* Section 1: Personal & Contact Information */}
      <section className="rounded-2xl border border-teal-200/70 bg-white p-5 shadow-2xs sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-bold text-[#062b26]">Personal &amp; Contact Information</h2>
          </div>
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
            Used for bookings &amp; alerts
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">Full Name</span>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className={INPUT_CLASS}
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">Email Address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={INPUT_CLASS}
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">Contact Number</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className={INPUT_CLASS}
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">Date of Birth</span>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </label>

          <label className="block min-w-0 sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
              Emergency Contact
            </span>
            <input
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              placeholder="Name & phone number of emergency contact"
              className={INPUT_CLASS}
            />
          </label>
        </div>
      </section>

      {/* Section 2: Medical Record Details */}
      <section className="rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/35 p-5 shadow-2xs sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-bold text-[#062b26]">Medical Summary</h2>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
            Clinical reference
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">Blood Type</span>
            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              className={INPUT_CLASS}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0 sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
              Known Allergies
            </span>
            <input
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="e.g., Penicillin, Pollen, None"
              className="w-full min-w-0 rounded-xl border border-amber-300/80 bg-amber-50/45 px-3.5 py-2.5 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
            />
          </label>

          <label className="block min-w-0 sm:col-span-3">
            <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
              Basic Medical Notes
            </span>
            <textarea
              rows={3}
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              placeholder="Existing conditions, regular medications, or special care notes"
              className={INPUT_CLASS}
            />
          </label>
        </div>
      </section>

      {/* Colored Save Bar */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#052622] p-5 text-white shadow-lg shadow-teal-950/15 sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-teal-300">
            Profile sync
          </p>
          <p className="mt-1 text-xs leading-relaxed text-teal-100/85">
            Your saved details are automatically preloaded when booking future appointments.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-teal-400 px-6 py-3 text-sm font-extrabold text-[#052622] shadow-sm transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-[#052622] disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save Patient Information"}
        </button>
      </section>
    </form>
  );
}

export default function ProfilePage() {
  const { state, updatePatientProfile } = useClinicFlowStore();
  const [savedBanner, setSavedBanner] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (updated) => {
    setErrorBanner("");
    setSaving(true);
    try {
      await updatePatientProfile(updated);
      setSavedBanner(true);
    } catch (err) {
      setSavedBanner(false);
      setErrorBanner(err.message || "Failed to save patient profile.");
    } finally {
      setSaving(false);
    }
  };

  const patientName = state.patient.fullName || "Patient Profile";
  const bloodType = state.patient.bloodType || "Unknown";
  const allergiesText = (state.patient.allergies || "").trim();
  const hasAllergies = allergiesText !== "" && allergiesText.toLowerCase() !== "none";

  return (
    <div className="mx-auto max-w-4xl">
      {/* Colored Profile Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-400 text-lg font-extrabold text-[#052622] shadow-md">
              {getInitials(state.patient.fullName)}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
                Patient profile &amp; medical record
              </p>
              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {patientName}
              </h1>
              <p className="mt-1 truncate text-xs text-teal-100/80">
                {state.patient.email || "Keep your contact and medical record up to date"}
                {state.patient.id ? ` · ${state.patient.id}` : ""}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-xl border border-rose-300/30 bg-rose-400/15 px-3.5 py-2 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                Blood Type
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-white">{bloodType}</p>
            </div>
            <div
              className={`rounded-xl border px-3.5 py-2 text-left ${
                hasAllergies
                  ? "border-amber-300/35 bg-amber-300/15"
                  : "border-white/15 bg-white/10"
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  hasAllergies ? "text-amber-200" : "text-teal-200/85"
                }`}
              >
                Allergies
              </p>
              <p className="mt-0.5 max-w-[140px] truncate text-sm font-bold text-white">
                {hasAllergies ? allergiesText : "None listed"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {savedBanner && (
        <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-2xs">
          Patient record updated. Future bookings will use your latest information.
        </div>
      )}

      {errorBanner && (
        <div className="mt-5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 shadow-2xs">
          {errorBanner}
        </div>
      )}

      <ProfileForm
        key={JSON.stringify(state.patient)}
        initialPatient={state.patient}
        onSave={handleSave}
        saving={saving}
        onEdit={() => {
          setSavedBanner(false);
          setErrorBanner("");
        }}
      />
    </div>
  );
}
