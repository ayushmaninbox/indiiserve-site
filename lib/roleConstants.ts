import { AdminRole } from './types';

// Role permissions mapping to admin sections
export const rolePermissions: Record<AdminRole, string[]> = {
    super_admin: ["dashboard", "portfolio", "enquiries", "blogs", "users"],
    admin: ["dashboard", "portfolio", "enquiries", "blogs"],
    product_manager: ["dashboard", "portfolio"],
    content_writer: ["dashboard", "blogs"],
    enquiry_handler: ["dashboard", "enquiries"],
};

export const roleLabels: Record<AdminRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    product_manager: "Product Manager",
    content_writer: "Content Writer",
    enquiry_handler: "Enquiry Handler",
};

export const roleColors: Record<AdminRole, string> = {
    super_admin: "bg-purple-500/20 text-purple-400",
    admin: "bg-blue-500/20 text-blue-400",
    product_manager: "bg-emerald-500/20 text-emerald-400",
    content_writer: "bg-indigo-500/20 text-indigo-400",
    enquiry_handler: "bg-orange-500/20 text-orange-400",
};
