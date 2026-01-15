
import { CMSData } from './types';

/**
 * HAJUN JUNG PORTFOLIO CONFIGURATION
 * Edit this file directly on GitHub to update your website content.
 * Images can be Unsplash URLs, hosted links, or base64 strings.
 */
export const INITIAL_CMS_DATA: CMSData = {
  personalInfo: {
    name: "Hajun Jung",
    email: "hajun.jung@kaist.ac.kr",
    // EDIT BIO HERE
    bio: "Hello! I'm Haejun, a Ph.D. candidate at KAIST. My research examines why entrepreneurs make different decisions and how these differences shape their future behaviors. Guided by the philosophy of “Learn to give,” I hope to produce insights that meaningfully support both the entrepreneurial community and society more broadly. Thanks for stopping by! 😄",
    // HEADSHOT IMAGE URL
    headshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    linkedin: "https://linkedin.com/in/hajun-jung",
    github: "https://github.com/hajunj",
    cvUrl: "#" // Link to your hosted PDF CV
  },

  // RESEARCH PAPERS & PROJECTS
  research: [
    {
      id: "1",
      title: "Neural Architectures for Cognitive Modeling",
      authors: "Hajun Jung, Sarah Smith, John Doe",
      journal: "Nature Machine Intelligence",
      category: "AI",
      description: "Exploring the intersection of deep learning and cognitive psychology.",
      date: "2023",
      status: "publication",
      link: "#"
    },
    {
      id: "2",
      title: "Interactive Visualization for High-Dimensional Data",
      authors: "Hajun Jung, Mike Ross",
      journal: "IEEE Transactions on Visualization and Computer Graphics",
      category: "Data Science",
      description: "A novel framework for visualizing multi-modal datasets.",
      date: "2022",
      status: "publication",
      link: "#"
    },
    {
      id: "3",
      title: "Ethics in Autonomous Systems",
      authors: "Hajun Jung",
      journal: "Working Paper",
      category: "Ethics",
      description: "A comprehensive study on user trust.",
      date: "2024",
      status: "under_review",
      link: "#"
    }
  ],

  // CURRICULUM VITAE
  cv: {
    education: [
      {
        id: "e1",
        title: "Ph.D. in Computer Science",
        institution: "Stanford University",
        period: "2018 - 2022",
        description: "Thesis on Multi-modal Transformer Architectures."
      }
    ],
    experience: [
      {
        id: "ex1",
        title: "Postdoctoral Fellow",
        institution: "MIT Media Lab",
        period: "2022 - Present",
        description: "Conducting research on assistive technologies."
      }
    ]
  },

  // GALLERY / MEMORIES
  memories: [
    {
      id: "m1",
      title: "Conference at Vancouver",
      date: "August 2023",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      description: "Presenting our latest work on neural dynamics at the ICML conference."
    }
  ],

  // THEME COLORS (Optional styling override)
  theme: {
    primary: "#10B981", // Emerald 500
    secondary: "#059669",
    accent: "#34D399"
  }
};
