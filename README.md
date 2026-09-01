# 🚀 LVSTANTS — Software Engineering Portfolio & AI Showcase

<p align="center">
  <img src="https://raw.githubusercontent.com/lvstants03/lvstants-portfolio/main/public/images/avatar.jpg" alt="Ly Van My Logo" width="120" style="border-radius: 50%; border: 3px solid #eab308;" />
</p>

<p align="center">
  <strong>Personal Portfolio & Enterprise Engineering Showcase of Ly Van My (LVSTANTS)</strong><br />
  <em>Software Engineer • Aspiring Software Architect • Enterprise TOS & Fintech Specialist</em>
</p>

<p align="center">
  <a href="https://portfolio-lvstants.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-portfolio--lvstants.vercel.app-eab308?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="https://github.com/lvstants03/lvstants-portfolio"><img src="https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js 15" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" /></a>
</p>

---

## 🌟 Key Highlights & Breakthrough Features

### 1. 🎙️ Zero-Touch Gemini Voice AI Assistant
- **Continuous Hands-Free Conversation**: Integrated real-time Web Speech Recognition (`vi-VN` / `en-US`) powered by the **Google Gemini 2.0 Flash** serverless API.
- **Intent-Driven Screen Navigation**: Automatically detects visitor intents and executes smooth page navigation to `#projects`, `#experience`, `#skills`, `#introduce`, `#certificates`, or automatically triggers CV download.
- **Live Floating Subtitles**: Real-time transcribed feedback bubble with zero viewport obstruction.

### 2. 🖐️ AI Vision Hand Gesture Control (MediaPipe Hands)
- **Computer Vision in Browser**: 100% client-side WebAssembly landmark tracking with Google MediaPipe Hands (Zero data transmission for total user privacy).
- **Ergonomic Gesture Mapping**:
  - **1 Index Finger (☝️)**: Continuous smooth **Scroll Up** (-18px/frame).
  - **2 Fingers Peace Sign (✌️)**: Continuous smooth **Scroll Down** (+18px/frame) without wrist fatigue.
  - **Fist Gesture (✊)**: Instant **Emergency Brake** (`Velocity = 0`) locking position immediately.
- **Virtual Float Accumulator**: Subpixel hardware scrolling engine bypassing CSS animation bottlenecks to deliver a rock-solid **60 FPS** experience.

### 3. 🎵 Ambient Lo-Fi Sound Player
- **Embedded Audio Engine**: Seamless background lo-fi audio playback powered by YouTube IFrame API.
- **GPU-Accelerated Equalizer**: Real-time 3-bar rhythm visualizer optimized with `transform: scaleY()` for zero DOM reflow.

### 4. 🌐 100% Bilingual Internationalization (EN / VI)
- Comprehensive bilingual content covering all projects, work experience, responsibilities, and system metrics with instant client-side switching.

### 5. ⚡ High-Performance Architecture (60 FPS+)
- **GPU Acceleration**: Hardware-accelerated `translate3d` spotlight cursor lighting.
- **Passive ScrollSpy**: IntersectionObserver with `requestAnimationFrame` for lightning-fast section tracking.
- **Dark Minimalist Aesthetic**: Custom 6px gold-accented scrollbars, fluid Cormorant Garamond / Inter typography, and refined `max-w-5xl` layout.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Turbopack, Server Components) |
| **UI & Animation** | React 19, Framer Motion, Tailwind CSS, Vanilla SCSS |
| **Language** | TypeScript (Strict Type Safety) |
| **AI & Computer Vision** | Google Gemini 2.0 Flash API, MediaPipe Hands (WASM/WebGL) |
| **Speech Engine** | Web Speech API (SpeechRecognition & SpeechSynthesis) |
| **Internationalization** | i18next & react-i18next |
| **Icons & Media** | Lucide React, FontAwesome, YouTube Embedded API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.18.0` or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lvstants03/lvstants-portfolio.git
   cd lvstants-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to explore the portfolio.

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📂 Project Architecture

```
portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── github/route.ts      # Real-time GitHub repositories sync
│   │   │   └── voice-ai/route.ts    # Gemini Voice AI reasoning & navigation API
│   │   ├── globals.scss             # Custom slim scrollbars & design tokens
│   │   ├── layout.tsx               # Root layout & component hydration
│   │   └── page.tsx                 # Main single-page application entry
│   ├── components/
│   │   ├── AmbientSoundPlayer.tsx   # Lo-Fi background music with GPU equalizer
│   │   ├── HandGestureScroll.tsx    # MediaPipe camera vision gesture scroll
│   │   ├── VoiceAIAssistant.tsx     # Floating live voice AI assistant
│   │   ├── SpotlightEffect.tsx      # GPU-accelerated mouse spotlight
│   │   └── InteractiveCanvas.tsx    # Dynamic particle canvas system
│   ├── view/
│   │   ├── Header.tsx               # Centered navigation bar & language toggle
│   │   ├── HomeSection.tsx          # Dynamic word flipper & hero CTA
│   │   ├── AboutSection.tsx         # Engineering journey & architectural vision
│   │   ├── SkillsSection.tsx        # Interactive technical stack matrix
│   │   ├── ProjectsSections.tsx     # GitHub live projects with language filters
│   │   ├── ExperienceSection.tsx    # CEH Platform, GTOS TOS & SmartGate history
│   │   ├── CertificateSection.tsx   # Professional certifications
│   │   └── Footer.tsx               # LVSTANTS brand footer & social links
│   └── data/                        # Dynamic JSON data files
├── public/                          # Static assets (CV pdf, images, icons)
├── LICENSE                          # MIT License
└── README.md                        # Documentation
```

---

## 👨‍💻 Author

**Ly Van My (Lý Văn Mỹ)**  
*Software Engineer • CEH Platform • FPT University Graduate*

- **Website**: [portfolio-lvstants.vercel.app](https://portfolio-lvstants.vercel.app)
- **GitHub**: [@lvstants03](https://github.com/lvstants03)
- **LinkedIn**: [Ly Van My](https://www.linkedin.com/in/m%E1%BB%B9-l%C3%BD-v%C4%83n-1b5427242/)
- **Facebook**: [Myx2406](https://www.facebook.com/Myx2406/)
- **Email**: [lyvanmy357@gmail.com](mailto:lyvanmy357@gmail.com)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE) — © 2026 **Ly Van My (LVSTANTS)**.