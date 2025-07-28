"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface Question {
  question: string
  options: string[]
}

interface SurveyData {
  questions: Question[]
}

export default function Survey() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const response = await fetch("/api/questions")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: SurveyData = await response.json()
      setQuestions(data.questions)
      setLoading(false)
    } catch (error) {
      console.error("Questions loading error:", error)
      setError("પ્રશ્નો લોડ કરવામાં સમસ્યા આવી. કૃપા કરીને પેજ રિફ્રેશ કરો.")
      setLoading(false)
    }
  }

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [`q${currentIndex}`]: value }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setShowUserInfo(true)
      }
    }, 500)
  }

  const submitSurvey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const finalData = { ...answers }

    for (const [key, value] of formData.entries()) {
      finalData[key] = value.toString()
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setResult(result)
      setShowResult(true)
    } catch (error: any) {
      console.error("Submission error:", error)
      setError(error.message || "પરિણામ સાચવવામાં સમસ્યા આવી. કૃપા કરીને ફરીથી પ્રયાસ કરો.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="survey-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            flexDirection: "column",
          }}
        >
          <div className="loading-spinner" style={{ marginBottom: "1rem" }}></div>
          <p style={{ fontSize: "1.125rem", color: "#6b7280" }}>પ્રશ્નો લોડ થઈ રહ્યા છે...</p>
        </div>
      </div>
    )
  }

  if (error && !showUserInfo && !showResult) {
    return (
      <div className="survey-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              maxWidth: "28rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>ભૂલ</p>
            <p style={{ marginBottom: "1rem" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              ફરીથી પ્રયાસ કરો
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="survey-container">
      <div
        style={{
          maxWidth: "42rem",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <div className="survey-card">
          {/* Header */}
          <div className="survey-header">
            <div style={{ marginBottom: "1rem" }}>
              <img
                src="https://www.cugujarat.ac.in/assets/images/logo.png"
                alt="University Logo"
                style={{
                  height: "4rem",
                  width: "auto",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
              }}
            >
              પ્રકૃતિ પરીક્ષણ
            </h1>
            <p style={{ opacity: "0.9", fontSize: "1.125rem" }}>Children's Research University</p>
          </div>

          {/* Progress Bar */}
          {!showResult && (
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: showUserInfo ? "100%" : `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                {showUserInfo ? "વ્યક્તિગત માહિતી" : `પ્રશ્ન ${currentIndex + 1} / ${questions.length}`}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "1rem",
                margin: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Questions */}
          {!showUserInfo && !showResult && questions.length > 0 && (
            <div className="question-card">
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "2rem",
                  textAlign: "center",
                  lineHeight: "1.6",
                  color: "#1f2937",
                }}
              >
                {currentIndex + 1}. {questions[currentIndex]?.question}
              </h3>

              <div>
                {questions[currentIndex]?.options.map((option, index) => (
                  <button key={index} onClick={() => handleAnswer(["a", "b", "c"][index])} className="option-button">
                    {option}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {currentIndex > 0 ? (
                  <button onClick={() => setCurrentIndex(currentIndex - 1)} className="btn btn-secondary">
                    પાછળ
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          )}

          {/* User Info Form */}
          {showUserInfo && !showResult && (
            <div style={{ padding: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "2rem",
                  textAlign: "center",
                  color: "#1f2937",
                }}
              >
                📝 વ્યક્તિગત માહિતી
              </h3>

              <form onSubmit={submitSurvey}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        color: "#374151",
                      }}
                    >
                      નામ *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="form-input"
                      placeholder="તમારું નામ લખો (ફક્ત અક્ષરો)"
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        color: "#374151",
                      }}
                    >
                      લિંગ *
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label className="radio-option">
                        <input type="radio" name="gender" value="Male" required style={{ marginRight: "0.75rem" }} />
                        પુરુષ
                      </label>
                      <label className="radio-option">
                        <input type="radio" name="gender" value="Female" required style={{ marginRight: "0.75rem" }} />
                        સ્ત્રી
                      </label>
                      <label className="radio-option">
                        <input type="radio" name="gender" value="Other" required style={{ marginRight: "0.75rem" }} />
                        અન્ય
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        color: "#374151",
                      }}
                    >
                      ફોન નંબર *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      className="form-input"
                      placeholder="10 અંકનો નંબર (6-9 થી શરૂ)"
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        color: "#374151",
                      }}
                    >
                      ઈમેલ *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="form-input"
                      placeholder="તમારું ઈમેલ સરનામું"
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        color: "#374151",
                      }}
                    >
                      શહેર *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="form-input"
                      placeholder="તમારું શહેર (ફક્ત અક્ષરો)"
                      style={{ fontSize: "1rem" }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserInfo(false)
                      setCurrentIndex(questions.length - 1)
                    }}
                    className="btn btn-secondary"
                    disabled={submitting}
                    style={{ flex: "1" }}
                  >
                    પાછા જાઓ
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: "1" }}>
                    {submitting ? "સબમિટ થઈ રહ્યું છે..." : "પરિણામ જુઓ"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Results */}
          {showResult && result && (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎯</div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#3b82f6",
                  marginBottom: "1rem",
                }}
              >
                {result.result}
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "2rem",
                  fontSize: "1.125rem",
                  lineHeight: "1.75",
                }}
              >
                {result.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  className="stat-card"
                  style={{
                    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#3b82f6",
                    }}
                  >
                    {result.counts.vata}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginTop: "0.25rem",
                    }}
                  >
                    વાત
                  </div>
                </div>
                <div
                  className="stat-card"
                  style={{
                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#16a34a",
                    }}
                  >
                    {result.counts.pitta}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginTop: "0.25rem",
                    }}
                  >
                    પિત્ત
                  </div>
                </div>
                <div
                  className="stat-card"
                  style={{
                    background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#9333ea",
                    }}
                  >
                    {result.counts.kapha}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginTop: "0.25rem",
                    }}
                  >
                    કફ
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                <a
                  href="/api/export-csv"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 2rem",
                    backgroundColor: "#16a34a",
                    color: "white",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                  📊 CSV ડાઉનલોડ કરો
                </a>

                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "#6b7280",
                    color: "white",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  નવું સર્વે શરૂ કરો
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
