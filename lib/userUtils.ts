import bcrypt from 'bcryptjs';
import { AdminUser, AdminRole } from './types';
import { readCsv, writeCsv } from './csvUtils';

const USERS_CSV_FILENAME = 'users.csv';

// Initialize users CSV with headers and default super admin
const initializeUsersFile = async () => {
  const users = readCsv<AdminUser>(USERS_CSV_FILENAME);
  if (users.length === 0) {
    // Create default super admin with hashed password
    const passwordHash = await bcrypt.hash('admin123', 10);
    const defaultAdmin: AdminUser = {
      id: crypto.randomUUID(),
      name: 'Super Admin',
      email: 'superadmin@indiiserve.com',
      passwordHash,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    };
    
    writeCsv(USERS_CSV_FILENAME, [defaultAdmin]);
  }
};

interface RawUserRow {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
  lastLogin?: string;
}

export const readUsers = (): AdminUser[] => {
  return readCsv<RawUserRow>(USERS_CSV_FILENAME).map(row => ({
    id: row.id,
    name: row.name || '',
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role,
    createdAt: row.createdAt,
    lastLogin: row.lastLogin || undefined,
  }));
};

export const writeUsers = (users: AdminUser[]): void => {
  writeCsv(USERS_CSV_FILENAME, users);
};

export const findUserByEmail = (email: string): AdminUser | undefined => {
  const users = readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string): AdminUser | undefined => {
  const users = readUsers();
  return users.find(u => String(u.id) === String(id));
};

export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const createUser = async (name: string, email: string, password: string, role: AdminRole): Promise<AdminUser> => {
  const users = readUsers();
  
  // Check if email already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('A user with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const newUser: AdminUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): AdminUser | null => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === id);

  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  writeUsers(users);
  return users[index];
};

export const updateLastLogin = (id: string): void => {
  updateUser(id, { lastLogin: new Date().toISOString() });
};

export const deleteUser = (id: string): boolean => {
  const users = readUsers();
  const filteredUsers = users.filter(u => u.id !== id);

  if (filteredUsers.length === users.length) return false;

  writeUsers(filteredUsers);
  return true;
};

export const changePassword = async (id: string, newPassword: string): Promise<boolean> => {
  const passwordHash = await hashPassword(newPassword);
  const result = updateUser(id, { passwordHash });
  return result !== null;
};

// Initialize on first import
initializeUsersFile();
