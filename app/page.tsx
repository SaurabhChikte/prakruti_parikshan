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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">પ્રશ્નો લોડ થઈ રહ્યા છે...</p>
        </div>
      </div>
    )
  }

  if (error && !showUserInfo && !showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <p className="font-semibold">ભૂલ</p>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              ફરીથી પ્રયાસ કરો
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-6 text-center">
            <div className="mb-4">
              <img
                src="https://www.cugujarat.ac.in/assets/images/logo.png"
                alt="University Logo"
                className="h-16 w-auto mx-auto"
              />
            </div>
            <h1 className="text-2xl font-bold">પ્રકૃતિ પરીક્ષણ</h1>
            <p className="mt-2 opacity-90">Children's Research University</p>
          </div>

          {/* Progress Bar */}
          {!showResult && (
            <div className="bg-gray-50 p-4">
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 progress-bar"
                  style={{
                    width: showUserInfo ? "100%" : `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600">
                {showUserInfo ? "વ્યક્તિગત માહિતી" : `પ્રશ્ન ${currentIndex + 1} / ${questions.length}`}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">{error}</div>}

          {/* Questions */}
          {!showUserInfo && !showResult && questions.length > 0 && (
            <div className="p-6">
              <div className="question-card">
                <h3 className="text-lg font-semibold mb-6 text-center">
                  {currentIndex + 1}. {questions[currentIndex]?.question}
                </h3>

                <div className="space-y-3">
                  {questions[currentIndex]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(["a", "b", "c"][index])}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-all duration-200 option-button hover:border-blue-300"
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="mt-6 flex justify-between">
                  {currentIndex > 0 ? (
                    <button
                      onClick={() => setCurrentIndex(currentIndex - 1)}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      પાછળ
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Info Form */}
          {showUserInfo && !showResult && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-center">📝 વ્યક્તિગત માહિતી</h3>

              <form onSubmit={submitSurvey}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">નામ *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      pattern="[a-zA-Zઅ-હ\s]+"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="તમારું નામ લખો (ફક્ત અક્ષરો)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">લિંગ *</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="radio" name="gender" value="Male" required className="mr-3" />
                        પુરુષ
                      </label>
                      <label className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="radio" name="gender" value="Female" required className="mr-3" />
                        સ્ત્રી
                      </label>
                      <label className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="radio" name="gender" value="Other" required className="mr-3" />
                        અન્ય
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">ફોન નંબર *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10 અંકનો નંબર (6-9 થી શરૂ)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">ઈમેલ *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="તમારું ઈમેલ સરનામું"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">શહેર *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      pattern="[a-zA-Zઅ-હ\s]+"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="તમારું શહેર (ફક્ત અક્ષરો)"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserInfo(false)
                      setCurrentIndex(questions.length - 1)
                    }}
                    className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={submitting}
                  >
                    પાછા જાઓ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "સબમિટ થઈ રહ્યું છે..." : "પરિણામ જુઓ"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Results */}
          {showResult && result && (
            <div className="p-6 text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">{result.result}</h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">{result.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{result.counts.vata}</div>
                  <div className="text-sm text-gray-600 mt-1">વાત</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{result.counts.pitta}</div>
                  <div className="text-sm text-gray-600 mt-1">પિત્ત</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{result.counts.kapha}</div>
                  <div className="text-sm text-gray-600 mt-1">કફ</div>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href="/api/export-csv"
                  className="inline-block py-3 px-8 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  📊 CSV ડાઉનલોડ કરો
                </a>

                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="py-2 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    નવું સર્વે શરૂ કરો
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
