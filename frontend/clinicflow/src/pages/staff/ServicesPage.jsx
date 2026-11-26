// ============================================================
// OWNER   : Padilla
// FEATURE : Feature 7 Services
// ============================================================

import { useState } from 'react';
import { useClinicFlowStore } from '../../data/clinicFlowStore';

export default function ServicesPage() {
  const { state, addService, updateService, addDoctor, updateDoctor } = useClinicFlowStore();

  const [newService, setNewService] = useState({ name: '', fee: '', durationMin: '20' });
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', schedule: 'Mon–Fri, 9:00 AM – 4:00 PM' });

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.name.trim()) return;
    addService(newService);
    setNewService({ name: '', fee: '', durationMin: '20' });
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDoctor.name.trim() || !newDoctor.specialty.trim()) return;
    addDoctor(newDoctor);
    setNewDoctor({ name: '', specialty: '', schedule: 'Mon–Fri, 9:00 AM – 4:00 PM' });
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
        STAFF ADMINISTRATION
      </p>
      <h1 style={{ margin: '4px 0 20px', color: '#062B26', fontSize: 28 }}>Service & Doctor Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: 20 }}>
        {/* Services Panel */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 18, color: '#062B26' }}>Clinic Services</h2>
          <form onSubmit={handleAddService} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <input
              placeholder="Service name"
              value={newService.name}
              onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
              style={{ flex: '1 1 160px', padding: 8, borderRadius: 8, border: '1px solid #D1D5DB' }}
            />
            <input
              type="number"
              min="0"
              placeholder="Fee (₱)"
              value={newService.fee}
              onChange={(e) => setNewService((p) => ({ ...p, fee: e.target.value }))}
              style={{ width: 100, padding: 8, borderRadius: 8, border: '1px solid #D1D5DB' }}
            />
            <button
              type="submit"
              style={{ background: '#0F766E', color: '#FFF', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Add Service
            </button>
          </form>

          <div style={{ display: 'grid', gap: 10 }}>
            {state.services.map((svc) => (
              <div
                key={svc.id}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#062B26' }}>{svc.name}</div>
                  <div style={{ fontSize: 12, color: '#4B5563' }}>
                    ₱{svc.fee} · {svc.durationMin} mins · {svc.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => updateService(svc.id, { fee: svc.fee + 50 })}
                    style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid #D1D5DB', background: '#F9FAFB', cursor: 'pointer', fontSize: 12 }}
                  >
                    +₱50
                  </button>
                  <button
                    type="button"
                    onClick={() => updateService(svc.id, { active: !svc.active })}
                    style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid #D1D5DB', background: '#FFFFFF', cursor: 'pointer', fontSize: 12 }}
                  >
                    {svc.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Doctors Panel */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 18, color: '#062B26' }}>Doctors & Schedules</h2>
          <form onSubmit={handleAddDoctor} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                placeholder="Doctor name (e.g., Dr. Ana Cruz, MD)"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor((p) => ({ ...p, name: e.target.value }))}
                style={{ flex: '1 1 180px', padding: 8, borderRadius: 8, border: '1px solid #D1D5DB' }}
              />
              <input
                placeholder="Specialty"
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor((p) => ({ ...p, specialty: e.target.value }))}
                style={{ flex: '1 1 140px', padding: 8, borderRadius: 8, border: '1px solid #D1D5DB' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Available schedule"
                value={newDoctor.schedule}
                onChange={(e) => setNewDoctor((p) => ({ ...p, schedule: e.target.value }))}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #D1D5DB' }}
              />
              <button
                type="submit"
                style={{ background: '#062B26', color: '#FFF', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Add Doctor
              </button>
            </div>
          </form>

          <div style={{ display: 'grid', gap: 10 }}>
            {state.doctors.map((doc) => (
              <div
                key={doc.id}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#062B26' }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: '#4B5563' }}>
                    {doc.specialty} · {doc.schedule}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateDoctor(doc.id, { available: !doc.available })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: doc.available ? '#D1FAE5' : '#FEE2E2',
                    color: doc.available ? '#065F46' : '#991B1B',
                  }}
                >
                  {doc.available ? 'Available' : 'Off Duty'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}