import { NextResponse } from "next/server";

export async function GET() {
  const url = 'https://language.googleapis.com/v2/documents:analyzeSentiment';
  const apiKey = process.env.API_KEY; // Replace with your actual API key

  const requestBody = {
    document: {
      type: 'PLAIN_TEXT',
      content: 'I love coding in TypeScript!',
    },
    encodingType: 'UTF8',
  };

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error during sentiment analysis:', errorResponse);
      return NextResponse.json({ error: errorResponse }, { status: response.status });
    }

    const data = await response.json();
    console.log('Sentiment Analysis Response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during sentiment analysis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
