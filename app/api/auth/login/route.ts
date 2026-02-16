import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, validatePassword, updateLastLogin } from "@/lib/userUtils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = findUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isValidPassword = await validatePassword(password, user.passwordHash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Update last login
        updateLastLogin(user.id);

        // Return user without password hash
        const { passwordHash: _, ...safeUser } = user;

        return NextResponse.json({ user: safeUser });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
