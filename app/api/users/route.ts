import { NextRequest, NextResponse } from "next/server";
import { readUsers, createUser, findUserByEmail } from "@/lib/userUtils";

// GET all users
export async function GET() {
    const users = readUsers();
    // Return users without password hashes
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json(safeUsers);
}

// POST create new user
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { name, email, password, role } = data;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required" },
                { status: 400 }
            );
        }

        // Check if email exists
        if (findUserByEmail(email)) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        const newUser = await createUser(name, email, password, role || "admin");

        const { passwordHash, ...safeUser } = newUser;
        return NextResponse.json(safeUser, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create user:", error);
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}
