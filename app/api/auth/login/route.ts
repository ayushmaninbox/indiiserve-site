import { NextRequest, NextResponse } from "next/server";
import { readDb, updateById } from "@/lib/db";
import { AdminUser } from "@/data/users";
import { defaultUsers } from "@/data/users";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Get users from db (initialize with defaults if empty)
        let users = readDb<AdminUser>("users", defaultUsers);

        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Update last login
        updateById<AdminUser>("users", user.id, {
            lastLogin: new Date().toISOString(),
        });

        // Return user without password
        const { password: _, ...safeUser } = user;

        return NextResponse.json({ user: safeUser });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
