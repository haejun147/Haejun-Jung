
export interface ResearchProject {
  id: string;
  title: string;
  authors: string;
  journal: string;
  category: string;
  description: string;
  date: string;
  link?: string;
  status: 'publication' | 'working_paper' | 'under_review' | 'in_preparation';
}

export interface CVEntry {
  id: string;
  title: string;
  institution: string;
  period: string;
  description: string;
}

export interface MemoryPost {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  description: string;
}

export interface CMSData {
  personalInfo: {
    name: string;
    role: string;
    email: string;
    bio: string;
    headshot: string;
    linkedin: string;
    github: string;
    cvUrl: string;
  };
  research: ResearchProject[];
  cv: {
    education: CVEntry[];
    experience: CVEntry[];
  };
  memories: MemoryPost[];
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
