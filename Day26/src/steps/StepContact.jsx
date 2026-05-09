/**
 * StepContact.jsx — Step 2: Contact Details
 *
 * Collects: Email, Phone, Address, City.
 * Validation:
 *   - Email: required, regex validated
 *   - Phone: required, 10-15 digits
 *   - Address: required, min 5 chars
 *   - City: required
 */
import { useState } from 'react';

export default function StepContact({ data, dispatch, onNext, onPrev }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name, value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, data[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    switch (name) {
      case 'email':
        if (!value.trim()) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Enter a valid email.';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required.';
        else if (!phoneRegex.test(value.replace(/[\s\-()]/g, '')))
          error = '10–15 digits required.';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required.';
        else if (value.trim().length < 5) error = 'Minimum 5 characters.';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const fields = ['email', 'phone', 'address', 'city'];
    const newTouched = {};
    let hasError = false;

    fields.forEach((field) => {
      newTouched[field] = true;
      if (validateField(field, data[field])) hasError = true;
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    if (!hasError) onNext();
  };

  return (
    <form className="step-form" onSubmit={handleNext} noValidate>
      <h2 className="step-heading">
        <span className="step-icon">📧</span> Contact Details
      </h2>

      {/* Email */}
      <div className={`field-group ${touched.email && errors.email ? 'has-error' : ''}`}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="e.g. anamika@example.com"
          value={data.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
        {touched.email && errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      {/* Phone */}
      <div className={`field-group ${touched.phone && errors.phone ? 'has-error' : ''}`}>
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="e.g. 9812345678"
          value={data.phone}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.phone && errors.phone && <span className="error-msg">{errors.phone}</span>}
      </div>

      {/* Address */}
      <div className={`field-group ${touched.address && errors.address ? 'has-error' : ''}`}>
        <label htmlFor="address">Street Address</label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="e.g. 123 Main Street"
          value={data.address}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.address && errors.address && (
          <span className="error-msg">{errors.address}</span>
        )}
      </div>

      {/* City */}
      <div className={`field-group ${touched.city && errors.city ? 'has-error' : ''}`}>
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="e.g. Kathmandu"
          value={data.city}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.city && errors.city && <span className="error-msg">{errors.city}</span>}
      </div>

      {/* Navigation */}
      <div className="step-actions">
        <button type="button" className="btn btn-secondary" onClick={onPrev} id="contact-prev-btn">
          ← Back
        </button>
        <button type="submit" className="btn btn-primary" id="contact-next-btn">
          Next →
        </button>
      </div>
    </form>
  );
}
