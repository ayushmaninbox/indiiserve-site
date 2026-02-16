import { NextRequest, NextResponse } from "next/server";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/enquiryUtils";

type Params = { params: Promise<{ id: string }> };

// PUT update enquiry status
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await request.json();
        const { status } = data;

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

        const updated = updateEnquiryStatus(id, status);

        if (!updated) {
            return NextResponse.json(
                { error: "Enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update enquiry:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

// DELETE enquiry
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const deleted = deleteEnquiry(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete enquiry:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
