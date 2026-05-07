function SubmittedCard({ data, index }) {
  const { name, email, subject, rating, message, submittedAt } = data

  return (
    <div className="submitted-card" style={{ animationDelay: `${index * 0.08}s` }}>
      {/* Card header */}
      <div className="card-header">
        <div className="card-avatar">{name.charAt(0).toUpperCase()}</div>
        <div className="card-meta">
          <h3 className="card-name">{name}</h3>
          <span className="card-email">{email}</span>
        </div>
        <div className="card-rating">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>★</span>
          ))}
        </div>
      </div>

      {/* Subject */}
      {subject && subject !== '(No subject)' && (
        <div className="card-subject">
          <span className="subject-label">Subject:</span> {subject}
        </div>
      )}

      {/* Message */}
      <p className="card-message">{message}</p>

      {/* Timestamp */}
      <div className="card-footer">
        <span className="card-time">🕒 {submittedAt}</span>
        <span className="card-badge">✅ Submitted</span>
      </div>
    </div>
  )
}

export default SubmittedCard
