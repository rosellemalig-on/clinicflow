// ============================================================
// OWNER   : Malig-on
// FEATURE : Feature 2 Book Appointment
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { getSlotsForDate, useClinicFlowStore } from '../../data/clinicFlowStore';

function SelectDropdown({ label, placeholder, options, selectedValue, onSelect, helperText }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedOption = options.find((opt) => opt.value === selectedValue) || null;

  return (
    <div ref={containerRef} className="relative min-w-0">
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-800">{label}</label>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition ${
          open
            ? 'border-teal-600 ring-2 ring-teal-600/15'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="min-w-0 flex-1">
          {selectedOption ? (
            <>
              <div className="truncate font-semibold text-[#062b26]">{selectedOption.title}</div>
              {selectedOption.subtitle && (
                <div className="truncate text-xs text-slate-500">{selectedOption.subtitle}</div>
              )}
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`size-4 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M5.5 7.5 10 12l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2.5 text-xs text-slate-400">No options available</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelect(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full flex-col rounded-lg px-3 py-2 text-left transition ${
                    isSelected
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-800 hover:bg-teal-50'
                  }`}
                >
                  <span className="text-sm font-semibold leading-snug">{opt.title}</span>
                  {opt.subtitle && (
                    <span
                      className={`mt-0.5 text-xs leading-snug ${
                        isSelected ? 'text-teal-100' : 'text-slate-500'
                      }`}
                    >
                      {opt.subtitle}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {helperText && (
        <p className="mt-1.5 text-xs font-medium text-teal-700">{helperText}</p>
      )}
    </div>
  );
}

export default function BookAppointmentPage() {
  const { state, bookAppointment, loadSlotsForDate } = useClinicFlowStore();
  const activeServices = state.services.filter((s) => s.active);
  const availableDoctors = state.doctors.filter((d) => d.available);

  const [serviceId, setServiceId] = useState(activeServices[0]?.id || '');
  const [doctorName, setDoctorName] = useState(availableDoctors[0]?.name || '');
  const [date, setDate] = useState('2026-11-26');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [alertState, setAlertState] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSlotsForDate(date);
  }, [date, loadSlotsForDate]);

  const effectiveServiceId = activeServices.some((s) => s.id === serviceId)
    ? serviceId
    : activeServices[0]?.id || '';
  const effectiveDoctorName = availableDoctors.some((d) => d.name === doctorName)
    ? doctorName
    : availableDoctors[0]?.name || '';

  const slotsForDate = getSlotsForDate(state.slotsByDate, date);
  const selectedService = activeServices.find((s) => s.id === effectiveServiceId) || activeServices[0];
  const selectedDoctor = availableDoctors.find((d) => d.name === effectiveDoctorName) || availableDoctors[0];

  const serviceOptions = activeServices.map((s) => ({
    value: s.id,
    title: s.name,
    subtitle: `₱${Number(s.fee || 0).toLocaleString()} · ${s.durationMin} mins`,
  }));

  const doctorOptions = availableDoctors.map((d) => ({
    value: d.name,
    title: d.name,
    subtitle: d.schedule ? `${d.specialty} · ${d.schedule}` : d.specialty,
  }));

  const handleBook = async (e) => {
    e.preventDefault();
    if (!effectiveServiceId) {
      setAlertState({ type: 'error', text: 'No active services are currently available.' });
      return;
    }
    if (!effectiveDoctorName) {
      setAlertState({ type: 'error', text: 'No doctors are currently available.' });
      return;
    }
    if (!selectedSlotId) {
      setAlertState({ type: 'error', text: 'Please select a time slot first.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookAppointment({
        serviceId: effectiveServiceId,
        doctorName: effectiveDoctorName,
        date,
        slotId: selectedSlotId,
      });
      if (!res.ok) {
        setAlertState({
          type: res.slotFull ? 'full' : 'error',
          text: res.error || 'Slot full — please select another time slot.',
        });
        return;
      }

      setSelectedSlotId('');
      setAlertState({
        type: 'success',
        text: `Booked ${res.appointment.serviceName} on ${res.appointment.date} at ${res.appointment.time} (Queue ${res.appointment.queueNumber}).`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Appointment scheduler</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#062b26]">
        Book Appointment
      </h1>
      <p className="mt-1.5 text-sm text-slate-600">
        Booking as <strong className="text-[#062b26]">{state.patient.fullName}</strong> ({state.patient.phone}) — records preloaded from your profile.
      </p>

      {alertState && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            alertState.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : alertState.type === 'full'
                ? 'border-red-300 bg-red-50 text-red-900'
                : 'border-amber-300 bg-amber-50 text-amber-900'
          }`}
        >
          {alertState.type === 'full' ? `SLOT FULL: ${alertState.text}` : alertState.text}
        </div>
      )}

      <form
        onSubmit={handleBook}
        className="mt-6 space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <SelectDropdown
            label="Clinic Service"
            placeholder="Select a service"
            options={serviceOptions}
            selectedValue={effectiveServiceId}
            onSelect={setServiceId}
          />

          <SelectDropdown
            label="Preferred Doctor"
            placeholder="Select a doctor"
            options={doctorOptions}
            selectedValue={effectiveDoctorName}
            onSelect={setDoctorName}
            helperText={selectedDoctor?.schedule ? `Doctor schedule: ${selectedDoctor.schedule}` : undefined}
          />
        </div>

        <div className="max-w-xs">
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-800">
            Appointment Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelectedSlotId('');
              setAlertState(null);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-semibold text-slate-800">
            Available Time Slots (Double-Booking Protected)
          </label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {slotsForDate.map((slot) => {
              const isFull = slot.booked >= slot.capacity;
              const isSelected = selectedSlotId === slot.id;

              return (
                <button
                  type="button"
                  key={slot.id}
                  disabled={isFull}
                  onClick={() => {
                    setSelectedSlotId(slot.id);
                    setAlertState(null);
                  }}
                  className={`rounded-xl border px-3.5 py-3 text-left transition ${
                    isFull
                      ? 'cursor-not-allowed border-red-200 bg-red-50 text-red-800'
                      : isSelected
                        ? 'border-[#062b26] bg-[#062b26] text-white shadow-xs'
                        : 'border-slate-300 bg-slate-50 text-slate-900 hover:border-teal-600 hover:bg-teal-50/50'
                  }`}
                >
                  <div className="text-sm font-bold">{slot.time}</div>
                  <div className="mt-1 text-xs opacity-90">
                    {isFull ? 'Slot Full' : `${slot.capacity - slot.booked} slot(s) left`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f6f8f7] p-4">
          <div>
            <div className="text-xs text-slate-500">Estimated Consultation Fee</div>
            <div className="text-2xl font-bold text-[#062b26]">
              ₱{selectedService ? Number(selectedService.fee || 0).toLocaleString() : 0}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="primary-button px-6 py-3 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
