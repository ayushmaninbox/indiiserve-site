import { Project } from './types';
import { readCsv, writeCsv } from './csvUtils';
import path from 'path';

const PORTFOLIO_CSV_FILENAME = 'portfolio.csv';

export const readProjects = (): Project[] => {
  return readCsv<any>(PORTFOLIO_CSV_FILENAME).map(row => ({
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
  })) as Project[];
};

export const writeProjects = (projects: Project[]): void => {
  const csvData = projects.map(p => ({
    ...p,
    tags: JSON.stringify(p.tags)
  }));
  writeCsv(PORTFOLIO_CSV_FILENAME, csvData);
};

export const addProject = (project: Omit<Project, 'id' | 'createdAt'>): Project => {
  const projects = readProjects();
  // Shift all existing projects down by 1 so the new one goes to the top
  const shifted: Project[] = projects.map(p => ({
    ...p,
    order: (p.order ?? 0) + 1,
    displayOrder: (p.displayOrder ?? 0) + 1,
  }));
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    order: 0,
    displayOrder: 0,
  };
  shifted.unshift(newProject);
  writeProjects(shifted);
  return newProject;
};

export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
  const projects = readProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;

  projects[index] = { ...projects[index], ...updates };
  writeProjects(projects);
  return projects[index];
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const projects = readProjects();
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) return false;

  const project = projects[projectIndex];
  
  // Delete associated files
  const filePaths = [project.media, project.preview].filter(Boolean);
  for (const relativePath of filePaths) {
    if (relativePath.startsWith('/uploads/portfolio/')) {
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      try {
        if (require('fs').existsSync(fullPath)) {
          await require('fs/promises').unlink(fullPath);
        }
      } catch (err) {
        console.error(`Failed to delete file: ${fullPath}`, err);
      }
    }
  }

  const filtered = projects.filter(p => p.id !== id);
  writeProjects(filtered);
  return true;
};

export const reorderProjects = (projectId: string, newIndex: number): boolean => {
  const projects = readProjects();
  const currentIndex = projects.findIndex(p => p.id === projectId);

  if (currentIndex === -1 || newIndex < 0 || newIndex >= projects.length) {
    return false;
  }

  const [movedProject] = projects.splice(currentIndex, 1);
  projects.splice(newIndex, 0, movedProject);

  projects.forEach((project, index) => {
    project.displayOrder = index;
  });

  writeProjects(projects);
  return true;
};
