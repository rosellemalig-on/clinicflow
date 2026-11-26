// ============================================================
// OWNER   : Malig-on
// FEATURE : Feature 1 Patient Information
// ============================================================

import { useState } from 'react';
import { useClinicFlowStore } from '../../data/clinicFlowStore';

function ProfileForm({ initialPatient, onSave, onEdit }) {
  const [form, setForm] = useState(initialPatient);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    onEdit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 16,
        padding: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
      }}
    >
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contact Number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Blood Type</label>
        <select
          name="bloodType"
          value={form.bloodType}
          onChange={handleChange}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        >
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((bt) => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Emergency Contact</label>
        <input
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Known Allergies</label>
        <input
          name="allergies"
          value={form.allergies}
          onChange={handleChange}
          placeholder="e.g., Penicillin, Pollen, None"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Basic Medical Notes</label>
        <textarea
          rows={3}
          name="medicalNotes"
          value={form.medicalNotes}
          onChange={handleChange}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB' }}
        />
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button
          type="submit"
          style={{
            background: '#0F766E',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 22px',
            borderRadius: 10,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Patient Information
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { state, updatePatientProfile } = useClinicFlowStore();
  const [savedBanner, setSavedBanner] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  const handleSave = async (updated) => {
    setErrorBanner('');
    try {
      await updatePatientProfile(updated);
      setSavedBanner(true);
    } catch (err) {
      setSavedBanner(false);
      setErrorBanner(err.message || 'Failed to save patient profile.');
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#0F766E', margin: 0 }}>
          PATIENT PROFILE & MEDICAL RECORD
        </p>
        <h1 style={{ margin: '4px 0', color: '#062B26', fontSize: 28 }}>Patient Information Management</h1>
        <p style={{ margin: 0, color: '#4B5563' }}>
          Your saved details are automatically reused when booking future appointments.
        </p>
      </div>

      {savedBanner && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #10B981',
            color: '#065F46',
            padding: '12px 16px',
            borderRadius: 10,
            marginBottom: 18,
            fontWeight: 500,
          }}
        >
          Patient record updated. Future bookings will use your latest information.
        </div>
      )}

      {errorBanner && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: 10,
            marginBottom: 18,
            fontWeight: 500,
          }}
        >
          {errorBanner}
        </div>
      )}

      <ProfileForm
        key={JSON.stringify(state.patient)}
        initialPatient={state.patient}
        onSave={handleSave}
        onEdit={() => {
          setSavedBanner(false);
          setErrorBanner('');
        }}
      />
    </div>
  );
}