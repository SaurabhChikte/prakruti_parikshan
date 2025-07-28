import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} /api/export-csv`)

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  if (!supabase) {
    res.status(500).json({ error: "Database configuration error" })
    return
  }

  try {
    const { data, error } = await supabase.from("survey_responses").select("*").order("timestamp", { ascending: false })

    if (error) {
      console.error("Supabase fetch error:", error)
      res.status(500).json({ error: "Failed to fetch survey responses." })
      return
    }

    if (!data || data.length === 0) {
      res.status(404).json({ message: "No survey responses found." })
      return
    }

    // Create CSV content manually
    const headers = ["Timestamp", "Name", "Gender", "Phone", "Email", "City", "Scores", "Result", "Description"]

    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.timestamp,
          `"${row.name}"`,
          row.gender,
          row.phone,
          `"${row.email}"`,
          `"${row.city}"`,
          `"${row.scores}"`,
          `"${row.result}"`,
          `"${row.description}"`,
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", 'attachment; filename="survey_responses.csv"')
    res.status(200).send(csvContent)
  } catch (error: any) {
    console.error("CSV export error:", error)
    res.status(500).json({ error: "Failed to generate CSV." })
  }
}
