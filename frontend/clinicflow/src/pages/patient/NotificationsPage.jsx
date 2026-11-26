// ============================================================
// OWNER   : Lepon
// FEATURE : Feature 4 Notifications
// ============================================================

import { useState } from 'react';
import { useClinicFlowStore } from '../../data/clinicFlowStore';

const TYPE_LABELS = {
  approaching: { label: 'Turn Approaching', bg: '#FEF3C7', color: '#92400E' },
  next: { label: 'Next in Line', bg: '#CCFBF1', color: '#0F766E' },
  update: { label: 'Appointment Update', bg: '#E0E7FF', color: '#3730A3' },
};

export default function NotificationsPage() {
  const { state, markNotificationRead, markAllNotificationsRead } = useClinicFlowStore();
  const [filter, setFilter] = useState('all');

  const filtered = state.notifications.filter((n) => (filter === 'all' ? true : n.type === filter));

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
            QUEUE & APPOINTMENT ALERTS
          </p>
          <h1 style={{ margin: '4px 0', color: '#062B26', fontSize: 28 }}>Notifications</h1>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsRead}
          style={{
            background: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: 8,
            padding: '8px 14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Mark all as read
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          ['all', 'All'],
          ['approaching', 'Turn Approaching'],
          ['next', 'Next in Line'],
          ['update', 'Appointment Updates'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            style={{
              padding: '7px 12px',
              borderRadius: 999,
              border: '1px solid #D1D5DB',
              background: filter === key ? '#062B26' : '#FFFFFF',
              color: filter === key ? '#FFFFFF' : '#374151',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map((item) => {
          const badge = TYPE_LABELS[item.type] || TYPE_LABELS.update;
          return (
            <div
              key={item.id}
              style={{
                background: item.read ? '#FFFFFF' : '#F0FDFA',
                border: item.read ? '1px solid #E5E7EB' : '1px solid #5EEAD4',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      background: badge.bg,
                      color: badge.color,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 999,
                    }}
                  >
                    {badge.label}
                  </span>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{item.time}</span>
                </div>
                <div style={{ fontWeight: 700, color: '#062B26' }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#4B5563', marginTop: 4 }}>{item.message}</div>
              </div>

              {!item.read && (
                <button
                  type="button"
                  onClick={() => markNotificationRead(item.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #0F766E',
                    color: '#0F766E',
                    borderRadius: 8,
                    padding: '6px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Mark read
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}