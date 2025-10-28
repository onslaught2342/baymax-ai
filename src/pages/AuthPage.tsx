// AuthPage.tsx
import React, { useState } from "react";
import { login, signup } from "@/lib/groq-api";

const AuthPage: React.FC = () => {
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		try {
			if (mode === "signup") {
				const token = await signup(username, password);
				setSuccess("Signup successful! Token: " + token);
			} else {
				const token = await login(username, password);
				setSuccess("Login successful! Token: " + token);
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white p-8 rounded shadow">
				<h2 className="text-2xl font-bold mb-6 text-center">
					{mode === "login" ? "Login" : "Sign Up"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block mb-1 font-medium">Username</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full border px-3 py-2 rounded"
							required
						/>
					</div>
					<div>
						<label className="block mb-1 font-medium">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full border px-3 py-2 rounded"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
						disabled={loading}
					>
						{loading
							? mode === "login"
								? "Logging in..."
								: "Signing up..."
							: mode === "login"
							? "Login"
							: "Sign Up"}
					</button>
				</form>

				{error && <p className="text-red-500 mt-3">{error}</p>}
				{success && <p className="text-green-500 mt-3">{success}</p>}

				<p className="mt-6 text-center text-sm">
					{mode === "login"
						? "Don't have an account?"
						: "Already have an account?"}{" "}
					<button
						className="text-blue-500 underline"
						onClick={() => {
							setMode(mode === "login" ? "signup" : "login");
							setError(null);
							setSuccess(null);
						}}
					>
						{mode === "login" ? "Sign Up" : "Login"}
					</button>
				</p>
			</div>
		</div>
	);
};

export default AuthPage;
