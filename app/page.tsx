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

interface ValidationState {
  name: { isValid: boolean; message: string }
  phone: { isValid: boolean; message: string }
  email: { isValid: boolean; message: string }
  city: { isValid: boolean; message: string }
  gender: { isValid: boolean; message: string }
}

export default function Survey() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)

  // Form validation states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    gender: "",
  })

  const [validation, setValidation] = useState<ValidationState>({
    name: { isValid: false, message: "" },
    phone: { isValid: false, message: "" },
    email: { isValid: false, message: "" },
    city: { isValid: false, message: "" },
    gender: { isValid: false, message: "" },
  })

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    city: false,
    gender: false,
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  // Set selected option when question changes (for going back)
  useEffect(() => {
    const currentAnswer = answers[`q${currentIndex}`]
    if (currentAnswer) {
      setSelectedOption(currentAnswer)
    } else {
      setSelectedOption(null)
    }
    setIsProcessing(false)
  }, [currentIndex, answers])

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
    if (isProcessing) return // Prevent multiple clicks

    setIsProcessing(true)
    setSelectedOption(value)

    // Save the answer
    const newAnswers = { ...answers, [`q${currentIndex}`]: value }
    setAnswers(newAnswers)

    // Wait 1 second then move to next question
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setShowUserInfo(true)
      }
      setIsProcessing(false)
    }, 1000)
  }

  // Validation functions
  const validateName = (name: string): { isValid: boolean; message: string } => {
    const nameRegex = /^[a-zA-Zઅ-હ\s]+$/

    if (!name.trim()) {
      return { isValid: false, message: "નામ જરૂરી છે" }
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: "નામ ઓછામાં ઓછું 2 અક્ષર હોવું જોઈએ" }
    }
    if (name.trim().length > 50) {
      return { isValid: false, message: "નામ 50 અક્ષરથી વધુ ન હોવું જોઈએ" }
    }
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, message: "નામમાં ફક્ત અક્ષરો અને સ્પેસ જ મંજૂર છે" }
    }
    return { isValid: true, message: "યોગ્ય નામ ✓" }
  }

  const validatePhone = (phone: string): { isValid: boolean; message: string } => {
    const phoneRegex = /^[6-9]\d{9}$/

    if (!phone.trim()) {
      return { isValid: false, message: "ફોન નંબર જરૂરી છે" }
    }
    if (!/^\d+$/.test(phone.trim())) {
      return { isValid: false, message: "ફક્ત નંબર જ મંજૂર છે" }
    }
    if (phone.trim().length !== 10) {
      return { isValid: false, message: "ફોન નંબર 10 અંકનો હોવો જોઈએ" }
    }
    if (!phoneRegex.test(phone.trim())) {
      return { isValid: false, message: "ફોન નંબર 6, 7, 8 અથવા 9 થી શરૂ થવો જોઈએ" }
    }
    return { isValid: true, message: "યોગ્ય ફોન નંબર ✓" }
  }

  const validateEmail = (email: string): { isValid: boolean; message: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      return { isValid: false, message: "ઈમેલ જરૂરી છે" }
    }
    if (!email.includes("@")) {
      return { isValid: false, message: "ઈમેલમાં @ હોવું જરૂરી છે" }
    }
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, message: "યોગ્ય ઈમેલ ફોર્મેટ નથી (example@domain.com)" }
    }
    if (email.trim().length > 100) {
      return { isValid: false, message: "ઈમેલ 100 અક્ષરથી વધુ ન હોવું જોઈએ" }
    }
    return { isValid: true, message: "યોગ્ય ઈમેલ ✓" }
  }

  const validateCity = (city: string): { isValid: boolean; message: string } => {
    const cityRegex = /^[a-zA-Zઅ-હ\s]+$/

    if (!city.trim()) {
      return { isValid: false, message: "શહેરનું નામ જરૂરી છે" }
    }
    if (city.trim().length < 2) {
      return { isValid: false, message: "શહેરનું નામ ઓછામાં ઓછું 2 અક્ષર હોવું જોઈએ" }
    }
    if (city.trim().length > 50) {
      return { isValid: false, message: "શહેરનું નામ 50 અક્ષરથી વધુ ન હોવું જોઈએ" }
    }
    if (!cityRegex.test(city.trim())) {
      return { isValid: false, message: "શહેરના નામમાં ફક્ત અક્ષરો અને સ્પેસ જ મંજૂર છે" }
    }
    return { isValid: true, message: "યોગ્ય શહેરનું નામ ✓" }
  }

  const validateGender = (gender: string): { isValid: boolean; message: string } => {
    if (!gender || !["Male", "Female", "Other"].includes(gender)) {
      return { isValid: false, message: "લિંગ પસંદ કરવું જરૂરી છે" }
    }
    return { isValid: true, message: "લિંગ પસંદ કર્યું ✓" }
  }

  // Handle input changes with real-time validation
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    // Validate the field
    let fieldValidation
    switch (field) {
      case "name":
        fieldValidation = validateName(value)
        break
      case "phone":
        fieldValidation = validatePhone(value)
        break
      case "email":
        fieldValidation = validateEmail(value)
        break
      case "city":
        fieldValidation = validateCity(value)
        break
      case "gender":
        fieldValidation = validateGender(value)
        break
      default:
        fieldValidation = { isValid: false, message: "" }
    }

    setValidation((prev) => ({
      ...prev,
      [field]: fieldValidation,
    }))
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const isFormValid = () => {
    return Object.values(validation).every((field) => field.isValid)
  }

  const getInputStyle = (field: keyof ValidationState) => {
    const baseStyle = {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      fontSize: "1rem",
      transition: "all 0.2s ease",
      border: "2px solid #e5e7eb",
    }

    if (!touched[field]) {
      return baseStyle
    }

    if (validation[field].isValid) {
      return {
        ...baseStyle,
        borderColor: "#10b981",
        backgroundColor: "#f0fdf4",
      }
    } else {
      return {
        ...baseStyle,
        borderColor: "#ef4444",
        backgroundColor: "#fef2f2",
      }
    }
  }

  const getValidationMessageStyle = (field: keyof ValidationState) => {
    if (!touched[field] || !validation[field].message) {
      return { display: "none" }
    }

    return {
      fontSize: "0.875rem",
      padding: "0.5rem 0.75rem",
      marginTop: "0.5rem",
      borderRadius: "0.375rem",
      display: "block",
      color: validation[field].isValid ? "#059669" : "#dc2626",
      backgroundColor: validation[field].isValid ? "#d1fae5" : "#fee2e2",
      border: `1px solid ${validation[field].isValid ? "#a7f3d0" : "#fecaca"}`,
    }
  }

  const submitSurvey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched to show validation messages
    setTouched({
      name: true,
      phone: true,
      email: true,
      city: true,
      gender: true,
    })

    // Validate all fields
    const nameValidation = validateName(formData.name)
    const phoneValidation = validatePhone(formData.phone)
    const emailValidation = validateEmail(formData.email)
    const cityValidation = validateCity(formData.city)
    const genderValidation = validateGender(formData.gender)

    setValidation({
      name: nameValidation,
      phone: phoneValidation,
      email: emailValidation,
      city: cityValidation,
      gender: genderValidation,
    })

    const allValid =
      nameValidation.isValid &&
      phoneValidation.isValid &&
      emailValidation.isValid &&
      cityValidation.isValid &&
      genderValidation.isValid

    if (!allValid) {
      setError("કૃપા કરીને બધી ફીલ્ડ યોગ્ય રીતે ભરો અને ભૂલો સુધારો.")
      return
    }

    setSubmitting(true)
    setError("")

    const finalData = { ...answers, ...formData }

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

  const getOptionStyle = (optionValue: string) => {
    const baseStyle = {
      width: "100%",
      padding: "1rem 1.5rem",
      textAlign: "left" as const,
      border: "2px solid #e5e7eb",
      borderRadius: "0.75rem",
      cursor: isProcessing ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      fontSize: "1rem",
      lineHeight: "1.5",
      marginBottom: "0.75rem",
      display: "block",
    }

    // Check if this option is selected (either currently or previously)
    const isSelected = selectedOption === optionValue
    const isPreviouslyAnswered = answers[`q${currentIndex}`] === optionValue

    if (isSelected || isPreviouslyAnswered) {
      return {
        ...baseStyle,
        // Lighter, more subtle selected background
        background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
        color: "#065f46",
        borderColor: "#10b981",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
        fontWeight: "500",
      }
    }

    if (isProcessing) {
      return {
        ...baseStyle,
        backgroundColor: "#f9fafb",
        opacity: "0.6",
        cursor: "not-allowed",
      }
    }

    return {
      ...baseStyle,
      backgroundColor: "#f9fafb",
    }
  }

  const getOptionHoverStyle = (optionValue: string) => {
    const isSelected = selectedOption === optionValue
    const isPreviouslyAnswered = answers[`q${currentIndex}`] === optionValue

    if (isSelected || isPreviouslyAnswered || isProcessing) {
      return {}
    }
    return {
      backgroundColor: "#eff6ff",
      borderColor: "#3b82f6",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
                {questions[currentIndex]?.options.map((option, index) => {
                  const optionValue = ["a", "b", "c"][index]
                  const isSelected = selectedOption === optionValue
                  const isPreviouslyAnswered = answers[`q${currentIndex}`] === optionValue

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(optionValue)}
                      disabled={isProcessing}
                      style={getOptionStyle(optionValue)}
                      onMouseEnter={(e) => {
                        if (!isSelected && !isPreviouslyAnswered && !isProcessing) {
                          Object.assign(e.currentTarget.style, getOptionHoverStyle(optionValue))
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected && !isPreviouslyAnswered && !isProcessing) {
                          Object.assign(e.currentTarget.style, getOptionStyle(optionValue))
                        }
                      }}
                    >
                      {option}
                      {(isSelected || isPreviouslyAnswered) && (
                        <span
                          style={{
                            float: "right",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "#10b981",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Show answer change option if previously answered */}
              {answers[`q${currentIndex}`] && !isProcessing && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    backgroundColor: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#0369a1",
                    textAlign: "center",
                  }}
                >
                  💡 તમે આ પ્રશ્નનો જવાબ આપ્યો છે. નવો વિકલ્પ પસંદ કરવા માટે ક્લિક કરો.
                </div>
              )}

              {/* Navigation */}
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {currentIndex > 0 ? (
                  <button
                    onClick={() => {
                      if (!isProcessing) {
                        setCurrentIndex(currentIndex - 1)
                      }
                    }}
                    disabled={isProcessing}
                    className="btn btn-secondary"
                    style={{
                      opacity: isProcessing ? "0.5" : "1",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                    }}
                  >
                    પાછળ
                  </button>
                ) : (
                  <div></div>
                )}

                {/* Show next button if answer is already selected */}
                {answers[`q${currentIndex}`] && !isProcessing && (
                  <button
                    onClick={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex(currentIndex + 1)
                      } else {
                        setShowUserInfo(true)
                      }
                    }}
                    className="btn btn-primary"
                  >
                    આગળ
                  </button>
                )}

                {isProcessing && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#10b981",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    <div
                      style={{
                        width: "1rem",
                        height: "1rem",
                        border: "2px solid #10b981",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "0.5rem",
                      }}
                    ></div>
                    આગળ વધી રહ્યા છીએ...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Info Form - keeping the same as before */}
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
                  {/* Name Field */}
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
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        style={getInputStyle("name")}
                        placeholder="તમારું નામ લખો (ફક્ત અક્ષરો)"
                      />
                      {touched.name && validation.name.isValid && (
                        <span
                          style={{
                            position: "absolute",
                            right: "0.75rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#10b981",
                            fontSize: "1.25rem",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div style={getValidationMessageStyle("name")}>{validation.name.message}</div>
                  </div>

                  {/* Gender Field */}
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
                      {[
                        { value: "Male", label: "પુરુષ" },
                        { value: "Female", label: "સ્ત્રી" },
                        { value: "Other", label: "અન્ય" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0.75rem 1rem",
                            backgroundColor: formData.gender === option.value ? "#eff6ff" : "#f9fafb",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            border: formData.gender === option.value ? "2px solid #3b82f6" : "2px solid transparent",
                          }}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={formData.gender === option.value}
                            onChange={(e) => {
                              handleInputChange("gender", e.target.value)
                              handleBlur("gender")
                            }}
                            style={{ marginRight: "0.75rem" }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                    <div style={getValidationMessageStyle("gender")}>{validation.gender.message}</div>
                  </div>

                  {/* Phone Field */}
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
                    <div style={{ position: "relative" }}>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          // Only allow digits and limit to 10 characters
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                          handleInputChange("phone", value)
                        }}
                        onBlur={() => handleBlur("phone")}
                        style={getInputStyle("phone")}
                        placeholder="10 અંકનો નંબર (6-9 થી શરૂ)"
                        maxLength={10}
                      />
                      {touched.phone && validation.phone.isValid && (
                        <span
                          style={{
                            position: "absolute",
                            right: "0.75rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#10b981",
                            fontSize: "1.25rem",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div style={getValidationMessageStyle("phone")}>{validation.phone.message}</div>
                  </div>

                  {/* Email Field */}
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
                    <div style={{ position: "relative" }}>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        style={getInputStyle("email")}
                        placeholder="તમારું ઈમેલ સરનામું"
                      />
                      {touched.email && validation.email.isValid && (
                        <span
                          style={{
                            position: "absolute",
                            right: "0.75rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#10b981",
                            fontSize: "1.25rem",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div style={getValidationMessageStyle("email")}>{validation.email.message}</div>
                  </div>

                  {/* City Field */}
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
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        onBlur={() => handleBlur("city")}
                        style={getInputStyle("city")}
                        placeholder="તમારું શહેર (ફક્ત અક્ષરો)"
                      />
                      {touched.city && validation.city.isValid && (
                        <span
                          style={{
                            position: "absolute",
                            right: "0.75rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#10b981",
                            fontSize: "1.25rem",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div style={getValidationMessageStyle("city")}>{validation.city.message}</div>
                  </div>
                </div>

                {/* Form Summary */}
                {Object.values(touched).some((t) => t) && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1rem",
                      backgroundColor: isFormValid() ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${isFormValid() ? "#bbf7d0" : "#fecaca"}`,
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>ફોર્મ સ્થિતિ:</div>
                    <div style={{ color: isFormValid() ? "#059669" : "#dc2626" }}>
                      {isFormValid()
                        ? "✓ બધી માહિતી યોગ્ય છે. તમે સબમિટ કરી શકો છો."
                        : "⚠ કૃપા કરીને બધી ફીલ્ડ યોગ્ય રીતે ભરો."}
                    </div>
                  </div>
                )}

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
                  <button
                    type="submit"
                    disabled={submitting || !isFormValid()}
                    className="btn btn-primary"
                    style={{
                      flex: "1",
                      opacity: !isFormValid() || submitting ? "0.5" : "1",
                      cursor: !isFormValid() || submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? "સબમિટ થઈ રહ્યું છે..." : "પરિણામ જુઓ"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Results - keeping the same as before */}
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
                  href="https://drive.google.com/uc?export=download&id=1vt1VCYK3EVexqfyqO9WuVwR-1w4Rj6Q9"
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
                  અહિયાં તમારું આહાર યોજના ડાઉનલોડ કરો
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
