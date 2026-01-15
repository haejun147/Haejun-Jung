
import { CMSData } from './types';

/**
 * HAJUN JUNG PORTFOLIO CONFIGURATION
 * Edit this file directly on GitHub to update your website content.
 * Upload your images (headshot.jpg, memory1.jpg, etc.) to the same directory.
 */
export const INITIAL_CMS_DATA: CMSData = {
  personalInfo: {
    name: "Haejun Jung",
    role: "Ph.D. Candidate @ KAIST",
    email: "haejunjung@kaist.ac.kr",
    bio: "I'm Haejun, a Ph.D. candidate at KAIST. My research examines why entrepreneurs make different decisions and how these differences shape their future behaviors. Guided by the philosophy of “Learn to give,” I hope to produce insights that meaningfully support both the entrepreneurial community and society more broadly. Thanks for stopping by! 😄",
    // Changed to local relative path for GitHub upload
    headshot: "/Profile.png", 
    linkedin: "https://www.linkedin.com/in/haejun-jung-662430208/",
    github: "https://github.com/hajunj",
    cvUrl: "#" 
  },

  research: [
    {
      id: "p1",
      title: "Investigating the Relationship of High-Tech Entrepreneurship and Innovation Efficacy: The Moderating Role of Absorptive Capacity",
      authors: "Chung, D., Jung, H., Lee, Y.",
      journal: "Technovation",
      category: "Innovation",
      description: "",
      date: "2022",
      status: "publication",
      link: "#"
    },
    {
      id: "p2",
      title: "The Paradox of the Regulation: the Moderating Effect of the Regulatory Environment on the Relationship of Technological Entrepreneurship on Nation-level Innovation",
      authors: "Jung, H., Lee, C., Chung, D.",
      journal: "Innovation Studies",
      category: "Policy",
      description: "",
      date: "2019",
      status: "publication",
      link: "#"
    },
    {
      id: "p3",
      title: "The Effect of Intellectual Property-Based Startups on Employment",
      authors: "Jung, H., Kim, Y., Chung, D.",
      journal: "Innovation Studies",
      category: "Economics",
      description: "",
      date: "2019",
      status: "publication",
      link: "#"
    },
    {
      id: "w1",
      title: "Unpacking the Entrepreneurial Process after Failure: The Role of Attribution and Behavioral Responses to Entrepreneurial Failure",
      authors: "Kim, D., Jung, H., Chatterji, A., Kim, W., Cho, S.",
      journal: "1st Revision at Strategic Entrepreneurship Journal (FT 50)",
      category: "Entrepreneurship",
      description: "",
      date: "2024",
      status: "under_review",
      link: "#"
    },
    {
      id: "w2",
      title: "Exploring the Potential and Limits of Large Language Models in Entrepreneurship Survey Research",
      authors: "Jung, H., Kim, W.",
      journal: "Working Paper",
      category: "LLM",
      description: "",
      date: "2024",
      status: "working_paper",
      link: "#"
    },
    {
      id: "w3",
      title: "Predicting Consumer Preferences for New Product Development Using Large Language Models",
      authors: "Jung, H., Lee, J., Lee, S., Chung, D.",
      journal: "Under Review",
      category: "AI",
      description: "",
      date: "2024",
      status: "under_review",
      link: "#"
    },
    {
      id: "w4",
      title: "Unveiling the Development Pattern of Artificial Intelligence in Education",
      authors: "Jung, H., Baek, S.",
      journal: "Soon to be submitted",
      category: "AIEd",
      description: "",
      date: "2024",
      status: "in_preparation",
      link: "#"
    }
  ],

  cv: {
    education: [
      {
        id: "e1",
        title: "Ph.D in Business and Technology Management",
        institution: "KAIST",
        period: "March 2023 - Present",
        description: ""
      },
      {
        id: "e2",
        title: "M.S. in Business and Technology Management",
        institution: "KAIST",
        period: "August 2022",
        description: "Awarded High Honor."
      },
      {
        id: "e3",
        title: "B.S. in School of Global Entrepreneurship and ICT",
        institution: "Handong Global University (HGU)",
        period: "August 2020",
        description: "Awarded Cum Laude."
      }
    ],
    experience: [
      {
        id: "ex1",
        title: "Chief Strategy Officer (CSO)",
        institution: "Flat Music",
        period: "2024 - 2025",
        description: "Customer experience innovation research and scale-up strategy formulation."
      },
      {
        id: "ex2",
        title: "Research Assistant (RA)",
        institution: "Bluepoint Partners",
        period: "2022 - 2023",
        description: "Founder meetings, deal sourcing, business plan review, investment report, pitching consulting."
      }
    ]
  },

  memories: [
    {
      id: "m1",
      title: "Scientific Journey",
      date: "2024",
      // Changed to local relative path for GitHub upload
      imageUrl: "/Friends.png", 
      description: "Moments with Lovely Friends."
    }
  ],

  theme: {
    primary: "#2DD4BF",
    secondary: "#0D9488",
    accent: "#5EEAD4"
  }
};
