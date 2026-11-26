// ============================================================
// OWNER   : Lepon
// FEATURE : Feature 6 Appointment History
// ============================================================

import { useClinicFlowStore } from '../../data/clinicFlowStore';

export default function HistoryPage() {
  const { state } = useClinicFlowStore();
  const peopleAhead = Math.max(0, state.queue.patientQueueNumber - state.queue.nowServingNumber);
  const approachingAlert = state.notifications.find((n) => n.type === 'approaching' || n.type === 'next');

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
        VISIT LOG & LIVE ALERT
      </p>
      <h1 style={{ margin: '4px 0 18px', color: '#062B26', fontSize: 28 }}>Notifications & Appointment History</h1>

      <div
        style={{
          background: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: 14,
          padding: 16,
          marginBottom: 22,
          color: '#78350F',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          {peopleAhead <= 3 ? 'Your turn is approaching' : 'Queue Status Alert'}
        </div>
        <div style={{ fontSize: 14, marginTop: 4 }}>
          {approachingAlert
            ? approachingAlert.message
            : `Now serving Q-${String(state.queue.nowServingNumber).padStart(3, '0')}. ${peopleAhead} patient(s) ahead of Q-${String(state.queue.patientQueueNumber).padStart(3, '0')}.`}
        </div>
      </div>

      <h2 style={{ fontSize: 18, color: '#062B26', marginBottom: 12 }}>Past & Recorded Appointments</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {state.appointments.map((apt) => (
          <div
            key={apt.id}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#062B26' }}>{apt.serviceName}</div>
              <div style={{ fontSize: 13, color: '#4B5563', marginTop: 3 }}>
                {apt.doctorName} · {apt.date} at {apt.time} · Queue {apt.queueNumber}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  background: apt.status === 'Completed' ? '#E5E7EB' : '#CCFBF1',
                  color: apt.status === 'Completed' ? '#374151' : '#0F766E',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                {apt.status}
              </span>
              <span style={{ fontWeight: 700, color: '#062B26' }}>₱{apt.fee.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}