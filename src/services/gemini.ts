const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const BACKOFF_MULTIPLIER = 2;

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(conversationHistory: Array<{role: string, parts: Array<{text: string}>}>, retryCount = 0): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google Gemini API key is required');
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API request failed: ${response.status} ${response.statusText}`;
        
        // Check if it's a retryable error (overloaded, rate limit, etc.)
        const isRetryable = response.status === 429 || 
                           response.status === 503 || 
                           response.status >= 500 ||
                           errorMessage.toLowerCase().includes('overloaded') ||
                           errorMessage.toLowerCase().includes('rate limit');
        
        if (isRetryable && retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, retryCount);
          console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          await wait(delay);
          return this.sendMessage(conversationHistory, retryCount + 1);
        }
        
        throw new Error(
          errorMessage
        );
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Google Gemini API');
      }

      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      // If it's a network error and we haven't exhausted retries, try again
      if (retryCount < MAX_RETRIES && 
          (error instanceof TypeError || 
           (error instanceof Error && error.message.includes('fetch')))) {
        const delay = RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, retryCount);
        console.log(`Network error, retrying in ${delay}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await wait(delay);
        return this.sendMessage(conversationHistory, retryCount + 1);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with Google Gemini API');
    }
  }
}

export const createGeminiService = (apiKey: string) => {
  return new GeminiService(apiKey);
};