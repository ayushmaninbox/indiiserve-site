export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    gradient: string;
    image: string;
    imageScale?: string;
    tags: string[];
    order: number;
}

// Default projects
export const defaultProjects: Project[] = [
    {
        id: "1",
        title: "TechFlow Commerce",
        category: "E-Commerce",
        description: "300% increase in online sales through integrated digital strategy",
        gradient: "from-[#667eea] to-[#764ba2]",
        image: "/images/techflowcommerce.jpg",
        imageScale: "scale-110",
        tags: ["SEO", "PPC", "Social Media"],
        order: 1,
    },
    {
        id: "2",
        title: "MedCare Solutions",
        category: "Healthcare",
        description: "Patient acquisition increased by 250% with targeted campaigns",
        gradient: "from-[#f093fb] to-[#f5576c]",
        image: "/images/medcare.jpg",
        tags: ["Content Marketing", "Lead Gen"],
        order: 2,
    },
    {
        id: "3",
        title: "PaySwift Finance",
        category: "FinTech",
        description: "Brand awareness grew 400% in 6 months through strategic positioning",
        gradient: "from-[#4facfe] to-[#00f2fe]",
        image: "/images/payswift.jpg",
        tags: ["Branding", "PR", "Analytics"],
        order: 3,
    },
    {
        id: "4",
        title: "Urban Architecture",
        category: "Real Estate",
        description: "Sold out luxury condo units in 3 months via digital launch",
        gradient: "from-[#434343] to-[#000000]",
        image: "/images/urbanarch.jpg",
        tags: ["Social Ads", "Virtual Tours"],
        order: 4,
    },
    {
        id: "5",
        title: "GreenLeaf Organics",
        category: "Food & Beverage",
        description: "Built community of 50K+ engaged followers in 4 months",
        gradient: "from-[#11998e] to-[#38ef7d]",
        image: "/images/medcare.jpg",
        tags: ["Social Media", "Influencer Marketing"],
        order: 5,
    },
    {
        id: "6",
        title: "CloudSync Tech",
        category: "SaaS",
        description: "Reduced customer acquisition cost by 60% with funnel optimization",
        gradient: "from-[#6a11cb] to-[#2575fc]",
        image: "/images/payswift.jpg",
        tags: ["PPC", "Email Marketing", "CRO"],
        order: 6,
    },
];

export const categoryOptions = [
    "E-Commerce",
    "Healthcare",
    "FinTech",
    "Real Estate",
    "Food & Beverage",
    "SaaS",
    "Education",
    "Fashion",
    "Travel",
    "Other",
];

export const tagOptions = [
    "SEO",
    "PPC",
    "Social Media",
    "Content Marketing",
    "Lead Gen",
    "Branding",
    "PR",
    "Analytics",
    "Email Marketing",
    "CRO",
    "Influencer Marketing",
    "Social Ads",
    "Virtual Tours",
    "Video Marketing",
];
