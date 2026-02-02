"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { rolePermissions, UserRole } from "@/data/users";

interface AuthGuardProps {
    children: React.ReactNode;
    requiredPermission?: string;
}

export default function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
            const userStr = localStorage.getItem("adminUser");

            if (!isAuthenticated || !userStr) {
                setIsAuthorized(false);
                router.push("/admin/login");
                return;
            }

            const user = JSON.parse(userStr);
            const permissions = rolePermissions[user.role as UserRole] || [];

            // Check if user has required permission
            if (requiredPermission && !permissions.includes(requiredPermission)) {
                // Redirect to first allowed page
                const firstAllowed = permissions[0];
                if (firstAllowed) {
                    router.push(`/admin/${firstAllowed}`);
                } else {
                    router.push("/admin/login");
                }
                setIsAuthorized(false);
                return;
            }

            setIsAuthorized(true);
        };

        checkAuth();
    }, [router, pathname, requiredPermission]);

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}

