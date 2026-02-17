import { Blog, BlogComment } from './types';
import { readCsv, writeCsv } from './csvUtils';

import { readComments } from './commentUtils';

const BLOGS_CSV_FILENAME = 'blogs.csv';

export const readBlogs = (): Blog[] => {
  const allComments = readComments();
  const blogs = readCsv<any>(BLOGS_CSV_FILENAME).map(row => ({
    ...row,
    comments: allComments[row.slug] || []
  })) as Blog[];
  
  // Sort blogs by date descending (newest first)
  return blogs.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });
};

export const writeBlogs = (blogs: Blog[]): void => {
  const csvData = blogs.map(({ comments, ...b }) => b);
  writeCsv(BLOGS_CSV_FILENAME, csvData);
};

export const addBlog = (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>): Blog => {
  const blogs = readBlogs();
  const newBlog: Blog = {
    ...blog,
    id: Date.now().toString(),
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  blogs.push(newBlog);
  writeBlogs(blogs);
  return newBlog;
};

export const updateBlog = (slug: string, updates: Partial<Blog>): Blog | null => {
  const blogs = readBlogs();
  const index = blogs.findIndex(b => b.slug === slug);
  if (index === -1) return null;

  blogs[index] = { ...blogs[index], ...updates, updatedAt: new Date().toISOString() };
  writeBlogs(blogs);
  return blogs[index];
};

export const deleteBlog = (slug: string): boolean => {
  const blogs = readBlogs();
  const filtered = blogs.filter(b => b.slug !== slug);
  if (filtered.length === blogs.length) return false;

  writeBlogs(filtered);
  return true;
};

// Comment management is moved to commentUtils.ts
