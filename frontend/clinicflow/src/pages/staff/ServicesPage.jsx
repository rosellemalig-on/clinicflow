// ============================================================
// OWNER   : Padilla
// FEATURE : Feature 7 — Clinic Services & Doctors
// ============================================================

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SchedulePicker } from "@/components/common/SchedulePicker";
import {
  createDefaultSchedule,
  formatDoctorSchedule,
  isScheduleValid,
} from "@/lib/schedule";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const INPUT_CLASS =
  "w-full min-w-0 rounded-xl border border-teal-200/80 bg-teal-50/30 px-3.5 py-2.5 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20";

export default function ServicesPage() {
  const { state, addService, updateService, addDoctor, updateDoctor } = useClinicFlowStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab =
    tabParam === "services" || tabParam === "doctors" ? tabParam : "all";

  const setActiveTab = (nextTab) => {
    if (nextTab === "all") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab: nextTab }, { replace: true });
    }
  };

  // Service state
  const [newService, setNewService] = useState({
    name: "",
    fee: "",
    durationMin: "20",
  });

  // Doctor state
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [schedule, setSchedule] = useState(() => createDefaultSchedule());
  const [editingDocId, setEditingDocId] = useState(null);
  const [editSchedule, setEditSchedule] = useState(() => createDefaultSchedule());

  const activeServicesCount = state.services.filter((s) => s.active).length;
  const availableDoctorsCount = state.doctors.filter((d) => d.available).length;

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name.trim()) return;
    await addService(newService);
    setNewService({ name: "", fee: "", durationMin: "20" });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!doctorName.trim() || !specialty.trim() || !isScheduleValid(schedule)) return;
    await addDoctor({
      name: doctorName,
      specialty,
      schedule: formatDoctorSchedule(schedule),
    });
    setDoctorName("");
    setSpecialty("");
    setSchedule(createDefaultSchedule());
  };

  const handleStartEditSchedule = (docId) => {
    if (editingDocId === docId) {
      setEditingDocId(null);
      return;
    }
    setEditingDocId(docId);
    setEditSchedule(createDefaultSchedule());
  };

  const handleSaveEditSchedule = async (docId) => {
    if (!isScheduleValid(editSchedule)) return;
    await updateDoctor(docId, { schedule: formatDoctorSchedule(editSchedule) });
    setEditingDocId(null);
  };

  const showServices = activeTab === "all" || activeTab === "services";
  const showDoctors = activeTab === "all" || activeTab === "doctors";

  return (
    <div className="mx-auto max-w-6xl">
      {/* Colored Unified Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Staff administration
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Services &amp; Doctors
            </h1>
            <p className="mt-1.5 text-xs text-teal-100/85 sm:text-sm">
              Manage offered clinic services, consultation fees, physicians, and weekly schedules in one place.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className="rounded-xl border border-emerald-300/30 bg-emerald-400/15 px-3.5 py-2 text-left transition hover:bg-emerald-400/25"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Active Services
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-white">
                {activeServicesCount}
                <span className="text-xs font-semibold text-emerald-200/80">
                  /{state.services.length}
                </span>
              </p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("doctors")}
              className="rounded-xl border border-amber-300/35 bg-amber-300/15 px-3.5 py-2 text-left transition hover:bg-amber-300/25"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Available Doctors
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-white">
                {availableDoctorsCount}
                <span className="text-xs font-semibold text-amber-200/85">
                  /{state.doctors.length}
                </span>
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Section Switcher Pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          ["all", "All", state.services.length + state.doctors.length],
          ["services", "Clinic Services", state.services.length],
          ["doctors", "Doctors & Schedules", state.doctors.length],
        ].map(([key, label, count]) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
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
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: CLINIC SERVICES */}
      {showServices && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                1
              </span>
              <h2 className="text-base font-bold text-[#062b26]">Clinic Services</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
              {activeServicesCount} active
            </span>
          </div>

          <div className="rounded-2xl border border-teal-200/75 bg-white p-5 shadow-2xs sm:p-6">
            <h3 className="text-sm font-bold text-[#062b26]">Add service</h3>
            <form onSubmit={handleAddService} className="mt-3.5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                    Service name
                  </span>
                  <input
                    placeholder="e.g., General Consultation"
                    value={newService.name}
                    onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
                    className={INPUT_CLASS}
                    required
                  />
                </label>

                <label className="block min-w-0">
                  <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                    Consultation fee
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-bold text-teal-700">
                      ₱
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="500"
                      value={newService.fee}
                      onChange={(e) => setNewService((p) => ({ ...p, fee: e.target.value }))}
                      className="w-full min-w-0 rounded-xl border border-teal-200/80 bg-teal-50/30 py-2.5 pl-8 pr-3.5 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20"
                      required
                    />
                  </div>
                </label>

                <label className="block min-w-0">
                  <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                    Duration
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      step="5"
                      placeholder="20"
                      value={newService.durationMin}
                      onChange={(e) =>
                        setNewService((p) => ({ ...p, durationMin: e.target.value }))
                      }
                      className="w-full min-w-0 rounded-xl border border-teal-200/80 bg-teal-50/30 py-2.5 pl-3.5 pr-16 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20"
                      required
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-teal-700/80">
                      minutes
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="primary-button whitespace-nowrap px-5 py-2.5">
                  Add service
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 grid gap-3.5 md:grid-cols-2">
            {state.services.map((svc) => (
              <div
                key={svc.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-l-4 p-5 shadow-2xs ${
                  svc.active
                    ? "border-emerald-200/80 border-l-emerald-500 bg-gradient-to-r from-emerald-50/40 to-white"
                    : "border-rose-200/80 border-l-rose-400 bg-gradient-to-r from-rose-50/35 to-white"
                }`}
              >
                <div>
                  <p className="font-bold text-[#062b26]">{svc.name}</p>
                  <p className="mt-1 text-xs font-bold text-teal-700">
                    ₱{Number(svc.fee || 0).toLocaleString()} · {svc.durationMin} mins
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {svc.active ? "Available for patient booking" : "Hidden from patient booking"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateService(svc.id, { fee: svc.fee + 50 })}
                    className="rounded-lg border border-teal-200 bg-teal-50/70 px-2.5 py-1.5 text-xs font-bold text-teal-800 transition hover:border-teal-500 hover:bg-teal-100"
                  >
                    +₱50
                  </button>
                  <button
                    type="button"
                    onClick={() => updateService(svc.id, { active: !svc.active })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                      svc.active
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                    }`}
                  >
                    {svc.active ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            ))}
            {state.services.length === 0 && (
              <div className="col-span-full rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/40 py-10 text-center text-sm text-slate-500">
                No clinic services configured yet.
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: DOCTORS & SCHEDULES */}
      {showDoctors && (
        <section className={showServices ? "mt-9" : "mt-6"}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                {showServices ? "2" : "1"}
              </span>
              <h2 className="text-base font-bold text-[#062b26]">Doctors &amp; Schedules</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900">
              {availableDoctorsCount} available
            </span>
          </div>

          <div className="rounded-2xl border border-teal-200/75 bg-white p-5 shadow-2xs sm:p-6">
            <h3 className="text-sm font-bold text-[#062b26]">Add doctor</h3>
            <form onSubmit={handleAddDoctor} className="mt-3.5 space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                    Doctor name
                  </span>
                  <input
                    placeholder="e.g., Dr. Ana Cruz, MD"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className={INPUT_CLASS}
                    required
                  />
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-xs font-semibold text-[#062b26]">
                    Specialty
                  </span>
                  <input
                    placeholder="e.g., Internal Medicine"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={INPUT_CLASS}
                    required
                  />
                </label>
              </div>

              <SchedulePicker value={schedule} onChange={setSchedule} />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isScheduleValid(schedule)}
                  className="primary-button whitespace-nowrap px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add doctor
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 grid items-start gap-3.5 md:grid-cols-2">
            {state.doctors.map((doc) => {
              const isEditing = editingDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`rounded-2xl border border-l-4 p-5 shadow-2xs ${
                    doc.available
                      ? "border-emerald-200/80 border-l-emerald-500 bg-gradient-to-r from-emerald-50/40 to-white"
                      : "border-rose-200/80 border-l-rose-400 bg-gradient-to-r from-rose-50/35 to-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-[#062b26]">{doc.name}</p>
                      <p className="mt-1 text-xs font-semibold text-teal-700">{doc.specialty}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-teal-200/70 bg-teal-50/75 px-2.5 py-1 text-xs font-medium text-teal-900">
                        {doc.schedule}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => updateDoctor(doc.id, { available: !doc.available })}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                          doc.available
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                      >
                        {doc.available ? "Available" : "Off Duty"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEditSchedule(doc.id)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                      >
                        {isEditing ? "Cancel" : "Edit schedule"}
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-4 space-y-3 border-t border-teal-100 pt-4">
                      <SchedulePicker value={editSchedule} onChange={setEditSchedule} stacked />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingDocId(null)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!isScheduleValid(editSchedule)}
                          onClick={() => handleSaveEditSchedule(doc.id)}
                          className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                        >
                          Save schedule
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {state.doctors.length === 0 && (
              <div className="col-span-full rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/40 py-10 text-center text-sm text-slate-500">
                No clinic doctors added yet.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
