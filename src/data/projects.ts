import type { Project } from '@/types';
import ayurherbHero from '@/assets/images/ayurherb-hero.webp';

// Sourced from the uploaded Smart India Hackathon 2024 submission
// (Problem Statement ID 1555, "Create a Virtual Herbal Garden...",
// team ByteSphere) and its accompanying idea description/synopsis/
// abstract document. problem/approach/outcome are paraphrased summaries
// of that material, not invented — trimmed for a scannable project card
// rather than reproducing the full multi-page proposal. liveUrl/githubUrl
// are still TODO: the source material confirms both exist but doesn't
// state the actual URLs anywhere.
//
// Note the image import above, rather than a raw "/src/assets/..." string:
// files under src/assets/ must be imported as ES modules for Vite to
// process and serve them correctly in a production build — a plain string
// path would 404 once built. (Files that genuinely need a raw string path
// — like the certificate PDFs above — belong in public/ instead, which is
// exactly where those live.)
//
// Stack list and the `outcome` prose: Next.js, Node.js, Express.js, and
// PostgreSQL were removed on Arpan's explicit instruction — he doesn't
// know them well enough to speak to them confidently in an interview,
// regardless of whether the actual team project used them.
export const projects: Project[] = [
  {
    slug: 'ayurherb',
    title: 'AyurHerb',
    description:
      'Interactive Ayurvedic medicinal plant platform featuring AI-powered plant identification, 3D visualization, educational resources, search, bookmarks, multilingual support, and chatbot.',
    problem:
      'Knowledge of Ayurvedic medicinal plants is scattered across sources that are either too specialized or too shallow, with little interactivity, no regional-language support, and no way to apply the knowledge practically (e.g. identifying a plant from a photo).',
    approach:
      'Built as a Smart India Hackathon 2024 submission (Problem Statement #1555, MedTech/BioTech/HealthTech) — a centralized web portal combining interactive 3D plant models, search and filtering, themed virtual tours, AI-powered plant identification and disease detection, bookmarking and notes, Hindi-language and audio accessibility, gamified progress tracking, and a real-time chatbot.',
    outcome:
      'Delivered as a working prototype (Three.js for the 3D viewer, Socket.io for real-time features, with OpenCV/TensorFlow/Keras/Rasa powering the AI features) — see the screenshots for the plant-detail 3D viewer, notes, and bookmarking in action.',
    features: [
      '3D interactive plant models',
      'AI-powered plant identification & disease detection',
      'Search, filter & bookmark plants',
      'Themed virtual tours',
      'Hindi language & audio accessibility',
      'Gamified learning progress',
      'Real-time chatbot',
    ],
    stack: ['JavaScript', 'Python', 'Three.js', 'Socket.io', 'OpenCV', 'TensorFlow', 'Keras', 'Rasa'],
    image: {
      src: ayurherbHero,
      alt: 'AyurHerb landing page — "Step Into Nature\'s Pharmacy: Your Virtual Herbal Haven"',
    },
  },
];
