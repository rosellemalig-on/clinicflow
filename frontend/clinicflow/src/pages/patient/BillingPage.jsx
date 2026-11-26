import { useState } from 'react';
import { useClinicFlowStore } from '../../data/clinicFlowStore';

const METHODS = ['GCash', 'Maya', 'Card', 'Cash at Clinic'];

export default function BillingPage() {
  const { state, confirmPayment } = useClinicFlowStore();
  const [selectedMethods, setSelectedMethods] = useState({});

  const totalPaid = state.appointments
    .filter((a) => a.paymentStatus === 'Paid')
    .reduce((sum, a) => sum + a.fee, 0);

  const totalPending = state.appointments
    .filter((a) => a.paymentStatus !== 'Paid')
    .reduce((sum, a) => sum + a.fee, 0);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
        BILLING & RECEIPTS
      </p>
      <h1 style={{ margin: '4px 0 18px', color: '#062B26', fontSize: 28 }}>Payment & Billing</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Paid Total</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0F766E', marginTop: 4 }}>₱{totalPaid.toLocaleString()}</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Pending Balance</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#B45309', marginTop: 4 }}>₱{totalPending.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {state.appointments.map((apt) => {
          const isPaid = apt.paymentStatus === 'Paid';
          const chosen = selectedMethods[apt.id] || (apt.paymentMethod !== 'Unselected' ? apt.paymentMethod : 'GCash');

          return (
            <div
              key={apt.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 14,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#062B26', fontSize: 16 }}>
                  {apt.serviceName} · <span style={{ color: '#0F766E' }}>₱{apt.fee.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 13, color: '#4B5563', marginTop: 4 }}>
                  {apt.id} · {apt.date} at {apt.time} · Queue {apt.queueNumber}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: isPaid ? '#D1FAE5' : '#FEF3C7',
                    color: isPaid ? '#065F46' : '#92400E',
                  }}
                >
                  {apt.paymentStatus}
                </span>

                {!isPaid ? (
                  <>
                    <select
                      value={chosen}
                      onChange={(e) => setSelectedMethods((prev) => ({ ...prev, [apt.id]: e.target.value }))}
                      style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #D1D5DB' }}
                    >
                      {METHODS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => confirmPayment(apt.id, chosen)}
                      style={{
                        background: '#062B26',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '9px 14px',
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Confirm Payment
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: 13, color: '#4B5563' }}>Method: {apt.paymentMethod}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}