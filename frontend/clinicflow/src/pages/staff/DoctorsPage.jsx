import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export default function DoctorsPage() {
  const { state, addDoctor, updateDoctor } = useClinicFlowStore();
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    schedule: "Mon–Fri, 9:00 AM – 4:00 PM",
  });

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDoctor.name.trim() || !newDoctor.specialty.trim()) return;
    addDoctor(newDoctor);
    setNewDoctor({ name: "", specialty: "", schedule: "Mon–Fri, 9:00 AM – 4:00 PM" });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Staff administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
        Doctors & schedules
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Manage clinic physicians, specializations, and active availability.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h2 className="text-base font-bold text-[#062b26]">Add doctor</h2>
        <form
          onSubmit={handleAddDoctor}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr_auto]"
        >
          <input
            placeholder="Doctor name (e.g., Dr. Ana Cruz, MD)"
            value={newDoctor.name}
            onChange={(e) => setNewDoctor((p) => ({ ...p, name: e.target.value }))}
            className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
            required
          />
          <input
            placeholder="Specialty"
            value={newDoctor.specialty}
            onChange={(e) => setNewDoctor((p) => ({ ...p, specialty: e.target.value }))}
            className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
            required
          />
          <input
            placeholder="Available schedule"
            value={newDoctor.schedule}
            onChange={(e) => setNewDoctor((p) => ({ ...p, schedule: e.target.value }))}
            className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
          />
          <button type="submit" className="primary-button px-5 py-2.5">
            Add doctor
          </button>
        </form>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {state.doctors.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
          >
            <div>
              <p className="font-bold text-[#062b26]">{doc.name}</p>
              <p className="mt-1 text-xs font-medium text-teal-700">{doc.specialty}</p>
              <p className="mt-1 text-xs text-slate-500">{doc.schedule}</p>
            </div>
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
          </div>
        ))}
      </div>
    </div>
  );
}
