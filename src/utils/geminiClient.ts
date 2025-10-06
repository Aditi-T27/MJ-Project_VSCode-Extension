import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
console.log("Using Gemini API Key:", apiKey ? "Provided" : "Not Provided");
console.log(apiKey);

export const ai = new GoogleGenerativeAI(apiKey);

export const geminiModel = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

console.log("Gemini Client initialized.");
