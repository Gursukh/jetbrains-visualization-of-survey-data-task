import { NextRequest, NextResponse } from "next/server";

const isWhitespaceString = (str: string) => !str.replace(/\s/g, "").length;

export async function POST(request: NextRequest) {
  const url = "https://language.googleapis.com/v2/documents:analyzeSentiment";
  const apiKey = process.env.API_KEY; // Replace with your actual API key

  const CHARACTER_LIMIT = 1000;

  const data = await request.json();

  if (data.text === undefined || data.text === null || isWhitespaceString(data.text)) {
    console.error("Error during sentiment analysis:", "Empty text feild.");
    return NextResponse.json({ error: "Empty text feild." }, { status: 400 });
  }

  if (data.text.length > CHARACTER_LIMIT) {
    console.error(
      "Error during sentiment analysis:",
      `Character limit exceeded. (${CHARACTER_LIMIT})`
    );
    return NextResponse.json(
      { error: `Character limit exceeded. (${CHARACTER_LIMIT})` },
      { status: 400 }
    );
  }

  const requestBody = {
    document: {
      type: "PLAIN_TEXT",
      content: data.text,
    },
    encodingType: "UTF8",
  };

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error during sentiment analysis:", errorResponse);
      return NextResponse.json(
        { error: errorResponse },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Sentiment Analysis Response:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error during sentiment analysis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
