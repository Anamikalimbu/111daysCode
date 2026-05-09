/**
 * StepAccount.jsx — Step 3: Account Setup
 *
 * Collects: Username, Password, Confirm Password, Terms agreement.
 * Validation:
 *   - Username: required, 3–20 chars, alphanumeric + underscores
 *   - Password: required, min 8 chars, at least 1 uppercase, 1 number, 1 special char
 *   - Confirm Password: must match Password
 *   - Terms: must be checked
 */
import { useState } from 'react';

export default function StepAccount({ data, dispatch, onNext, onPrev }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: 'UPDATE_FIELD',
      field: name,
      value: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, name === 'agreeTerms' ? data.agreeTerms : data[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    const usernameRegex = /^[A-Za-z0-9_]+$/;

    switch (name) {
      case 'username':
        if (!value.trim()) error = 'Username is required.';
        else if (value.trim().length < 3) error = 'Minimum 3 characters.';
        else if (value.trim().length > 20) error = 'Maximum 20 characters.';
        else if (!usernameRegex.test(value)) error = 'Letters, numbers, and underscores only.';
        break;
      case 'password':
        if (!value) error = 'Password is required.';
        else if (value.length < 8) error = 'Minimum 8 characters.';
        else if (!/[A-Z]/.test(value)) error = 'Include at least 1 uppercase letter.';
        else if (!/[0-9]/.test(value)) error = 'Include at least 1 number.';
        else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value))
          error = 'Include at least 1 special character.';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password.';
        else if (value !== data.password) error = 'Passwords do not match.';
        break;
      case 'agreeTerms':
        if (!value) error = 'You must agree to the terms.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  /** Helper: compute password strength (0-4) */
  const getPasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) score++;
    return score;
  };

  const strength = getPasswordStrength(data.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];

  const handleNext = (e) => {
    e.preventDefault();
    const fields = ['username', 'password', 'confirmPassword', 'agreeTerms'];
    const newTouched = {};
    let hasError = false;

    fields.forEach((field) => {
      newTouched[field] = true;
      const val = field === 'agreeTerms' ? data.agreeTerms : data[field];
      if (validateField(field, val)) hasError = true;
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    if (!hasError) onNext();
  };

  return (
    <form className="step-form" onSubmit={handleNext} noValidate>
      <h2 className="step-heading">
        <span className="step-icon">🔐</span> Account Setup
      </h2>

      {/* Username */}
      <div className={`field-group ${touched.username && errors.username ? 'has-error' : ''}`}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="e.g. anamika_dev"
          value={data.username}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
        {touched.username && errors.username && (
          <span className="error-msg">{errors.username}</span>
        )}
      </div>

      {/* Password */}
      <div className={`field-group ${touched.password && errors.password ? 'has-error' : ''}`}>
        <label htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Min. 8 characters"
            value={data.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Password strength meter */}
        {data.password && (
          <div className="strength-meter">
            <div className="strength-bars">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`strength-bar ${strength >= level ? strengthClasses[strength] : ''}`}
                />
              ))}
            </div>
            <span className={`strength-label ${strengthClasses[strength]}`}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}

        {touched.password && errors.password && (
          <span className="error-msg">{errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div
        className={`field-group ${
          touched.confirmPassword && errors.confirmPassword ? 'has-error' : ''
        }`}
      >
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={data.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error-msg">{errors.confirmPassword}</span>
        )}
      </div>

      {/* Terms Checkbox */}
      <div
        className={`field-group checkbox-group ${
          touched.agreeTerms && errors.agreeTerms ? 'has-error' : ''
        }`}
      >
        <label className="checkbox-label" htmlFor="agreeTerms">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={data.agreeTerms}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="checkbox-custom" />
          I agree to the <a href="#terms" className="terms-link">Terms &amp; Conditions</a>
        </label>
        {touched.agreeTerms && errors.agreeTerms && (
          <span className="error-msg">{errors.agreeTerms}</span>
        )}
      </div>

      {/* Navigation */}
      <div className="step-actions">
        <button type="button" className="btn btn-secondary" onClick={onPrev} id="account-prev-btn">
          ← Back
        </button>
        <button type="submit" className="btn btn-primary" id="account-next-btn">
          Review →
        </button>
      </div>
    </form>
  );
}
