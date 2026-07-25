import type { ResearchProject } from '@/types';

// Sourced from the uploaded IEEE draft, "Diagnosis of Marigold Plant
// Diseases using a Hybrid CNN-SVM Model" — confirmed by Arpan as his
// current final-year research project (the draft's author block simply
// isn't finalized yet, which is why his name doesn't appear in it).
//
// Per explicit instruction: no metrics, no dataset specifics, no
// framework/library names — none are actually stated in the paper's own
// (currently empty) Methodology section, so none are claimed here.
// `techniques` lists only the two methods the paper repeatedly and
// explicitly names as its actual approach (CNN, SVM) — not a fabricated
// tech stack. `workflow` mirrors the paper's own Section III subsections
// (A–D) plus Section IV, i.e. the project's own stated structure, not an
// invented plan.
export const currentResearch: ResearchProject = {
  title: 'Diagnosis of Marigold Plant Diseases using a Hybrid CNN–SVM Model',
  overview:
    'A hybrid CNN–SVM framework for automatically diagnosing marigold leaf diseases from images, combining a CNN\u2019s feature-learning ability with an SVM\u2019s classification strength. Final-year research project, currently in progress.',
  problemStatement:
    'Manual inspection of marigold leaves for disease is slow and can miss symptoms that are small, overlapping, or visually similar across different diseases. An automated system would make early detection faster and more consistent, helping reduce crop loss.',
  approach:
    'A Convolutional Neural Network extracts visual features directly from leaf images, and a Support Vector Machine classifies those features into disease categories — combining CNN\u2019s deep feature learning with SVM\u2019s strong decision-boundary classification.',
  status: 'Ongoing Research',
  techniques: ['Convolutional Neural Network (CNN)', 'Support Vector Machine (SVM)'],
  workflow: [
    { label: 'Dataset Collection' },
    { label: 'Data Preprocessing' },
    { label: 'Hybrid CNN–SVM Model Development' },
    { label: 'Training' },
    { label: 'Evaluation', isCurrent: true },
  ],
};
