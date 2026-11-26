// ============================================================
// OWNER   : Lepon
// FEATURE : Feature 5 My Queue
// ============================================================

import { Link } from 'react-router-dom';
import { useClinicFlowStore } from '../../data/clinicFlowStore';

export default function MyQueuePage() {
  const { state } = useClinicFlowStore();
  const {
    nowServingNumber,
    patientQueueNumber,
    patientQueueCode,
    patientQueueStatus,
    patientServiceName,
    patientDoctorName,
    avgMinutesPerPatient,
  } = state.queue;

  const hasTicket = patientQueueNumber > 0;
  const peopleAhead = hasTicket ? Math.max(0, patientQueueNumber - nowServingNumber) : 0;
  const estWaitMin = peopleAhead * avgMinutesPerPatient;
  const progressPct =
    !hasTicket
      ? 0
      : patientQueueStatus === 'Completed' || patientQueueStatus === 'Serving' || patientQueueNumber <= 1
        ? 100
        : Math.min(100, Math.max(8, Math.round((nowServingNumber / patientQueueNumber) * 100)));

  const statusText = !hasTicket
    ? 'No active queue ticket yet'
    : patientQueueStatus === 'Completed'
      ? 'Visit completed'
      : patientQueueStatus === 'On Hold'
        ? 'Your queue ticket is on hold'
        : patientQueueStatus === 'Skipped'
          ? 'Ticket skipped — please check with front desk'
          : patientQueueStatus === 'Serving' || peopleAhead === 0
            ? "It's your turn now!"
            : peopleAhead === 1
              ? 'You are next in line'
              : peopleAhead <= 3
                ? 'Approaching — stay near the clinic'
                : 'In queue';

  const badgeLabel = !hasTicket
    ? 'Not in Queue'
    : patientQueueStatus || 'Live Status';

  const serviceHeading = (patientServiceName || 'CLINIC QUEUE').toUpperCase();

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
        LIVE QUEUE TRACKER
      </p>
      <h1 style={{ margin: '4px 0 18px', color: '#062B26', fontSize: 28 }}>My Queue</h1>

      <div
        style={{
          background: '#062B26',
          color: '#FFFFFF',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 12px 28px rgba(6, 43, 38, 0.14)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.08em', opacity: 0.75 }}>
              {serviceHeading}
              {patientDoctorName ? ` · ${patientDoctorName.toUpperCase()}` : ''}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{statusText}</div>
          </div>
          <span
            style={{
              background: hasTicket ? '#14B8A6' : 'rgba(255,255,255,0.16)',
              color: hasTicket ? '#062B26' : '#FFFFFF',
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {badgeLabel}
          </span>
        </div>

        {hasTicket ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginTop: 22 }}>
              <div style={{ background: '#FFFFFF', color: '#062B26', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>YOUR NUMBER</div>
                <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
                  {patientQueueCode || `Q-${String(patientQueueNumber).padStart(3, '0')}`}
                </div>
              </div>

              <div style={{ background: '#0F766E', color: '#FFFFFF', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>NOW SERVING</div>
                <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
                  Q-{String(nowServingNumber).padStart(3, '0')}
                </div>
              </div>

              <div style={{ background: '#113E38', color: '#FFFFFF', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>PEOPLE AHEAD</div>
                <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
                  {patientQueueStatus === 'Completed' || patientQueueStatus === 'Skipped' ? 0 : peopleAhead}
                </div>
              </div>

              <div style={{ background: '#FDE68A', color: '#062B26', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>ESTIMATED WAIT</div>
                <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
                  {patientQueueStatus === 'Completed' || patientQueueStatus === 'Skipped' ? '0 min' : `${estWaitMin} min`}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span>Queue Progress Toward Your Turn</span>
                <strong>{progressPct}%</strong>
              </div>
              <div style={{ width: '100%', height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    background: '#2DD4BF',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
                Clinic is currently serving <strong>Q-{String(nowServingNumber).padStart(3, '0')}</strong>.
                Book an appointment to receive your live queue number.
              </p>
            </div>
            <Link
              to="/patient/book"
              style={{
                background: '#14B8A6',
                color: '#062B26',
                padding: '10px 18px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Book an appointment →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
