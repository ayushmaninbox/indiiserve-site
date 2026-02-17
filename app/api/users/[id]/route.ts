import { NextRequest, NextResponse } from "next/server";
import { updateUser, deleteUser, hashPassword, findUserById, validatePassword } from "@/lib/userUtils";

type Params = { params: Promise<{ id: string }> };

// PUT update user
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await request.json();
        
        let updates = { ...data };
        
        // If password is being updated, verify current password first
        if (updates.password) {
            if (updates.currentPassword) {
                const user = findUserById(id);
                if (!user) {
                    return NextResponse.json({ error: "User not found" }, { status: 404 });
                }
                const isValid = await validatePassword(updates.currentPassword, user.passwordHash);
                if (!isValid) {
                    return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
                }
            }
            updates.passwordHash = await hashPassword(updates.password);
            delete updates.password;
            delete updates.currentPassword;
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
