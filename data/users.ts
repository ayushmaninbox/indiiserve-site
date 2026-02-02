export type UserRole = "super_admin" | "admin" | "content_writer" | "enquiry_handler";

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: string;
    lastLogin: string | null;
}

// Default admin users for testing
export const defaultUsers: AdminUser[] = [
    {
        id: "1",
        name: "Super Admin",
        email: "superadmin@indiiserve.com",
        password: "admin123",
        role: "super_admin",
        createdAt: "2026-01-01T00:00:00Z",
        lastLogin: null,
    },
    {
        id: "2",
        name: "Admin User",
        email: "admin@indiiserve.com",
        password: "admin123",
        role: "admin",
        createdAt: "2026-01-01T00:00:00Z",
        lastLogin: null,
    },
    {
        id: "3",
        name: "Content Writer",
        email: "writer@indiiserve.com",
        password: "writer123",
        role: "content_writer",
        createdAt: "2026-01-01T00:00:00Z",
        lastLogin: null,
    },
    {
        id: "4",
        name: "Enquiry Handler",
        email: "enquiry@indiiserve.com",
        password: "enquiry123",
        role: "enquiry_handler",
        createdAt: "2026-01-01T00:00:00Z",
        lastLogin: null,
    },
];

// Role permissions
export const rolePermissions: Record<UserRole, string[]> = {
    super_admin: ["dashboard", "portfolio", "enquiries", "blogs", "users"],
    admin: ["dashboard", "portfolio", "enquiries", "blogs"],
    content_writer: ["blogs"],
    enquiry_handler: ["enquiries"],
};

export const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    content_writer: "Content Writer",
    enquiry_handler: "Enquiry Handler",
};

export const roleColors: Record<UserRole, string> = {
    super_admin: "bg-purple-500/20 text-purple-400",
    admin: "bg-blue-500/20 text-blue-400",
    content_writer: "bg-green-500/20 text-green-400",
    enquiry_handler: "bg-orange-500/20 text-orange-400",
};
