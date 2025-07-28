import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} /api/test`)

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
      message: "API routes are working correctly",
      timestamp: new Date().toISOString(),
      method: "GET",
    })
    return
  }

  if (req.method === "POST") {
    try {
      const body = req.body
      res.status(200).json({
        message: "POST request successful",
        receivedData: body,
        timestamp: new Date().toISOString(),
        method: "POST",
      })
    } catch (error) {
      res.status(400).json({
        error: "Failed to parse JSON",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
    return
  }

  res.status(405).json({ error: "Method not allowed" })
}
