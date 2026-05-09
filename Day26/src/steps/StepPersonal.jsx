/**
 * StepPersonal.jsx — Step 1: Personal Information
 *
 * Collects: First Name, Last Name, Date of Birth, Gender.
 * Validation:
 *   - First & Last name: required, min 2 chars, letters only
 *   - DOB: required, must be in the past
 *   - Gender: required (select)
 */
import { useState } from 'react';

export default function StepPersonal({ data, dispatch, onNext }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /** Update a single field in the shared reducer */
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name, value });

    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /** Mark a field as touched (for showing errors on blur) */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, data[name]);
  };

  /** Validate a single field and update errors state */
  const validateField = (name, value) => {
    let error = '';
    const nameRegex = /^[A-Za-z\s'-]+$/;

    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required.';
        else if (value.trim().length < 2) error = 'Minimum 2 characters.';
        else if (!nameRegex.test(value)) error = 'Letters only.';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required.';
        else if (value.trim().length < 2) error = 'Minimum 2 characters.';
        else if (!nameRegex.test(value)) error = 'Letters only.';
        break;
      case 'dob':
        if (!value) error = 'Date of birth is required.';
        else if (new Date(value) >= new Date()) error = 'Must be in the past.';
        break;
      case 'gender':
        if (!value) error = 'Please select a gender.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  /** Validate all fields on this step before proceeding */
  const handleNext = (e) => {
    e.preventDefault();
    const fields = ['firstName', 'lastName', 'dob', 'gender'];
    const newTouched = {};
    let hasError = false;

    fields.forEach((field) => {
      newTouched[field] = true;
      const err = validateField(field, data[field]);
      if (err) hasError = true;
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    if (!hasError) onNext();
  };

  return (
    <form className="step-form" onSubmit={handleNext} noValidate>
      <h2 className="step-heading">
        <span className="step-icon">👤</span> Personal Information
      </h2>

      {/* First Name */}
      <div className={`field-group ${touched.firstName && errors.firstName ? 'has-error' : ''}`}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="e.g. Anamika"
          value={data.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
        {touched.firstName && errors.firstName && (
          <span className="error-msg">{errors.firstName}</span>
        )}
      </div>

      {/* Last Name */}
      <div className={`field-group ${touched.lastName && errors.lastName ? 'has-error' : ''}`}>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="e.g. Limbu"
          value={data.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.lastName && errors.lastName && (
          <span className="error-msg">{errors.lastName}</span>
        )}
      </div>

      {/* Date of Birth */}
      <div className={`field-group ${touched.dob && errors.dob ? 'has-error' : ''}`}>
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={data.dob}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.dob && errors.dob && <span className="error-msg">{errors.dob}</span>}
      </div>

      {/* Gender */}
      <div className={`field-group ${touched.gender && errors.gender ? 'has-error' : ''}`}>
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={data.gender}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">— Select —</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not">Prefer not to say</option>
        </select>
        {touched.gender && errors.gender && (
          <span className="error-msg">{errors.gender}</span>
        )}
      </div>

      {/* Navigation */}
      <div className="step-actions">
        <div /> {/* empty spacer so "Next" aligns right */}
        <button type="submit" className="btn btn-primary" id="personal-next-btn">
          Next →
        </button>
      </div>
    </form>
  );
}
