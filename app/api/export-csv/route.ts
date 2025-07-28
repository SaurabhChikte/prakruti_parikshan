import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"
import { createObjectCsvStringifier } from "csv-writer"

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

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "timestamp", title: "Timestamp" },
        { id: "name", title: "Name" },
        { id: "gender", title: "Gender" },
        { id: "phone", title: "Phone" },
        { id: "email", title: "Email" },
        { id: "city", title: "City" },
        { id: "scores", title: "Scores" },
        { id: "result", title: "Result" },
        { id: "description", title: "Description" },
      ],
    })

    const csvHeader = csvStringifier.getHeaderString()
    const csvRecords = csvStringifier.stringifyRecords(data)
    const csvContent = csvHeader + csvRecords

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
