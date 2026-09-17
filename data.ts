
import { CMSData } from './types';

/**
 * HAJUN JUNG PORTFOLIO CONFIGURATION
 * Edit this file directly on GitHub to update your website content.
 * Upload your images (headshot.jpg, memory1.jpg, etc.) to the same directory.
 */
export const INITIAL_CMS_DATA: CMSData = {
  personalInfo: {
    name: "Haejun (Jun) Jung",
    nameKo: "정해준",
    role: "Ph.D. Candidate @ KAIST",
    email: "haejunjung@kaist.ac.kr",
    bio: "What if the majority is wrong? I often wonder how much of what we accept as fact is truly so, and what possibilities we overlook because of beliefs we never question. Many innovations began with entrepreneurs who saw promise in ideas others dismissed. My research explores how entrepreneurs come to perceive these opportunities, why they make contrarian choices despite widespread disagreement and uncertainty, and where those choices lead them.",
    headshot: "/my_picture.png",
    linkedin: "https://www.linkedin.com/in/haejun-jung-662430208/",
    github: "https://github.com/hajunj",
    cvUrl: "/Haejun_Jung_CV_260916.pdf"
  },

  research: [],

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
