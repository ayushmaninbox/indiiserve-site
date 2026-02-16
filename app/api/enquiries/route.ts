import { NextRequest, NextResponse } from "next/server";
import { readEnquiries, writeEnquiries } from "@/lib/enquiryUtils";

// GET all enquiries
export async function GET() {
    const enquiries = readEnquiries();
    return NextResponse.json(enquiries);
}

// POST create new enquiry
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const enquiries = readEnquiries();
        const newEnquiry = {
            id: Date.now().toString(),
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            company: data.company || "",
            message: data.message || "",
            status: "pending" as const,
            submittedAt: new Date().toISOString(),
        };

        enquiries.push(newEnquiry);
        writeEnquiries(enquiries);

        return NextResponse.json(newEnquiry, { status: 201 });
    } catch (error) {
        console.error("Enquiry submission error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
