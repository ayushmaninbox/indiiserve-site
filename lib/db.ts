import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data", "db");

// Ensure db directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

type DbName = "users" | "enquiries" | "projects" | "comments" | "likes";

function getFilePath(name: DbName): string {
    return path.join(DB_DIR, `${name}.json`);
}

export function readDb<T>(name: DbName, defaultValue: T[] = []): T[] {
    const filePath = getFilePath(name);
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(data);
        }
        // Initialize with default if file doesn't exist
        writeDb(name, defaultValue);
        return defaultValue;
    } catch (error) {
        console.error(`Error reading ${name}.json:`, error);
        return defaultValue;
    }
}

export function writeDb<T>(name: DbName, data: T[]): boolean {
    const filePath = getFilePath(name);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
        return true;
    } catch (error) {
        console.error(`Error writing ${name}.json:`, error);
        return false;
    }
}

export function findById<T extends { id: string }>(name: DbName, id: string): T | null {
    const data = readDb<T>(name);
    return data.find((item) => item.id === id) || null;
}

export function updateById<T extends { id: string }>(name: DbName, id: string, updates: Partial<T>): T | null {
    const data = readDb<T>(name);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updates };
    writeDb(name, data);
    return data[index];
}

export function deleteById<T extends { id: string }>(name: DbName, id: string): boolean {
    const data = readDb<T>(name);
    const filtered = data.filter((item) => item.id !== id);
    if (filtered.length === data.length) return false;

    writeDb(name, filtered);
    return true;
}

export function insertOne<T>(name: DbName, item: T): T {
    const data = readDb<T>(name);
    data.push(item);
    writeDb(name, data);
    return item;
}
