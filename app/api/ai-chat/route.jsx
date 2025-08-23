import { NextResponse } from "next/server";
import { ChatSession } from "@/configs/AiModel";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await ChatSession.sendMessage(prompt);
    const AIResp = result.response.text();

    return NextResponse.json({ result: AIResp });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
