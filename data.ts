
import { CMSData } from './types';

/**
 * HAJUN JUNG PORTFOLIO CONFIGURATION
 * Edit this file directly on GitHub to update your website content.
 * Upload your images (headshot.jpg, memory1.jpg, etc.) to the same directory.
 */
export const INITIAL_CMS_DATA: CMSData = {
  personalInfo: {
    name: "Haejun Jung",
    nameKo: "정해준",
    role: "Ph.D. Candidate @ KAIST",
    email: "haejunjung@kaist.ac.kr",
    bio: "Hello! I'm Haejun (\uC815\uD574\uC900), a Ph.D. candidate at KAIST. My research examines why entrepreneurs make different decisions and how these differences shape their future behaviors. Guided by the philosophy of \"Learn to give,\" I hope to produce insights that meaningfully support both the entrepreneurial community and society more broadly. Thanks for visiting!",
    headshot: "/my_picture.jpeg",
    linkedin: "https://www.linkedin.com/in/haejun-jung-662430208/",
    github: "https://github.com/hajunj",
    cvUrl: "/CV_Haejun.pdf"
  },

  research: [
    {
      id: "p1",
      title: "Investigating the Relationship of High-Tech Entrepreneurship and Innovation Efficacy: The Moderating Role of Absorptive Capacity",
      authors: "Chung, D., Jung, H., Lee, Y.",
      journal: "Technovation",
      category: "Innovation",
      date: "2022",
      status: "publication",
      image: "/technovation.png",
      link: "#"
    },
    {
      id: "p2",
      title: "The Paradox of the Regulation: the Moderating Effect of the Regulatory Environment on the Relationship of Technological Entrepreneurship on Nation-level Innovation",
      authors: "Jung, H., Lee, C., Chung, D.",
      journal: "Innovation Studies",
      category: "Policy",
      date: "2019",
      status: "publication",
      image: "/innovation_studies_regulation.png",
      link: "#"
    },
    {
      id: "p3",
      title: "The Effect of Intellectual Property-Based Startups on Employment",
      authors: "Jung, H., Kim, Y., Chung, D.",
      journal: "Innovation Studies",
      category: "Economics",
      date: "2019",
      status: "publication",
      image: "/innovation_studies_patent.png",
      link: "#"
    },
    {
      id: "w1",
      title: "Unpacking the Entrepreneurial Process after Failure: The Role of Attribution and Behavioral Responses to Entrepreneurial Failure",
      authors: "Kim, D., Jung, H., Chatterji, A., Kim, W., Cho, S.",
      journal: "Strategic Entrepreneurship Journal (FT-50)",
      category: "Entrepreneurship",
      date: "2024",
      status: "2nd_r&r",
      link: "#"
    },
    {
      id: "w3",
      title: "Predicting Consumer Preferences for New Product Development Using Large Language Models",
      authors: "Jung, H., Lee, J., Lee, S., Chung, D.",
      category: "AI",
      date: "2025",
      status: "1st_r&r",
      link: "#"
    },
    {
      id: "w2",
      title: "Does Media Exposure Matter for Early-Stage Startup Financing? Evidence from Korean Startups",
      authors: "Jung, H., Kim, G., Hwang, J.",
      category: "Entrepreneurship",
      date: "2025",
      status: "under_review",
      link: "#"
    },
    {
      id: "w4",
      title: "Exploring the Potential and Limits of Large Language Models in Entrepreneurship Survey Research",
      authors: "Jung, H., Kim, W.",
      category: "LLM",
      date: "2025",
      status: "in_preparation",
      link: "#"
    }
  ],

  books: [
    {
      id: "b1",
      title: "된다! AI 챗봇만들기",
      publisher: "이지스퍼블리싱",
      date: "March 2026",
      description: "A practical guide to building AI chatbots.",
      image: "/book_updated.png",
      link: "https://www.yes24.com/product/goods/182958115",
      newsLink: "https://aimatters.co.kr/news-report/ai-news/39513/",
    }
  ],

  cv: {
    education: [
      {
        id: "e1",
        title: "Ph.D in Business and Technology Management",
        institution: "Korea Advanced Institute of Science and Technology(KAIST)",
        period: "2023 - Present",
      },
      {
        id: "e2",
        title: "M.S. in Business and Technology Management",
        institution: "Korea Advanced Institute of Science and Technology(KAIST)",
        period: "2020-2022",
        description: "Graduated with Honors"
      },
      {
        id: "e3",
        title: "B.S. in School of Global Entrepreneurship and ICT",
        institution: "Handong Global University (HGU)",
        period: "2014-2020",
        description: "Graduated with Honors"
      }
    ],
    experience: [
      {
        id: "ex1",
        title: "Visiting Student Researcher",
        institution: "Massachusetts Institute of Technology(MIT)",
        period: "2026 - present",
      },
      {
        id: "ex2",
        title: "Chief Strategy Officer (CSO)",
        institution: "Flat Music",
        period: "2024 - 2025",
        description: "Customer experience innovation research and scale-up strategy formulation."
      },
      {
        id: "ex3",
        title: "Research Assistant (RA)",
        institution: "Bluepoint Partners",
        period: "2022 - 2023",
        description: "Conducted meetings with entrepreneurs, deal sourcing, IR review, writing investment report, and pitching consulting."
      }
    ]
  },

  memories: [],

  theme: {
    primary: "#2DD4BF",
    secondary: "#0D9488",
    accent: "#5EEAD4"
  }
};
