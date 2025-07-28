import type { NextApiRequest, NextApiResponse } from "next"

// Questions data
const questions = {
  questions: [
    {
      question: "તમારા દાંત કેવા છે? (મજબૂતી અને રંગ)?",
      options: ["અનિયમિત, વાંકાચૂકા, સહેજ કાળાશ પડતા", "મધ્યમ, સહેજ પીળાશ પડતા", "મજબૂત, સફેદ"],
    },
    {
      question: "તમો કોઇ અણગમતી ઘટના થી ઉત્તેજીત/ઉશ્કેરાઈ જાઓ છો?",
      options: [
        "હા, નાની નાની બાબતોથી પણ ઉશ્કેરાઈ જાઉં છું",
        "હા, અમુક ચોક્કસ પરિસ્થિઓમાં ઉશ્કેરાઈ જાઉં છું",
        "મોટે ભાગે નહી, જૂજ પરિસ્થિતિઓમાં ઉશ્કેરાઈ જાઉં છું",
      ],
    },
    {
      question: "તમારી ભૂખ કેવી છે",
      options: [
        "મને વારંવાર ભૂખ લાગે છે. ભૂખ સમય પણ અનિયમિત",
        "મને મોટે ભાગે નિયત સમયે જ ભૂખ લાગે, પરંતુ હું ભૂખ લાંબા સમય સુધી સહન ન કરી શકું",
        "મને મોટે ભાગે લાંબા સમયમાં ભૂખ લાગે, પરંતુ હું ભૂખ સહન કરી શકું",
      ],
    },
    {
      question: "તમારી ત્વચા કેવી છે?",
      options: ["સૂકી, કરચલીઓ યુક્ત", "ખીલ અને તલ યુક્ત, લીસી", "ઘટ્ટ, તૈલી ત્વચા (soft & oily)"],
    },
    {
      question: "તમારા માથાનાં વાળ કેવા છે?",
      options: ["આછા, રૂક્ષ, તુટેલા, વધુ ખરે", "આછા, સુંવાળા, નાની ઉંમરે ટાલ પડે કે સફેદ થાય", "લાંબા, ઘટ્ટ, ચમકદાર, મજબૂત"],
    },
    {
      question: "તમને ક્યા પ્રકારનો ખોરાક(સ્વાદ) વધારે ગમે છે?",
      options: ["મીઠો અને ખાટો", "તીખો અને ખારો", "મીઠો અને તૂરો"],
    },
    {
      question: "કોઈપણ નવી વસ્તુને સમજવામાં તમારી ગ્રહણશક્તિ કેવી છે?",
      options: ["વસ્તુઓને સમજવામાં મારે સમય લેવો પડે છે", "તરત જ સમજી અને ગ્રહણ કરી શકું છું", "સમજવામાં સમય લાગે પણ બહુ વધુ નહી"],
    },
    {
      question: "ક્યાં શ��રીરિક લક્ષણો તમને વારંવાર ઉત્પન્ન થાય છે?",
      options: [
        "સાંધાના દુખાવા, વા, અપચો",
        "ચામડીના રોગો, ચાંદા પડવા, ખીલ, વાળ ખરવા",
        "શરદી-ઉધરસ, એલર્જી, દમ, કાકડા માં સોજો",
      ],
    },
    {
      question: "તમારું વ્યક્તિત્વ કેવું છે?",
      options: [
        "વ્યાકુળચિત્ત, પરિવર્તનશીલ, કોઈપણ કાર્યની શરૂઆત ખૂબ ઉત્સાહથી કરનાર",
        "નેતૃત્વ લેનાર, હિંમતભર્યું, સાહસી",
        "સ્નેહાળ, ક્ષમાવાન, દયાળુ, શાંત",
      ],
    },
    {
      question: "તમે ગમે તે વસ્તુ ખાઓ તો પચાવી શકો છો?",
      options: [
        "ક્યારેક પચાવી શકું, ક્યારેક ન પચાવી શકું - પાચન શક્તિ અનિયમિત છે",
        "હા, કોઇપણ વસ્તુ પચી જાય છે",
        "પાચન થઈ જાય છે ,પરંતુ થોડી વાર લાગે છે",
      ],
    },
    // Add all remaining questions from your original code here...
  ],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} /api/questions`)

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept")

  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  res.status(200).json(questions)
}
