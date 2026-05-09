/**
 * StepSummary.jsx — Step 4: Review & Submit
 *
 * Displays all collected data in a clean summary layout.
 * The user can go back to edit or submit (reset) the form.
 */
import { useState } from 'react';

export default function StepSummary({ data, onPrev, onReset }) {
  const [submitted, setSubmitted] = useState(false);

  /** Handle final submission */
  const handleSubmit = () => {
    setSubmitted(true);
    // In a real app, you'd POST to an API here.
  };

  // ─── Success Screen ────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="step-form summary-success">
        <div className="success-icon">🎉</div>
        <h2 className="step-heading">Registration Complete!</h2>
        <p className="success-text">
          Welcome aboard, <strong>{data.firstName}</strong>! Your account has been created
          successfully.
        </p>
        <button className="btn btn-primary" onClick={onReset} id="start-over-btn">
          Start Over
        </button>
      </div>
    );
  }

  // ─── Summary View ──────────────────────────────────────────────────
  return (
    <div className="step-form">
      <h2 className="step-heading">
        <span className="step-icon">📋</span> Review Your Information
      </h2>

      <p className="summary-note">
        Please review the information below before submitting.
      </p>

      {/* Personal Section */}
      <div className="summary-section">
        <h3 className="summary-section-title">Personal Information</h3>
        <div className="summary-grid">
          <SummaryItem label="Full Name" value={`${data.firstName} ${data.lastName}`} />
          <SummaryItem label="Date of Birth" value={formatDate(data.dob)} />
          <SummaryItem label="Gender" value={capitalize(data.gender)} />
        </div>
      </div>

      {/* Contact Section */}
      <div className="summary-section">
        <h3 className="summary-section-title">Contact Details</h3>
        <div className="summary-grid">
          <SummaryItem label="Email" value={data.email} />
          <SummaryItem label="Phone" value={data.phone} />
          <SummaryItem label="Address" value={data.address} />
          <SummaryItem label="City" value={data.city} />
        </div>
      </div>

      {/* Account Section */}
      <div className="summary-section">
        <h3 className="summary-section-title">Account Details</h3>
        <div className="summary-grid">
          <SummaryItem label="Username" value={data.username} />
          <SummaryItem label="Password" value={'•'.repeat(data.password.length)} />
        </div>
      </div>

      {/* Navigation */}
      <div className="step-actions">
        <button type="button" className="btn btn-secondary" onClick={onPrev} id="summary-prev-btn">
          ← Edit
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
          id="submit-btn"
        >
          ✓ Submit Registration
        </button>
      </div>
    </div>
  );
}

/* ─── Helper Components ───────────────────────────────────────────── */

/** A single label-value pair for the summary */
function SummaryItem({ label, value }) {
  return (
    <div className="summary-item">
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value || '—'}</span>
    </div>
  );
}

/* ─── Helper Functions ────────────────────────────────────────────── */

/** Format ISO date string to a readable format */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Capitalize first letter */
function capitalize(str) {
  if (!str) return '—';
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}
