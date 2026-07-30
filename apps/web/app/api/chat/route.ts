import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { model, messages, prompt } = await req.json();

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY environment variable is not configured on the server." },
        { status: 500 }
      );
    }

    // Default to openrouter/free (OpenRouter Auto Free Model Router)
    let targetModel = model || "openrouter/free";
    if (targetModel.includes("gemini") || targetModel.includes("llama-3.3-70b-instruct:free")) {
      targetModel = "openrouter/free";
    }

    // Clean up messages payload to eliminate prompt duplication & token bloat
    const formattedMessages = messages && messages.length > 0
      ? messages.map((m: any) => ({ role: m.role, content: m.content }))
      : [
          { role: "system", content: "You are Aether AI Co-pilot. Help the user build software and answer questions accurately." },
          { role: "user", content: prompt },
        ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Aether OS",
      },
      body: JSON.stringify({
        model: targetModel,
        messages: formattedMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `OpenRouter error: ${errText}` }, { status: response.status });
    }

    // Return true SSE stream response to client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
