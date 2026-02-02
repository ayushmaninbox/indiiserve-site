import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, insertOne, deleteById } from "@/lib/db";
import { AdminUser, defaultUsers } from "@/data/users";

// GET all users
export async function GET() {
    const users = readDb<AdminUser>("users", defaultUsers);
    // Return users without passwords
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return NextResponse.json(safeUsers);
}

// POST create new user
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const users = readDb<AdminUser>("users", defaultUsers);

        // Check if email exists
        if (users.find((u) => u.email === data.email)) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        const newUser: AdminUser = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role || "admin",
            createdAt: new Date().toISOString(),
            lastLogin: null,
        };

        insertOne("users", newUser);

        const { password, ...safeUser } = newUser;
        return NextResponse.json(safeUser, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
