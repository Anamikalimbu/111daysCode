/**
 * App.jsx — Root component for the Multi-Step Registration Form.
 *
 * Architecture:
 *   - useReducer manages ALL form data in a single source of truth.
 *   - Each step is its own component receiving data + dispatch as props.
 *   - A progress bar + step indicators show the user's position.
 *   - CSS class-based animations handle step transitions.
 */
import { useReducer, useState } from 'react';
import StepPersonal from './steps/StepPersonal.jsx';
import StepContact from './steps/StepContact.jsx';
import StepAccount from './steps/StepAccount.jsx';
import StepSummary from './steps/StepSummary.jsx';

// ─── Initial form state ─────────────────────────────────────────────
const initialState = {
  // Step 1 — Personal
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  // Step 2 — Contact
  email: '',
  phone: '',
  address: '',
  city: '',
  // Step 3 — Account
  username: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
};

/**
 * Reducer — handles field updates and full reset.
 */
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ─── Step labels for the progress bar ────────────────────────────────
const STEP_LABELS = ['Personal', 'Contact', 'Account', 'Summary'];

export default function App() {
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [currentStep, setCurrentStep] = useState(0);

  // Animation direction: 'slide-left' when going forward, 'slide-right' when going back
  const [animDir, setAnimDir] = useState('slide-left');
  // Key forces React to re-mount the step wrapper so the CSS animation replays
  const [animKey, setAnimKey] = useState(0);

  /** Advance to next step with forward animation */
  const nextStep = () => {
    setAnimDir('slide-left');
    setAnimKey((k) => k + 1);
    setCurrentStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };

  /** Go back to previous step with backward animation */
  const prevStep = () => {
    setAnimDir('slide-right');
    setAnimKey((k) => k + 1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  /** Reset entire form and return to Step 1 */
  const resetForm = () => {
    dispatch({ type: 'RESET' });
    setAnimDir('slide-left');
    setAnimKey((k) => k + 1);
    setCurrentStep(0);
  };

  // ─── Render the active step component ───────────────────────────────
  const renderStep = () => {
    const commonProps = { data: formData, dispatch };
    switch (currentStep) {
      case 0:
        return <StepPersonal {...commonProps} onNext={nextStep} />;
      case 1:
        return <StepContact {...commonProps} onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <StepAccount {...commonProps} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <StepSummary data={formData} onPrev={prevStep} onReset={resetForm} />;
      default:
        return null;
    }
  };

  // ─── Progress percentage for the bar fill ─────────────────────────
  const progressPercent = (currentStep / (STEP_LABELS.length - 1)) * 100;

  return (
    <div className="app-wrapper">
      {/* Decorative background orbs */}
      <div className="bg-orb bg-orb--1" />
      <div className="bg-orb bg-orb--2" />
      <div className="bg-orb bg-orb--3" />

      <main className="form-card" id="registration-form">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="form-header">
          <h1 className="form-title">Create Your Account</h1>
          <p className="form-subtitle">
            Step {currentStep + 1} of {STEP_LABELS.length} —{' '}
            <span className="highlight">{STEP_LABELS[currentStep]}</span>
          </p>
        </header>

        {/* ── Progress bar ───────────────────────────────────────── */}
        <div className="progress-track" role="progressbar" aria-valuenow={progressPercent}>
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* ── Step indicators ────────────────────────────────────── */}
        <div className="step-indicators">
          {STEP_LABELS.map((label, idx) => (
            <div
              key={label}
              className={`step-dot ${idx < currentStep ? 'completed' : ''} ${
                idx === currentStep ? 'active' : ''
              }`}
            >
              <span className="dot-circle">
                {idx < currentStep ? '✓' : idx + 1}
              </span>
              <span className="dot-label">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Animated step container ────────────────────────────── */}
        <div className={`step-container ${animDir}`} key={animKey}>
          {renderStep()}
        </div>
      </main>

      {/* Footer branding */}
      <footer className="app-footer">
        Day 26 — 111 Days MERN Challenge &bull; Multi-Step Registration Form
      </footer>
    </div>
  );
}
