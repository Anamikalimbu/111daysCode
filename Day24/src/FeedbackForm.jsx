import { useState, useRef } from 'react'

/* ── Validation ─────────────────────────────────── */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const validate = (fields) => {
  const errors = {}
  if (fields.name.trim().length < 3) errors.name = 'Name must be at least 3 characters.'
  if (!EMAIL_REGEX.test(fields.email)) errors.email = 'Please enter a valid email address.'
  if (!fields.rating) errors.rating = 'Please select a rating (1–5).'
  if (fields.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.'
  return errors
}

const stars = [1, 2, 3, 4, 5]

function FeedbackForm({ onSubmit }) {
  /* Controlled state */
  const [fields, setFields] = useState({
    name: '',
    email: '',
    rating: 0,
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  /* useRef – uncontrolled */
  const subjectRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...fields, [name]: value }
    setFields(updated)

    if (touched[name]) {
      setErrors(validate(updated))
    }
  }

  const handleRating = (value) => {
    const updated = { ...fields, rating: value }
    setFields(updated)
    setTouched((t) => ({ ...t, rating: true }))
    setErrors(validate(updated))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(fields))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setTouched({ name: true, email: true, rating: true, message: true })

    const errs = validate(fields)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const subject = subjectRef.current?.value?.trim() || '(No subject)'
    const payload = { ...fields, subject, submittedAt: new Date().toLocaleString() }

    onSubmit(payload)

    /* Reset */
    setFields({ name: '', email: '', rating: 0, message: '' })
    setTouched({})
    setErrors({})
    if (subjectRef.current) subjectRef.current.value = ''

    /* Success flash */
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const currentErrors = validate(fields)
  const isFormValid = Object.keys(currentErrors).length === 0

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {/* Success badge */}
      {showSuccess && (
        <div className="success-badge">
          <span className="success-icon">✅</span> Feedback submitted successfully!
        </div>
      )}

      {/* ── Name ── */}
      <div className="form-group">
        <label htmlFor="name">
          <span className="label-icon">👤</span> Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Anamika Limbu"
          value={fields.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.name && errors.name ? 'input-error' : ''}
        />
        {touched.name && errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      {/* ── Email ── */}
      <div className="form-group">
        <label htmlFor="email">
          <span className="label-icon">📧</span> Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.email && errors.email ? 'input-error' : ''}
        />
        {touched.email && errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="subject">
          <span className="label-icon">📝</span> Subject <span className="optional-tag">optional</span>
        </label>
        <input
          id="subject"
          type="text"
          placeholder="e.g. UI Bug Report"
          ref={subjectRef}
        />
      </div>

      {/* ── Rating ── */}
      <div className="form-group">
        <label>
          <span className="label-icon">⭐</span> Rating
        </label>
        <div className="star-rating" role="radiogroup" aria-label="Rating">
          {stars.map((s) => (
            <button
              type="button"
              key={s}
              className={`star-btn ${fields.rating >= s ? 'star-active' : ''}`}
              onClick={() => handleRating(s)}
              aria-label={`${s} star`}
            >
              ★
            </button>
          ))}
          {fields.rating > 0 && <span className="rating-label">{fields.rating} / 5</span>}
        </div>
        {touched.rating && errors.rating && <span className="error-text">{errors.rating}</span>}
      </div>

      {/* ── Message ── */}
      <div className="form-group">
        <label htmlFor="message">
          <span className="label-icon">💬</span> Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Tell us what you think (minimum 10 characters)…"
          value={fields.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.message && errors.message ? 'input-error' : ''}
        />
        <span className="char-count">{fields.message.length} characters</span>
        {touched.message && errors.message && <span className="error-text">{errors.message}</span>}
      </div>

      {/* ── Submit ── */}
      <button type="submit" className="submit-btn" disabled={!isFormValid}>
        {isFormValid ? '🚀 Submit Feedback' : '🔒 Fill all fields to submit'}
      </button>
    </form>
  )
}

export default FeedbackForm
