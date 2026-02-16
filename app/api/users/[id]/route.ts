import { NextRequest, NextResponse } from "next/server";
import { updateUser, deleteUser, hashPassword } from "@/lib/userUtils";

type Params = { params: Promise<{ id: string }> };

// PUT update user
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await request.json();
        
        let updates = { ...data };
        
        // If password is being updated, hash it
        if (updates.password) {
            updates.passwordHash = await hashPassword(updates.password);
            delete updates.password;
        }

        const updated = updateUser(id, updates);

        if (!updated) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const { passwordHash, ...safeUser } = updated;
        return NextResponse.json(safeUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

// DELETE user
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const deleted = deleteUser(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete user:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
