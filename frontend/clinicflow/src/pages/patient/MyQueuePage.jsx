// ============================================================
// OWNER   : Lepon
// FEATURE : Feature 5 My Queue
// ============================================================

import { useClinicFlowStore } from '../../data/clinicFlowStore';

export default function MyQueuePage() {
  const { state } = useClinicFlowStore();
  const { nowServingNumber, patientQueueNumber, avgMinutesPerPatient } = state.queue;

  const peopleAhead = Math.max(0, patientQueueNumber - nowServingNumber);
  const estWaitMin = peopleAhead * avgMinutesPerPatient;
  const progressPct =
    patientQueueNumber <= 1
      ? 100
      : Math.min(100, Math.max(8, Math.round((nowServingNumber / patientQueueNumber) * 100)));

  const statusText =
    peopleAhead === 0
      ? "It's your turn now!"
      : peopleAhead === 1
      ? 'You are next in line'
      : peopleAhead <= 3
      ? 'Approaching — stay near the clinic'
      : 'In queue';

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
            <div style={{ fontSize: 12, letterSpacing: '0.08em', opacity: 0.75 }}>GENERAL CONSULTATION</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{statusText}</div>
          </div>
          <span
            style={{
              background: '#14B8A6',
              color: '#062B26',
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Live Status
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginTop: 22 }}>
          <div style={{ background: '#FFFFFF', color: '#062B26', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>YOUR NUMBER</div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
              Q-{String(patientQueueNumber).padStart(3, '0')}
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
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>{peopleAhead}</div>
          </div>

          <div style={{ background: '#FDE68A', color: '#062B26', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>ESTIMATED WAIT</div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>{estWaitMin} min</div>
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
      </div>
    </div>
  );
}