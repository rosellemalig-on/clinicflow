// ============================================================
// OWNER   : Padilla
// FEATURE : Feature 8 Queue Management
// ============================================================

import { useClinicFlowStore } from '../../data/clinicFlowStore';

const STATUS_BADGE = {
  Serving: { bg: '#D1FAE5', color: '#065F46' },
  Waiting: { bg: '#E0F2FE', color: '#075985' },
  'On Hold': { bg: '#FEF3C7', color: '#92400E' },
  Skipped: { bg: '#FEE2E2', color: '#991B1B' },
  Completed: { bg: '#E5E7EB', color: '#374151' },
};

export default function QueueManagementPage() {
  const { state, queueAction } = useClinicFlowStore();
  const servingEntry = state.queue.entries.find((e) => e.status === 'Serving');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
        FRONT DESK QUEUE CONTROL
      </p>
      <h1 style={{ margin: '4px 0 18px', color: '#062B26', fontSize: 28 }}>Queue Management</h1>

      <div
        style={{
          background: '#062B26',
          color: '#FFFFFF',
          borderRadius: 18,
          padding: 24,
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>NOW SERVING</div>
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: 2 }}>
            {servingEntry ? `${servingEntry.code} — ${servingEntry.patientName}` : `Q-${String(state.queue.nowServingNumber).padStart(3, '0')}`}
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
            {servingEntry ? servingEntry.serviceName : 'Ready for next patient'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => queueAction('CALL_NEXT')}
            style={{
              background: '#14B8A6',
              color: '#062B26',
              border: 'none',
              padding: '12px 20px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            CALL NEXT
          </button>
          <button
            type="button"
            onClick={() => queueAction('HOLD')}
            style={{
              background: '#FEF3C7',
              color: '#92400E',
              border: 'none',
              padding: '12px 16px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Hold Current
          </button>
          <button
            type="button"
            onClick={() => queueAction('SKIP')}
            style={{
              background: '#FEE2E2',
              color: '#991B1B',
              border: 'none',
              padding: '12px 16px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Skip Current
          </button>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 18 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 17, color: '#062B26' }}>Queue Entries & Live Statuses</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {state.queue.entries.map((entry) => {
            const st = STATUS_BADGE[entry.status] || STATUS_BADGE.Waiting;
            return (
              <div
                key={entry.id}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div>
                  <strong>{entry.code}</strong> · {entry.patientName}{' '}
                  <span style={{ fontSize: 13, color: '#6B7280' }}>({entry.serviceName})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      background: st.bg,
                      color: st.color,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {entry.status}
                  </span>

                  {entry.status !== 'Serving' && entry.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => queueAction('RECALL', entry.id)}
                      style={{
                        background: '#0F766E',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Recall / Call
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}