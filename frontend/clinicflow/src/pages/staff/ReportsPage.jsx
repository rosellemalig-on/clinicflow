// ============================================================
// OWNER   : Padilla
// FEATURE : Feature 9 Reports & Analytics
// ============================================================

import { useMemo } from 'react';
import { useClinicFlowStore } from '../../data/clinicFlowStore';

export default function ReportsPage() {
  const { state } = useClinicFlowStore();

  const mostRequestedService = useMemo(() => {
    const counts = {};
    state.appointments.forEach((a) => {
      counts[a.serviceName] = (counts[a.serviceName] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]
      ? { name: sorted[0][0], count: sorted[0][1] }
      : { name: 'Basic Laboratory Screening', count: 1 };
  }, [state.appointments]);

  const maxPatients = Math.max(1, ...state.dailyStats.map((d) => d.patients));
  const totalWeeklyPatients = state.dailyStats.reduce((sum, d) => sum + d.patients, 0);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
        CLINIC INSIGHTS
      </p>
      <h1 style={{ margin: '4px 0 18px', color: '#062B26', fontSize: 28 }}>Reports & Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Recorded Appointments</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#062B26', marginTop: 4 }}>{state.appointments.length}</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Patients This Week</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F766E', marginTop: 4 }}>{totalWeeklyPatients}</div>
        </div>

        <div style={{ background: '#062B26', color: '#FFFFFF', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>MOST REQUESTED SERVICE</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{mostRequestedService.name}</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{mostRequestedService.count} booking(s)</div>
        </div>
      </div>

      {/* Simple Bar Chart: Patients Per Day */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 22 }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 17, color: '#062B26' }}>Patients Per Day</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${state.dailyStats.length}, 1fr)`,
            gap: 12,
            alignItems: 'end',
            height: 210,
            paddingTop: 16,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          {state.dailyStats.map((item) => {
            const heightPct = Math.round((item.patients / maxPatients) * 100);
            return (
              <div key={item.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#062B26', marginBottom: 6 }}>{item.patients}</span>
                <div
                  style={{
                    width: '70%',
                    maxWidth: 46,
                    height: `${heightPct}%`,
                    minHeight: 10,
                    background: '#0F766E',
                    borderRadius: '8px 8px 0 0',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${state.dailyStats.length}, 1fr)`, gap: 12, marginTop: 8 }}>
          {state.dailyStats.map((item) => (
            <div key={item.day} style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#4B5563' }}>
              {item.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}