// ============================================================
// OWNER   : Padilla
// FEATURE : Feature 7 Services
// ============================================================

import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

export default function ServicesPage() {
  const { state, addService, updateService } = useClinicFlowStore();
  const [newService, setNewService] = useState({
    name: "",
    fee: "",
    durationMin: "20",
  });

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name.trim()) return;
    await addService(newService);
    setNewService({ name: "", fee: "", durationMin: "20" });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Staff administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
        Clinic services
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Manage offered clinic services, consultation fees, durations, and active availability.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h2 className="text-base font-bold text-[#062b26]">Add service</h2>
        <form onSubmit={handleAddService} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Service name
              </span>
              <input
                placeholder="e.g., General Consultation"
                value={newService.name}
                onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                required
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Consultation fee
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-semibold text-slate-400">
                  ₱
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="500"
                  value={newService.fee}
                  onChange={(e) => setNewService((p) => ({ ...p, fee: e.target.value }))}
                  className="w-full min-w-0 rounded-xl border border-slate-300 py-2.5 pl-8 pr-3.5 text-sm outline-none focus:border-teal-600"
                  required
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Duration
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  step="5"
                  placeholder="20"
                  value={newService.durationMin}
                  onChange={(e) => setNewService((p) => ({ ...p, durationMin: e.target.value }))}
                  className="w-full min-w-0 rounded-xl border border-slate-300 py-2.5 pl-3.5 pr-16 text-sm outline-none focus:border-teal-600"
                  required
                />
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-slate-400">
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
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {state.services.map((svc) => (
          <div
            key={svc.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
          >
            <div>
              <p className="font-bold text-[#062b26]">{svc.name}</p>
              <p className="mt-1 text-xs font-semibold text-teal-700">
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
                className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-800"
              >
                +₱50
              </button>
              <button
                type="button"
                onClick={() => updateService(svc.id, { active: !svc.active })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  svc.active
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                {svc.active ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        ))}
        {state.services.length === 0 && (
          <div className="col-span-full rounded-2xl border border-slate-200/80 bg-white py-10 text-center text-sm text-slate-400">
            No clinic services configured yet.
          </div>
        )}
      </div>
    </div>
  );
}
