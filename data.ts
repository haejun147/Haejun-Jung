
import { CMSData } from './types';

export const INITIAL_CMS_DATA: CMSData = {
  personalInfo: {
    name: "Hajun Jung",
    role: "Senior Computational Researcher",
    email: "hajun.jung@example.com",
    bio: "Passionate about pushing the boundaries of Human-Computer Interaction and Artificial Intelligence. Currently exploring how generative models can augment human creativity in scientific discovery.",
    headshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    linkedin: "https://linkedin.com/in/hajun-jung",
    github: "https://github.com/hajunj",
    cvUrl: ""
  },
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
  memories: [
    {
      id: "m1",
      title: "Conference at Vancouver",
      date: "August 2023",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      description: "Presenting our latest work on neural dynamics at the ICML conference."
    }
  ],
  theme: {
    primary: "#10B981",
    secondary: "#059669",
    accent: "#34D399"
  }
};
