// Groq API integration for Baymax chatbot
// Note: This should be moved to a server-side API route for production

interface GroqResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
}

export async function sendMessageToGroq(message: string): Promise<string> {
	try {
		// Note: In a real application, this API call should be made from a server-side route
		// to keep the API key secure. This is a client-side example for development.

		const response = await fetch(
			"https://api.groq.com/openai/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // This won't work client-side
				},
				body: JSON.stringify({
					model: "llama-3.1-8b-instant", // Using Mixtral model instead of the one in your example
					messages: [
						{
							role: "system",
							content:
								"You are Baymax, a personal healthcare companion from Big Hero 6. You are caring, gentle, and focused on helping with health and wellness. Always maintain a warm, helpful, and slightly formal tone like the character.",
						},
						{
							role: "user",
							content: message,
						},
					],
					max_tokens: 1000,
					temperature: 0.7,
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: GroqResponse = await response.json();
		return (
			data.choices[0]?.message?.content ||
			"I'm here to help you. Could you please rephrase your question?"
		);
	} catch (error) {
		console.error("Error calling Groq API:", error);
		throw new Error("Failed to get response from Baymax");
	}
}

// Alternative mock response for development/testing
export function getMockBaymaxResponse(message: string): string {
	const lowerMessage = message.toLowerCase();

	// Health-related responses
	if (
		lowerMessage.includes("pain") ||
		lowerMessage.includes("hurt") ||
		lowerMessage.includes("ache")
	) {
		return "I understand you are experiencing discomfort. On a scale of 1 to 10, how would you rate your pain? It is important to monitor your symptoms and consider consulting with a healthcare professional if the pain persists.";
	}

	if (
		lowerMessage.includes("stress") ||
		lowerMessage.includes("anxious") ||
		lowerMessage.includes("worried")
	) {
		return "I detect elevated stress indicators in your message. Stress can impact your physical and mental wellbeing. I recommend deep breathing exercises, adequate rest, and regular physical activity. Would you like me to guide you through a brief relaxation technique?";
	}

	if (
		lowerMessage.includes("sleep") ||
		lowerMessage.includes("tired") ||
		lowerMessage.includes("fatigue")
	) {
		return "Adequate sleep is essential for optimal health and healing. Adults require 7-9 hours of quality sleep per night. I recommend establishing a consistent sleep schedule and creating a relaxing bedtime routine. Are you experiencing difficulties with sleep quality or duration?";
	}

	if (
		lowerMessage.includes("exercise") ||
		lowerMessage.includes("workout") ||
		lowerMessage.includes("fitness")
	) {
		return "Regular physical activity is excellent for your cardiovascular health and overall wellbeing. I recommend at least 150 minutes of moderate-intensity exercise per week. Always remember to warm up before exercising and cool down afterward to prevent injury.";
	}

	if (
		lowerMessage.includes("diet") ||
		lowerMessage.includes("nutrition") ||
		lowerMessage.includes("food")
	) {
		return "Proper nutrition is fundamental to good health. A balanced diet should include fruits, vegetables, whole grains, lean proteins, and adequate hydration. I recommend consulting with a registered dietitian for personalized nutritional guidance.";
	}

	if (
		lowerMessage.includes("hello") ||
		lowerMessage.includes("hi") ||
		lowerMessage.includes("hey")
	) {
		return "Hello! I am Baymax, your personal healthcare companion. I am here to help you with health and wellness information. How may I assist you today?";
	}

	if (lowerMessage.includes("thank you") || lowerMessage.includes("thanks")) {
		return "You are very welcome! It is my pleasure to help you maintain good health and wellbeing. Is there anything else I can assist you with today?";
	}

	// General Baymax responses
	const generalResponses = [
		"I am programmed to assist with your healthcare needs. Please tell me more about your concern so I can provide appropriate guidance.",
		"Your health and wellbeing are my primary concern. I am here to help you make informed decisions about your health.",
		"I detect that you may need healthcare guidance. As your personal healthcare companion, I am equipped to provide you with helpful information.",
		"On a scale of 1 to 10, how would you rate your current health concern? This will help me provide more targeted assistance.",
		"I am here to help you achieve optimal health and wellness. Please provide more details about your situation so I can offer appropriate support.",
		"Your satisfaction is my primary directive. I am designed to provide caring, comprehensive healthcare assistance.",
		"I recommend documenting your symptoms and concerns. This information can be valuable when consulting with healthcare professionals.",
	];

	return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}
