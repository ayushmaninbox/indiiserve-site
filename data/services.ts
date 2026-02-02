export interface ServiceDetail {
    id: string;
    number: string;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    benefits: string[];
    image: string;
}

export const servicesData: ServiceDetail[] = [
    {
        id: "digital-marketing",
        number: "01",
        title: "Digital Marketing Strategy",
        tagline: "Data-Driven Growth",
        description: "We craft comprehensive digital marketing strategies that align perfectly with your business goals. Our data-driven approach ensures every campaign delivers measurable results, from brand awareness to conversion optimization.",
        features: [
            "Market Research & Analysis",
            "Competitive Intelligence",
            "Campaign Planning & Execution",
            "Performance Optimization",
            "Marketing Automation",
            "Lead Generation Systems",
        ],
        benefits: [
            "Increase brand visibility by up to 300%",
            "Reduce customer acquisition costs",
            "Data-backed decision making",
            "Scalable growth strategies",
        ],
        image: "/images/medcare.jpg",
    },
    {
        id: "content-social",
        number: "02",
        title: "Content & Social Media",
        tagline: "Stories That Connect",
        description: "Create engaging content that resonates with your audience. From compelling narratives to viral campaigns, we build brand loyalty through authentic storytelling and strategic social media management.",
        features: [
            "Content Strategy & Planning",
            "Social Media Management",
            "Influencer Partnerships",
            "Community Building",
            "Video Production",
            "Brand Storytelling",
        ],
        benefits: [
            "Build authentic brand communities",
            "Increase engagement rates",
            "Create viral-worthy content",
            "Establish thought leadership",
        ],
        image: "/images/payswift.jpg",
    },
    {
        id: "analytics-growth",
        number: "03",
        title: "Analytics & Growth",
        tagline: "Insights That Matter",
        description: "Transform raw data into actionable insights. Our analytics solutions help you understand customer behavior, identify growth opportunities, and accelerate your business trajectory.",
        features: [
            "Advanced Data Analytics",
            "Conversion Rate Optimization",
            "A/B Testing & Experimentation",
            "ROI Tracking & Reporting",
            "Customer Journey Mapping",
            "Predictive Analytics",
        ],
        benefits: [
            "Make informed business decisions",
            "Identify hidden opportunities",
            "Optimize conversion funnels",
            "Track ROI across channels",
        ],
        image: "/images/techflowcommerce.jpg",
    },
    {
        id: "web-development",
        number: "04",
        title: "Web Development",
        tagline: "Experiences That Convert",
        description: "Build stunning, high-performance websites that captivate visitors and convert them into customers. Our development team creates scalable, secure, and blazingly fast web experiences.",
        features: [
            "Custom Website Development",
            "E-commerce Solutions",
            "Progressive Web Apps (PWA)",
            "CMS Integration",
            "API Development",
            "Performance Optimization",
        ],
        benefits: [
            "Lightning-fast load times",
            "Mobile-first responsive design",
            "SEO-optimized architecture",
            "Secure & scalable infrastructure",
        ],
        image: "/images/urbanarch.jpg",
    },
    {
        id: "ui-ux-design",
        number: "05",
        title: "UI/UX Design",
        tagline: "Design That Delights",
        description: "Create intuitive, beautiful interfaces that users love. Our design process combines aesthetics with functionality to deliver experiences that drive engagement and satisfaction.",
        features: [
            "User Research & Personas",
            "Wireframing & Prototyping",
            "Visual Design Systems",
            "Interaction Design",
            "Usability Testing",
            "Design Handoff & Support",
        ],
        benefits: [
            "Reduce user friction",
            "Increase user retention",
            "Create memorable experiences",
            "Consistent brand identity",
        ],
        image: "/images/medcare.jpg",
    },
    {
        id: "branding",
        number: "06",
        title: "Branding & Identity",
        tagline: "Brands That Stand Out",
        description: "Build a powerful brand identity that resonates with your audience. From logo design to comprehensive brand guidelines, we help you stand out in a crowded market.",
        features: [
            "Brand Strategy",
            "Logo & Visual Identity",
            "Brand Guidelines",
            "Packaging Design",
            "Brand Messaging",
            "Brand Activation",
        ],
        benefits: [
            "Differentiate from competitors",
            "Build brand recognition",
            "Create emotional connections",
            "Ensure brand consistency",
        ],
        image: "/images/payswift.jpg",
    },
];
