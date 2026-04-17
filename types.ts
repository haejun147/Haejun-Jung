
export interface ResearchProject {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  category: string;
  description?: string;
  date: string;
  link?: string;
  image?: string;
  status: 'publication' | 'working_paper' | 'under_review' | 'in_preparation' | 'under_2nd review' | '1st_r&r' | '2nd_r&r';
}

export interface CVEntry {
  id: string;
  title: string;
  institution: string;
  period: string;
  description?: string;
}

export interface MemoryPost {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  published: boolean;
  content: string;
  image?: string;
}

export interface Book {
  id: string;
  title: string;
  publisher: string;
  date: string;
  description?: string;
  image?: string;
  link?: string;
  newsLink?: string;
}

export interface CMSData {
  personalInfo: {
    name: string;
    nameKo?: string;
    role: string;
    email: string;
    bio: string;
    headshot: string;
    linkedin: string;
    github: string;
    cvUrl: string;
  };
  research: ResearchProject[];
  books: Book[];
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
