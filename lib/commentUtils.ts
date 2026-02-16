import fs from 'fs';
import path from 'path';
import { BlogComment } from './types';

const COMMENTS_JSON_PATH = path.join(process.cwd(), 'data', 'comments.json');

export const readComments = (): Record<string, BlogComment[]> => {
  if (!fs.existsSync(COMMENTS_JSON_PATH)) return {};
  try {
    const data = fs.readFileSync(COMMENTS_JSON_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading comments.json:', error);
    return {};
  }
};

export const writeComments = (comments: Record<string, BlogComment[]>): void => {
  try {
    fs.writeFileSync(COMMENTS_JSON_PATH, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing comments.json:', error);
  }
};

export const getCommentsBySlug = (slug: string): BlogComment[] => {
  const allComments = readComments();
  return allComments[slug] || [];
};

export const addCommentToSlug = (slug: string, comment: Omit<BlogComment, 'id' | 'date'>): BlogComment => {
  const allComments = readComments();
  const newComment: BlogComment = {
    ...comment,
    id: Date.now().toString(),
    date: new Date().toISOString()
  };

  if (!allComments[slug]) {
    allComments[slug] = [];
  }
  allComments[slug].unshift(newComment);
  writeComments(allComments);
  return newComment;
};

export const deleteCommentBySlug = (slug: string, commentId: string): boolean => {
  const allComments = readComments();
  if (!allComments[slug]) return false;

  const initialCount = allComments[slug].length;
  allComments[slug] = allComments[slug].filter(c => c.id !== commentId);
  
  if (allComments[slug].length === initialCount) return false;
  
  writeComments(allComments);
  return true;
};
