import { useState } from 'react'
import FeedbackForm from './FeedbackForm.jsx'
import SubmittedCard from './SubmittedCard.jsx'

function App() {
  const [submissions, setSubmissions] = useState([])

  const handleNewSubmission = (data) => {
    setSubmissions((prev) => [data, ...prev])
  }

  return (
    <div className="app-container">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <header className="app-header">
        <span className="header-icon">💬</span>
        <h1>Smart Feedback Form</h1>
        <p className="header-sub">We value your feedback — help us improve!</p>
      </header>

      <FeedbackForm onSubmit={handleNewSubmission} />

      {submissions.length > 0 && (
        <section className="submissions-section">
          <h2 className="submissions-title">
            <span className="submissions-icon">📋</span>
            Submitted Feedback
            <span className="submissions-count">{submissions.length}</span>
          </h2>

          <div className="submissions-grid">
            {submissions.map((entry, index) => (
              <SubmittedCard key={index} data={entry} index={index} />
            ))}
          </div>
        </section>
      )}

      <footer className="app-footer">
        <p>Day 24 — 111 Days MERN Challenge &nbsp;•&nbsp; Smart Feedback Form</p>
      </footer>
    </div>
  )
}

export default App
