import { Project } from './types';
import { readCsv, writeCsv } from './csvUtils';

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
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    displayOrder: projects.length
  };
  projects.push(newProject);
  writeProjects(projects);
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

export const deleteProject = (id: string): boolean => {
  const projects = readProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;

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
