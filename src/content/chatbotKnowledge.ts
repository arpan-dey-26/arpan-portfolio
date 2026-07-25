// Canonical, single source of truth for the chatbot's knowledge base —
// api/chat.ts imports this directly (a plain TS string export, not a
// special Vite ?raw markdown import). That's a deliberate fix: Vite's
// import-suffix syntax is Vite-specific, and Vercel's serverless
// functions are bundled by Vercel's own tooling, separate from Vite's
// dev/build pipeline — there's no way to verify that suffix survives
// Vercel's bundler without a live deployment, so a plain string export
// (guaranteed to work with any standard bundler) replaces it.
//
// Compiled from src/data/*.ts, which is itself sourced from
// MASTER_PORTFOLIO_DATA.md and the uploaded certificates/documents — not
// duplicated code, just the same verified facts written as prose for a
// system prompt. Keep this in sync with src/data/* if either changes.
//
// IMPORTANT: React, Next.js, Tailwind CSS, Node.js, Express.js, MongoDB,
// PostgreSQL, and Docker are deliberately absent — Arpan asked for these
// removed everywhere on the site since he doesn't know them confidently
// (see data/skills.ts's header comment). The chatbot must not mention
// them either, including inside project stack descriptions.
export const chatbotKnowledge = `# About Arpan Dey

Arpan Dey is a Computer Science and Engineering student at Narula
Institute of Technology (affiliated with MAKAUT), pursuing his B.Tech
from July 2023 to July 2027. His current CGPA is 8.60/10 (through the
6th semester). He's based in Kolkata, West Bengal, India.

He's passionate about software engineering, Java development, AI-powered
applications, and full-stack web development — interested in building
scalable products that solve real-world problems using clean
architecture, modern development practices, and thoughtful user
experience.

## Academic achievements
- JEE Main 2023: 97th percentile
- JEE Advanced 2023: CRL Rank 5133

## Skills
- **Programming Languages**: Java, C, C++, Python, JavaScript
- **Web Fundamentals**: HTML, CSS
- **Databases**: MySQL
- **Developer Tools**: VS Code, IntelliJ IDEA, Postman, Figma
- **Cloud & DevOps**: Git, GitHub
- **AI & Modern Technologies**: Generative AI, Prompt Engineering, REST APIs
- **Core Computer Science**: Data Structures, Algorithms, OOP, DBMS, Operating Systems, Computer Networks

Java is his strongest-documented language — NPTEL-certified with 90% (Elite + Gold).

## Projects

### AyurHerb (completed)
Built for Smart India Hackathon 2024 (Problem Statement #1555), as part
of team ByteSphere. An interactive Ayurvedic medicinal plant platform
featuring AI-powered plant identification and disease detection, 3D
plant visualization, search and filtering, themed virtual tours,
bookmarking and notes, Hindi-language and audio accessibility, gamified
progress tracking, and a real-time chatbot. Delivered as a working
prototype. Technologies: JavaScript, Python, Three.js, Socket.io,
OpenCV, TensorFlow, Keras, Rasa.

### PrePit AI (ongoing — currently building)
An AI-powered career guidance platform providing personalized learning
paths, interview preparation, resume building, skill verification,
gamification, and AI mentorship. Built for Smart Bengal Hackathon 2025 by
a 4-person team (TechBuddies), with Arpan as team lead. About 80% of
planned features are built; testing and validation are next.
Technologies: Prisma ORM, JWT, TensorFlow, OpenCV, Gemini, VAPI AI,
Turborepo, AWS.

## Current research
Arpan is working on a research project: "Diagnosis of Marigold Plant
Diseases using a Hybrid CNN–SVM Model" — a hybrid CNN–SVM framework for
automatically diagnosing marigold leaf diseases from images, combining a
CNN's feature-learning ability with an SVM's classification strength.
Status: ongoing research. This is his final-year research project.

## Certificates
- NPTEL — Programming in Java — Elite + Gold tier (Jul–Oct 2025)
- NPTEL — Cloud Computing — Elite tier (Jan–Apr 2026)
- Android Application Development — Ardent Computech (Feb 2025)
- Generative AI — Ardent Computech (Feb 2026)
- Spoken English Certification — Wonder Coaching/NYCET (Dec 2023)

## Coding profiles
- GitHub: arpan-dey-26 (https://github.com/arpan-dey-26)
- LeetCode: arpan_dey12 — 25 problems solved (11 Easy, 12 Medium, 2 Hard)
- HackerRank: arpandey91222

## Journey highlights
- Hack-O-NiT 2025 — reached the Grand Finale (March 2025), team "Code Crusaders"
- Smart Bengal Hackathon 2025 — built PrePit AI, team "TechBuddies"

## Contact
- Email: ccmmnn2019@gmail.com
- Location: Kolkata, West Bengal, India
- LinkedIn: https://www.linkedin.com/in/arpan-dey26
- X (Twitter): https://x.com/ArpanDeydev
- The portfolio's Contact section has a form and direct email link

## What NOT to say
- Do not mention React, Next.js, Tailwind CSS, Node.js, Express.js,
  MongoDB, PostgreSQL, or Docker as skills Arpan has, or as part of any
  project's tech stack — he does not claim these.
- Do not state or guess his phone number in chat responses (it's shown
  directly in the Contact section for anyone who scrolls there, but
  isn't something the assistant should repeat/broadcast).
- Do not invent GitHub/live-demo URLs for projects that don't have one
  listed here.
- Do not invent metrics, grades, rankings, or details beyond what's
  written above.`;
