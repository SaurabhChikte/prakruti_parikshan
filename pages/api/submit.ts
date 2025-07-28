import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

console.log("Environment check:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
})

const supabase = createClient(supabaseUrl!, supabaseKey!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} /api/submit`)
  console.log("[API] Headers:", req.headers)
  console.log("[API] Body:", req.body)

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept")

  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  if (req.method === "GET") {
    res.status(200).json({
      message: "Submit API is working. Use POST method to submit survey data.",
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const formData = req.body
    console.log("Processing form data:", formData)

    // Manual validation
    const errors: string[] = []

    const validateField = (value: string, regex: RegExp, minLength: number, errorMessage: string) => {
      if (!value || value.trim().length < minLength || !regex.test(value.trim())) {
        errors.push(errorMessage)
      }
    }

    validateField(
      formData.name,
      /^[a-zA-Zઅ-હ\s]+$/,
      2,
      "Name must contain only letters and spaces and be at least 2 characters.",
    )
    validateField(formData.phone, /^[6-9]\d{9}$/, 10, "Phone number must be 10 digits starting with 6-9.")
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push("Please provide a valid email.")
    }
    validateField(
      formData.city,
      /^[a-zA-Zઅ-હ\s]+$/,
      2,
      "City must contain only letters and spaces and be at least 2 characters.",
    )
    if (!["Male", "Female", "Other"].includes(formData.gender)) {
      errors.push("Please select a valid gender.")
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors)
      res.status(400).json({
        error: "Validation failed",
        details: errors,
      })
      return
    }

    // Count a/b/c options
    let aCount = 0
    let bCount = 0
    let cCount = 0

    Object.keys(formData).forEach((key) => {
      if (key.startsWith("q")) {
        const answer = formData[key]
        if (answer === "a") aCount++
        else if (answer === "b") bCount++
        else if (answer === "c") cCount++
      }
    })

    console.log("Answer counts:", { aCount, bCount, cCount })

    // Calculate result
    let surveyResult = ""
    let resultDescription = ""

    if (aCount >= 15) {
      surveyResult = "વાત પ્રકૃતિ"
      resultDescription = "તમારું સ્વાસ્થ્ય વાત પ્રકૃતિનું છે. તમે સક્રિય, ઝડપી અને સર્જનાત્મક છો."
    } else if (bCount >= 15) {
      surveyResult = "પિત્ત પ્રકૃતિ"
      resultDescription = "તમારું સ્વાસ્થ્ય પિત્ત પ્રકૃતિનું છે. તમે બુદ્ધિશાળી, નેતૃત્વ ક્ષમતા ધરાવતા અને મહત્વાકાંક્ષી છો."
    } else if (cCount >= 15) {
      surveyResult = "કફ પ્રકૃતિ"
      resultDescription = "તમારું સ્વાસ્થ્ય કફ પ્રકૃતિનું છે. તમે શાંત, સ્થિર અને દયાળુ છો."
    } else {
      const counts = [
        ["વાત", aCount],
        ["પિત્ત", bCount],
        ["કફ", cCount],
      ]
      counts.sort((a, b) => (b[1] as number) - (a[1] as number))
      surveyResult = `${counts[0][0]}-${counts[1][0]} પ્રકૃતિ`
      resultDescription = `તમારું સ્વાસ્થ્ય ${counts[0][0]} અને ${counts[1][0]} પ્રકૃતિનું મિશ્રણ છે.`
    }

    const recordToInsert = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      scores: `વાત: ${aCount}, પિત્ત: ${bCount}, કફ: ${cCount}`,
      result: surveyResult,
      description: resultDescription,
    }

    console.log("Attempting to insert into Supabase:", recordToInsert)

    // Save to Supabase
    const { data, error } = await supabase.from("survey_responses").insert([recordToInsert]).select()

    if (error) {
      console.error("Supabase insert error:", error)
      res.status(500).json({ error: "પરિણામ સાચવવામાં સમસ્યા આવી. કૃપા કરીને ફરીથી પ્રયાસ કરો." })
      return
    }

    console.log("Supabase insert successful:", data)

    const response = {
      result: surveyResult,
      description: resultDescription,
      counts: { vata: aCount, pitta: bCount, kapha: cCount },
    }

    console.log("Sending response:", response)
    res.status(200).json(response)
  } catch (error: any) {
    console.error("API submit error:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({
      error: "કંઈક ખોટું થયું છે. કૃપા કરીને ફરીથી પ્રયાસ કરો.",
      details: error.message,
    })
  }
}
