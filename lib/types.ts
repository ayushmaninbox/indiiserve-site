export type AdminRole = 'super_admin' | 'admin' | 'product_manager' | 'content_writer' | 'enquiry_handler';

export interface BlogComment {
  id: string;
  name: string;
  email?: string; // Optional for InDiiServe.ai
  content: string;
  createdAt?: string; // Marble field
  date?: string; // InDiiServe.ai field
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  image?: string; // InDiiServe.ai alias
  author: string;
  likes: number;
  comments: BlogComment[];
  createdAt: string;
  updatedAt: string;
  date?: string; // InDiiServe.ai field
  readTime?: string; // InDiiServe.ai field
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
  name?: string; // InDiiServe.ai field
  firstName?: string; // Marble field
  lastName?: string; // Marble field
  email: string;
  phone: string;
  company?: string; // InDiiServe.ai field
  productCategory?: string; // Marble field
  productName?: string; // Marble field
  quantity?: number; // Marble field
  message?: string;
  createdAt?: string; // Marble field
  submittedAt?: string; // InDiiServe.ai field
  status: 'pending' | 'solved';
}

export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    credits: string;
    media: string;
    type: 'video' | 'image';
    preview: string;
    tags: string[];
    createdAt: string;
    displayOrder?: number;
    gradient?: string; // InDiiServe.ai field
    order?: number; // InDiiServe.ai field
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

export interface BPMService {
    tagline: string;
    title: string;
    description: string;
    mainFeatures: string[];
    services: {
        id: string;
        title: string;
        description: string;
        features: string[];
    }[];
    industries: string[];
    stats: {
        value: string;
        label: string;
    }[];
}
