// Baymax proxy integration (calls your Cloudflare Worker)

// NOTE: Adjust the endpoint if you're using a custom domain or different path.
const BAYMAX_ENDPOINT = "https://baymax-proxy.onslaught2342.workers.dev/";

interface WorkerChoice {
	message?: { content?: string };
	text?: string;
	[k: string]: unknown;
}

interface WorkerResponseShape {
	reply?: string;
	choices?: WorkerChoice[];
	[k: string]: unknown;
}

function generateUUIDFallback(): string {
	// fallback generator if crypto.randomUUID isn't available
	const arr = new Uint8Array(16);
	crypto.getRandomValues(arr);
	arr[6] = (arr[6] & 0x0f) | 0x40;
	arr[8] = (arr[8] & 0x3f) | 0x80;
	const hex = Array.from(arr)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
		12,
		16
	)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
function getSessionId(): string {
	try {
		const key = "baymax_session_id";
		let id = sessionStorage.getItem(key);
		if (!id) {
			id =
				typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
					? crypto.randomUUID()
					: generateUUIDFallback();
			sessionStorage.setItem(key, id);
		}
		return id;
	} catch {
		// worst-case fallback to a short random string (shouldn't happen in normal browsers)
		return "s_" + Math.random().toString(36).slice(2, 10);
	}
}

export async function sendMessageToBaymax(message: string): Promise<string> {
	const payload = {
		sessionId: getSessionId(),
		userMessage: message,
	};

	try {
		const res = await fetch(BAYMAX_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			// try to read json error body
			const text = await res.text();
			let parsed;
			try {
				parsed = JSON.parse(text);
			} catch {
				parsed = text;
			}
			throw new Error(`Worker error ${res.status}: ${JSON.stringify(parsed)}`);
		}

		const contentType = res.headers.get("Content-Type") || "";
		let data: WorkerResponseShape;
		if (contentType.includes("application/json")) {
			data = await res.json();
		} else {
			const text = await res.text();
			try {
				data = JSON.parse(text);
			} catch {
				// fallback to raw text as reply
				return text;
			}
		}

		const reply =
			data?.reply ??
			data?.choices?.[0]?.message?.content ??
			(typeof data?.choices?.[0]?.text === "string"
				? data.choices[0].text
				: null);

		if (reply) return reply;

		// Fallback: a local mock if upstream returns nothing
		return getMockBaymaxResponse(message);
	} catch (err) {
		console.error("Error calling Baymax proxy:", err);
		throw err;
	}
}

// --- keep your mock fallback (useful for dev) ---
export function getMockBaymaxResponse(message: string): string {
	const lowerMessage = message.toLowerCase();

	if (/(pain|hurt|ache)/.test(lowerMessage)) {
		return "I understand you are experiencing discomfort. On a scale of 1 to 10, how would you rate your pain?";
	}
	if (/(stress|anxious|worried)/.test(lowerMessage)) {
		return "I detect elevated stress indicators. Try deep breathing and short walks; would you like a guided breathing exercise?";
	}
	if (/(sleep|tired|fatigue)/.test(lowerMessage)) {
		return "Adults generally need 7–9 hours of sleep. Do you have trouble falling asleep or staying asleep?";
	}
	if (/(exercise|workout|fitness)/.test(lowerMessage)) {
		return "Aim for 150 minutes of moderate exercise weekly. Want a 10-minute routine?";
	}
	if (/(diet|nutrition|food)/.test(lowerMessage)) {
		return "Balanced diet: vegetables, whole grains, lean proteins, hydration. For specifics consider a dietitian.";
	}
	if (/(hello|hi|hey)/.test(lowerMessage)) {
		return "Hello! I am Baymax, your personal healthcare companion. How can I help?";
	}
	if (/(thank you|thanks)/.test(lowerMessage)) {
		return "You’re welcome — happy to help!";
	}

	const general = [
		"Tell me more about what you are feeling so I can help better.",
		"Please describe your symptoms in a few words (duration, intensity).",
		"On a scale of 1–10, how severe is this for you right now?",
	];
	return general[Math.floor(Math.random() * general.length)];
}
