import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

export async function GET() {
  try {
    const { data, error } = await supabase.from("survey_responses").select("*").order("timestamp", { ascending: false })

    if (error) {
      console.error("Supabase fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch survey responses." }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "No survey responses found." }, { status: 404 })
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

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="survey_responses.csv"',
      },
    })
  } catch (error: any) {
    console.error("CSV export error:", error)
    return NextResponse.json({ error: "Failed to generate CSV." }, { status: 500 })
  }
}
