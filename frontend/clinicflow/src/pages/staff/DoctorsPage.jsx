import { useState } from "react";
import { SchedulePicker } from "@/components/common/SchedulePicker";
import {
  createDefaultSchedule,
  formatDoctorSchedule,
  isScheduleValid,
} from "@/lib/schedule";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export default function DoctorsPage() {
  const { state, addDoctor, updateDoctor } = useClinicFlowStore();
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [schedule, setSchedule] = useState(() => createDefaultSchedule());
  const [editingDocId, setEditingDocId] = useState(null);
  const [editSchedule, setEditSchedule] = useState(() => createDefaultSchedule());

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim() || !isScheduleValid(schedule)) return;
    await addDoctor({
      name,
      specialty,
      schedule: formatDoctorSchedule(schedule),
    });
    setName("");
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

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Staff administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
        Doctors &amp; schedules
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Manage clinic physicians, specializations, and active availability.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h2 className="text-base font-bold text-[#062b26]">Add doctor</h2>
        <form onSubmit={handleAddDoctor} className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto]">
            <input
              placeholder="Doctor name (e.g., Dr. Ana Cruz, MD)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
              required
            />
            <input
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
              required
            />
            <button
              type="submit"
              disabled={!isScheduleValid(schedule)}
              className="primary-button whitespace-nowrap px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add doctor
            </button>
          </div>

          <SchedulePicker value={schedule} onChange={setSchedule} />
        </form>
      </section>

      <div className="mt-5 grid items-start gap-3 sm:grid-cols-2">
        {state.doctors.map((doc) => {
          const isEditing = editingDocId === doc.id;
          return (
            <div
              key={doc.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-[#062b26]">{doc.name}</p>
                  <p className="mt-1 text-xs font-medium text-teal-700">{doc.specialty}</p>
                  <p className="mt-1 text-xs text-slate-500">{doc.schedule}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => updateDoctor(doc.id, { available: !doc.available })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                      doc.available
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
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
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <SchedulePicker value={editSchedule} onChange={setEditSchedule} stacked />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingDocId(null)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
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
      </div>
    </div>
  );
}
