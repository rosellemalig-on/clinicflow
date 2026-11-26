// ============================================================
// OWNER   : Malig-on
// FEATURE : Feature 2 Book Appointment
// ============================================================

import { useEffect, useState } from 'react';
import { getSlotsForDate, useClinicFlowStore } from '../../data/clinicFlowStore';

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
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
        APPOINTMENT SCHEDULER
      </p>
      <h1 style={{ margin: '4px 0 6px', color: '#062B26', fontSize: 28 }}>Book Appointment</h1>
      <p style={{ margin: '0 0 18px', color: '#4B5563' }}>
        Booking as <strong>{state.patient.fullName}</strong> ({state.patient.phone}) — records preloaded from your profile.
      </p>

      {alertState && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            marginBottom: 18,
            fontWeight: 500,
            background:
              alertState.type === 'success'
                ? '#ECFDF5'
                : alertState.type === 'full'
                ? '#FEF2F2'
                : '#FFFBEB',
            color:
              alertState.type === 'success'
                ? '#065F46'
                : alertState.type === 'full'
                ? '#991B1B'
                : '#92400E',
            border: `1px solid ${
              alertState.type === 'success'
                ? '#10B981'
                : alertState.type === 'full'
                ? '#EF4444'
                : '#F59E0B'
            }`,
          }}
        >
          {alertState.type === 'full' ? `SLOT FULL: ${alertState.text}` : alertState.text}
        </div>
      )}

      <form
        onSubmit={handleBook}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          padding: 24,
          display: 'grid',
          gap: 20,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Clinic Service</label>
            <select
              value={effectiveServiceId}
              onChange={(e) => setServiceId(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
            >
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (₱{s.fee} · {s.durationMin}m)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Preferred Doctor</label>
            <select
              value={effectiveDoctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
            >
              {availableDoctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} — {d.specialty}
                </option>
              ))}
            </select>
            {selectedDoctor?.schedule && (
              <div style={{ fontSize: 12, color: '#0F766E', marginTop: 6, fontWeight: 500 }}>
                Doctor schedule: {selectedDoctor.schedule}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Appointment Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlotId('');
                setAlertState(null);
              }}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Available Time Slots (Double-Booking Protected)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
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
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    textAlign: 'left',
                    cursor: isFull ? 'not-allowed' : 'pointer',
                    background: isFull ? '#FEE2E2' : isSelected ? '#062B26' : '#F9FAFB',
                    color: isFull ? '#991B1B' : isSelected ? '#FFFFFF' : '#111827',
                    border: isFull
                      ? '1px solid #FCA5A5'
                      : isSelected
                      ? '1px solid #062B26'
                      : '1px solid #D1D5DB',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{slot.time}</div>
                  <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>
                    {isFull ? 'Slot Full' : `${slot.capacity - slot.booked} slot(s) left`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            background: '#F6F8F7',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: '#4B5563' }}>Estimated Consultation Fee</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#062B26' }}>
              ₱{selectedService ? selectedService.fee.toLocaleString() : 0}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: '#0F766E',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 10,
              fontWeight: 600,
              cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
