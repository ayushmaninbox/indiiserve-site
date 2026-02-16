export type AdminRole = 'super_admin' | 'admin' | 'product_manager' | 'content_writer' | 'enquiry_handler';

export interface BlogComment {
  id: string;
  name: string;
  email?: string; // Optional for IndiiServe
  content: string;
  createdAt?: string; // Marble field
  date?: string; // IndiiServe field
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  image?: string; // IndiiServe alias
  author: string;
  likes: number;
  comments: BlogComment[];
  createdAt: string;
  updatedAt: string;
  date?: string; // IndiiServe field
  readTime?: string; // IndiiServe field
  category: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
  lastLogin?: string;
}

export interface Enquiry {
  id: string;
  name?: string; // IndiiServe field
  firstName?: string; // Marble field
  lastName?: string; // Marble field
  email: string;
  phone: string;
  company?: string; // IndiiServe field
  productCategory?: string; // Marble field
  productName?: string; // Marble field
  quantity?: number; // Marble field
  message?: string;
  createdAt?: string; // Marble field
  submittedAt?: string; // IndiiServe field
  status: 'pending' | 'solved';
}

export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    video?: string;
    tags: string[];
    createdAt: string;
    displayOrder?: number;
    gradient?: string; // IndiiServe field
    order?: number; // IndiiServe field
    imageScale?: string;
}

export interface ServiceDetail {
    id: string;
    number: string;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    benefits: string[];
    image: string;
}

export interface DigitalBrandingService {
    id: string;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    benefits: string[];
    icon: string;
}

export interface AIUseCase {
    id: string;
    industry: string;
    icon: string;
    useCases: {
        title: string;
        description: string;
    }[];
}

export interface AIService {
    id: string;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    industries: AIUseCase[];
}

export interface RecruitmentService {
    id: string;
    title: string;
    description: string;
    features: string[];
}
