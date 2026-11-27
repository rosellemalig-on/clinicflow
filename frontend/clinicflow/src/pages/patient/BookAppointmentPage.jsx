// ============================================================
// OWNER   : Malig-on
// FEATURE : Feature 2 Book Appointment
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { getSlotsForDate, useClinicFlowStore } from '../../data/clinicFlowStore';
import { getTodayIso, isPastIsoDate } from '@/lib/schedule';

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
      <label className="mb-1.5 block text-[13px] font-semibold text-[#062b26]">{label}</label>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${
          open
            ? 'border-teal-600 bg-white ring-2 ring-teal-600/20'
            : 'border-teal-200/80 bg-teal-50/35 hover:border-teal-500 hover:bg-teal-50/60'
        }`}
      >
        <div className="min-w-0 flex-1">
          {selectedOption ? (
            <>
              <div className="truncate font-semibold text-[#062b26]">{selectedOption.title}</div>
              {selectedOption.subtitle && (
                <div className="truncate text-xs text-teal-800/75">{selectedOption.subtitle}</div>
              )}
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-teal-100/80 text-teal-800">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="M5.5 7.5 10 12l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-teal-200 bg-white p-1.5 shadow-xl shadow-teal-950/10"
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
                      ? 'bg-[#062b26] text-white'
                      : 'text-slate-800 hover:bg-teal-50'
                  }`}
                >
                  <span className="text-sm font-semibold leading-snug">{opt.title}</span>
                  {opt.subtitle && (
                    <span
                      className={`mt-0.5 text-xs leading-snug ${
                        isSelected ? 'text-teal-200' : 'text-slate-500'
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
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-teal-200/70 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
          <span className="size-1.5 rounded-full bg-teal-500" aria-hidden="true" />
          {helperText}
        </p>
      )}
    </div>
  );
}

export default function BookAppointmentPage() {
  const { state, bookAppointment, loadSlotsForDate } = useClinicFlowStore();
  const activeServices = state.services.filter((s) => s.active);
  const availableDoctors = state.doctors.filter((d) => d.available);

  const todayIso = getTodayIso();
  const [serviceId, setServiceId] = useState(activeServices[0]?.id || '');
  const [doctorName, setDoctorName] = useState(availableDoctors[0]?.name || '');
  const [date, setDate] = useState(todayIso);
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
  const selectedSlot = slotsForDate.find((slot) => slot.id === selectedSlotId) || null;
  const openSlotCount = slotsForDate.filter((slot) => slot.booked < slot.capacity).length;
  const fullSlotCount = slotsForDate.length - openSlotCount;

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
    if (isPastIsoDate(date)) {
      setAlertState({
        type: 'error',
        text: 'Appointments cannot be booked on dates that have already passed. Please pick today or a future date.',
      });
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
      {/* Colored Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
              Appointment scheduler
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Book Appointment
            </h1>
            <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-teal-50 backdrop-blur-xs">
              <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>
                Booking as <strong className="text-white">{state.patient.fullName || 'Patient'}</strong>
                {state.patient.phone ? ` (${state.patient.phone})` : ''}
              </span>
              <span className="text-teal-200/80">· Preloaded from profile</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200/85">
                Open Slots
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-teal-300">{openSlotCount}</p>
            </div>
            <div className="rounded-xl border border-amber-300/30 bg-amber-300/15 px-3.5 py-2 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Est. Fee
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-amber-100">
                ₱{selectedService ? Number(selectedService.fee || 0).toLocaleString() : 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      {alertState && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xs ${
            alertState.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : alertState.type === 'full'
                ? 'border-rose-300 bg-rose-50 text-rose-900'
                : 'border-amber-300 bg-amber-50 text-amber-900'
          }`}
        >
          {alertState.type === 'full' ? `SLOT FULL: ${alertState.text}` : alertState.text}
        </div>
      )}

      <form onSubmit={handleBook} className="mt-6 space-y-5">
        {/* Step 1: Service & Doctor */}
        <section className="rounded-2xl border border-teal-200/70 bg-white p-5 shadow-2xs sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-bold text-[#062b26]">Choose Service &amp; Doctor</h2>
          </div>

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
              helperText={selectedDoctor?.schedule ? `Schedule: ${selectedDoctor.schedule}` : undefined}
            />
          </div>
        </section>

        {/* Step 2: Date & Time Slots */}
        <section className="rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/35 p-5 shadow-2xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                2
              </span>
              <h2 className="text-sm font-bold text-[#062b26]">Select Date &amp; Time Slot</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                {openSlotCount} available
              </span>
              {fullSlotCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-rose-800">
                  <span className="size-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                  {fullSlotCount} full
                </span>
              )}
              <span className="rounded-full bg-teal-100 px-2.5 py-1 text-teal-800">
                Double-booking protected
              </span>
            </div>
          </div>

          <div className="mt-4 max-w-xs">
            <label className="mb-1.5 block text-[13px] font-semibold text-[#062b26]">
              Appointment Date
            </label>
            <input
              type="date"
              min={todayIso}
              value={date}
              onChange={(e) => {
                const nextDate = e.target.value;
                if (isPastIsoDate(nextDate)) {
                  setDate(todayIso);
                  setSelectedSlotId('');
                  setAlertState({
                    type: 'error',
                    text: 'Past dates cannot be booked. Date reset to today.',
                  });
                  return;
                }
                setDate(nextDate);
                setSelectedSlotId('');
                setAlertState(null);
              }}
              className="w-full rounded-xl border border-teal-200 bg-teal-50/40 px-3.5 py-2.5 text-sm font-semibold text-[#062b26] outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2.5 block text-[13px] font-semibold text-[#062b26]">
              Available Time Slots
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {slotsForDate.map((slot) => {
                const isFull = slot.booked >= slot.capacity;
                const isSelected = selectedSlotId === slot.id;
                const spotsLeft = Math.max(0, slot.capacity - slot.booked);

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
                        ? 'cursor-not-allowed border-rose-200 bg-rose-50/90 text-rose-800'
                        : isSelected
                          ? 'border-[#062b26] bg-[#062b26] text-white shadow-md shadow-teal-950/15 ring-2 ring-teal-500/35'
                          : 'border-teal-200/80 bg-white text-[#062b26] hover:border-teal-600 hover:bg-teal-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-sm font-bold">{slot.time}</span>
                      {isSelected && (
                        <span className="rounded-full bg-teal-400 px-2 py-0.5 text-[10px] font-extrabold text-[#062b26]">
                          Selected
                        </span>
                      )}
                    </div>
                    <div
                      className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium ${
                        isFull
                          ? 'text-rose-700'
                          : isSelected
                            ? 'text-teal-200'
                            : 'text-teal-700'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isFull
                            ? 'bg-rose-500'
                            : isSelected
                              ? 'bg-teal-300'
                              : 'bg-emerald-500'
                        }`}
                        aria-hidden="true"
                      />
                      {isFull ? 'Slot Full' : `${spotsLeft} slot${spotsLeft === 1 ? '' : 's'} left`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Colored Summary & Confirm Footer */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#052622] p-5 text-white shadow-lg shadow-teal-950/15 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-teal-300">
              Booking summary
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-extrabold text-amber-200">
                ₱{selectedService ? Number(selectedService.fee || 0).toLocaleString() : 0}
              </span>
              <span className="text-xs text-teal-100/85">
                {selectedService?.name || 'Select a service'}
                {selectedSlot ? ` · ${date} at ${selectedSlot.time}` : ' · Select a time slot above'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-teal-400 px-6 py-3 text-sm font-extrabold text-[#052622] shadow-sm transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-[#052622] disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </section>
      </form>
    </div>
  );
}
