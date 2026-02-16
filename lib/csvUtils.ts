import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

export const readCsv = <T>(filename: string): T[] => {
  ensureDataDirectory();
  const filePath = path.join(process.cwd(), 'data', filename);
  
  if (!fs.existsSync(filePath)) return [];

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    return parsed.data as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

export const writeCsv = <T>(filename: string, data: T[]): void => {
  ensureDataDirectory();
  const filePath = path.join(process.cwd(), 'data', filename);

  try {
    const csv = Papa.unparse(data, {
      header: true,
      quotes: true,
    });
    fs.writeFileSync(filePath, csv, 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};
