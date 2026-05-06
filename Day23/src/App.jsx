import { useState } from 'react'

function App() {
  // ─── State for form data (controlled inputs) ───
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // ─── State for validation errors ───
  const [errors, setErrors] = useState({})

  // ─── State to hold submitted data for preview ───
  const [submittedData, setSubmittedData] = useState(null)

  // ─── State for submission animation ───
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── State to toggle password visibility ───
  const [showPassword, setShowPassword] = useState(false)

  // ─── Single handleChange for all inputs ───
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // ─── Validation logic ───
  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  // ─── Form submission handler ───
  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmittedData(null)
    } else {
      setErrors({})
      setIsSubmitting(true)

      // Simulate a brief loading state
      setTimeout(() => {
        setSubmittedData({ ...formData })
        setIsSubmitting(false)
      }, 800)
    }
  }

  // ─── Reset the form ───
  const handleReset = () => {
    setFormData({ email: '', password: '' })
    setErrors({})
    setSubmittedData(null)
    setShowPassword(false)
  }

  return (
    <div className="app-wrapper">
      {/* Decorative background orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate id="login-form">
          {/* Email Field */}
          <div className={`form-group ${errors.email ? 'has-error' : ''} ${formData.email && !errors.email ? 'is-valid' : ''}`}>
            <label htmlFor="email">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {formData.email && !errors.email && (
                <span className="valid-check">✓</span>
              )}
            </div>
            {errors.email && (
              <span className="error-message" id="email-error">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className={`form-group ${errors.password ? 'has-error' : ''} ${formData.password && !errors.password ? 'is-valid' : ''}`}>
            <label htmlFor="password">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
              </svg>
              Password
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="toggle-password-btn"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="error-message" id="password-error">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit & Reset Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
              id="submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Signing In…
                </>
              ) : (
                'Sign In'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              id="reset-btn"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Submitted Data Preview */}
        {submittedData && (
          <div className="submitted-preview" id="submitted-preview">
            <div className="preview-header">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
              <h3>Login Successful!</h3>
            </div>
            <div className="preview-body">
              <div className="preview-row">
                <span className="preview-label">Email</span>
                <span className="preview-value">{submittedData.email}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Password</span>
                <span className="preview-value">{'•'.repeat(submittedData.password.length)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="footer-text">
        Day 23 — React Controlled Forms &amp; Validation • 111 Days MERN Challenge
      </p>
    </div>
  )
}

export default App
