import { useEffect, useState } from "react"
import Head from "next/head"

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

  const submitSurvey = async (formData: FormData) => {
    const finalData = { ...answers }
    for (const [key, value] of formData.entries()) {
      finalData[key] = value
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setResult(result)
      setShowResult(true)
    } catch (error) {
      console.error("Submission error:", error)
      setError("પરિણામ સાચવવામાં સમસ્યા આવી. કૃપા કરીને ફરીથી પ્રયાસ કરો.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>પ્રશ્નો લોડ થઈ રહ્યા છે...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>પ્રકૃતિ પરીક્ષણ - Children's Research University</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-6 rounded-t-lg text-center">
              <h1 className="text-2xl font-bold">પ્રકૃતિ પરીક્ષણ</h1>
              <p className="mt-2">Children's Research University</p>
            </div>

            {!showUserInfo && !showResult && (
              <div className="p-6">
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-600">
                    પ્રશ્ન {currentIndex + 1} / {questions.length}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {currentIndex + 1}. {questions[currentIndex]?.question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentIndex]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(["a", "b", "c"][index])}
                        className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showUserInfo && !showResult && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-center">વ્યક્તિગત માહિતી</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    submitSurvey(formData)
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">નામ *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="તમારું નામ લખો"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">લિંગ *</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="radio" name="gender" value="Male" required className="mr-2" />
                          પુરુષ
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="gender" value="Female" required className="mr-2" />
                          સ્ત્રી
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="gender" value="Other" required className="mr-2" />
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10 અંકનો નંબર"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="તમારું શહેર"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowUserInfo(false)}
                      className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      પાછા જાઓ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      પરિણામ જુઓ
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showResult && result && (
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">{result.result}</h2>
                <p className="text-gray-700 mb-6">{result.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.counts.vata}</div>
                    <div className="text-sm text-gray-600">વાત</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.counts.pitta}</div>
                    <div className="text-sm text-gray-600">પિત્ત</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.counts.kapha}</div>
                    <div className="text-sm text-gray-600">કફ</div>
                  </div>
                </div>

                <a
                  href="/api/export-csv"
                  className="inline-block py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  CSV ડાઉનલોડ કરો
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
