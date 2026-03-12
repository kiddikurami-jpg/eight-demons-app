import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export async function handler(event) {

  if (event.httpMethod === "GET") {

    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }

  if (event.httpMethod === "POST") {

    const body = JSON.parse(event.body)

    const { data } = await supabase
      .from("announcements")
      .insert([body])

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }
}
