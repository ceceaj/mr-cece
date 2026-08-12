# Mr. Cece | Gamified English Learning App

A premium, interactive, and gamified EdTech application designed to make learning English vocabulary fun and highly effective. Built with a vibrant aesthetic, micro-animations, and AI integration to provide an engaging learning experience from beginner (A1) to advanced (C1) and specialized topics.

## 🚀 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (with Dark Mode support)
- **Animations:** Framer Motion
- **AI Integration:** Google Generative AI (Gemini API) & Web Speech API

## ✨ Key Features
- **Intelligent AI Voice Roleplay:** A conversational feature allowing users to practice speaking in real-life scenarios (e.g., Airport Check-in, Job Interviews). Powered by Gemini AI for contextual responses and grammar feedback, utilizing native browser STT (Speech-to-Text) and TTS (Text-to-Speech).
- **Gamification Engine:** Features a 3-star mastery system, daily quests, streak tracking, and an in-game currency (Gems) economy to boost user retention.
- **Dynamic Learning Path:** 50+ beautifully designed thematic levels covering standard CEFR (A1-C1) and specialized vocabulary (Business, Tech, Slang, Travel).
- **Smart Review (Spaced Repetition):** Automatically tracks vocabulary mistakes and generates targeted flashcards for efficient memorization.
- **Multiple Game Modes:** Standard normal mode, high-adrenaline "Speed Run", audio-only "Listening Mode", and hardcore "Typing Mode".
- **Premium UX/UI:** Fluid page transitions, haptic feedback on mobile, dynamic time-based hero banners, and combo particle animations.

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ceceaj/mr-cece.git
   cd mr-cece-edtech
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Google Gemini API Key to enable the AI Voice Roleplay feature:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   *(Note: The app will still run without the key using a smart mocked fallback).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Browser Compatibility
For the best experience with the **AI Voice Roleplay** microphone (Speech-to-Text) functionality, please use the latest version of **Google Chrome** (Desktop or Android) or **Safari**.
