export interface RecruitmentService {
    id: string;
    title: string;
    description: string;
    features: string[];
}

export const recruitmentData = {
    tagline: "Find the Right Talent",
    title: "Recruitment Solutions",
    description: "End-to-end recruitment services that help you find, attract, and hire the best talent for your organization. We combine traditional recruiting expertise with modern technology to deliver faster, better hiring outcomes.",
    mainFeatures: [
        "Reduced time-to-hire by 50%",
        "Access to pre-vetted talent pool",
        "Industry-specific expertise",
        "End-to-end hiring support",
    ],
    services: [
        {
            id: "permanent-staffing",
            title: "Permanent Staffing",
            description: "Find full-time employees who align with your company culture and long-term goals.",
            features: [
                "Job Requirement Analysis",
                "Candidate Sourcing & Screening",
                "Interview Coordination",
                "Background Verification",
                "Offer Management",
                "Onboarding Support",
            ],
        },
        {
            id: "contract-staffing",
            title: "Contract Staffing",
            description: "Flexible workforce solutions for project-based or temporary requirements.",
            features: [
                "Rapid Talent Deployment",
                "Payroll Management",
                "Compliance Handling",
                "Contract Extensions",
                "Performance Monitoring",
                "Seamless Transitions",
            ],
        },
        {
            id: "executive-search",
            title: "Executive Search",
            description: "Specialized recruitment for C-suite and senior leadership positions.",
            features: [
                "Discreet Search Process",
                "Leadership Assessment",
                "Market Mapping",
                "Compensation Benchmarking",
                "Succession Planning Support",
                "Retained Search Services",
            ],
        },
        {
            id: "bulk-hiring",
            title: "Bulk Hiring",
            description: "Large-scale recruitment for rapid expansion, new projects, or seasonal needs.",
            features: [
                "Volume Recruitment Campaigns",
                "Campus Hiring",
                "Walk-in Drive Management",
                "Mass Onboarding",
                "Training Coordination",
                "Attrition Replacement",
            ],
        },
    ],
    industries: [
        "Information Technology",
        "E-commerce & Retail",
        "Healthcare & Pharma",
        "Banking & Finance",
        "Manufacturing",
        "Hospitality",
        "Education",
        "Logistics & Supply Chain",
    ],
    stats: [
        { value: "500+", label: "Clients Served" },
        { value: "10K+", label: "Placements Made" },
        { value: "95%", label: "Client Retention" },
        { value: "48hrs", label: "Avg. Profile Delivery" },
    ],
};
