import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, insertOne } from "@/lib/db";

export interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    status: "pending" | "solved";
    submittedAt: string;
}

// GET all enquiries
export async function GET() {
    const enquiries = readDb<Enquiry>("enquiries", []);
    return NextResponse.json(enquiries);
}

// POST create new enquiry
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const newEnquiry: Enquiry = {
            id: Date.now().toString(),
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            company: data.company || "",
            message: data.message || "",
            status: "pending",
            submittedAt: new Date().toISOString(),
        };

        insertOne("enquiries", newEnquiry);

        return NextResponse.json(newEnquiry, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
