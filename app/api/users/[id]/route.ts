import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, updateById, deleteById } from "@/lib/db";
import { AdminUser, defaultUsers } from "@/data/users";

type Params = { params: Promise<{ id: string }> };

// PUT update user
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await request.json();

        const updated = updateById<AdminUser>("users", id, data);

        if (!updated) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const { password, ...safeUser } = updated;
        return NextResponse.json(safeUser);
    } catch (error) {
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

        const deleted = deleteById<AdminUser>("users", id);

        if (!deleted) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
