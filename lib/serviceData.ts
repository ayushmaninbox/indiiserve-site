import { ServiceDetail, DigitalBrandingService, AIService, AIUseCase, RecruitmentService } from './types';

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

export const digitalBrandingServices: DigitalBrandingService[] = [
    {
        id: "influencer-marketing",
        title: "Influencer Marketing",
        tagline: "True Influence, No Faked Hype",
        description: "We don’t chase reach. We build influence. Creators who fit. Stories that sound real. No forced hype. No fake excitement. Just recommendations that work.",
        features: ["Creator Search", "Partnership Management", "Story-led Campaigns", "Trust-first Strategy"],
        benefits: ["Authentic connection", "Credibility built in", "High audience trust"],
        icon: "influencer",
    },
    {
        id: "social-media-strategy",
        title: "Social Media Strategy & Promotion",
        tagline: "Consistent, Human Content",
        description: "We post when the story has something to say. Every reel, carousel, or caption has a role. No copy-paste calendars. No tone mood swings. Just consistent, human content people recognise.",
        features: ["Content Strategy", "Platform-specific Design", "Community Management", "Consistent Narrative"],
        benefits: ["Brand recognition", "Higher engagement", "Clear brand voice"],
        icon: "social",
    },
    {
        id: "seo-aeo",
        title: "SEO / AEO",
        tagline: "Answering, Not Just Ranking",
        description: "Ranking isn’t about writing anything. It’s about answering something. We create content people are actually searching for, clear, useful, and human. So when questions arise, your brand shows up calm and credible.",
        features: ["Search-intent Content", "Helpful Content Creation", "Technical SEO", "AI/Answer Optimization"],
        benefits: ["Authority building", "Sustainable traffic", "Credible presence"],
        icon: "search",
    },
    {
        id: "performance-marketing",
        title: "Performance Marketing",
        tagline: "Scroll-Stopping Stories",
        description: "“Boost the post” isn't a strategy. We tell stories that stop the scroll. High-intent ads. Creator-led campaigns. Credibility built in. Less noise. More relevance. Better results.",
        features: ["Scroll-stop Creatives", "High-intent Ad Targeting", "Data Analysis", "Campaign Optimization"],
        benefits: ["Higher ROI", "Better lead quality", "Efficient ad spend"],
        icon: "chart",
    },
    {
        id: "3d-visuals",
        title: "3D Visuals",
        tagline: "Impact, Not Just 'Pop'",
        description: "Depth, movement, realism, used only when the idea needs impact. Not for show. For attention.",
        features: ["3D Modeling", "Motion Graphics", "Product Visualization", "Immersive Visuals"],
        benefits: ["Higher attention span", "Premium feel", "Visual impact"],
        icon: "cube",
    },
    {
        id: "brand-illustration",
        title: "Brand Illustration",
        tagline: "Illustrations That Look Like You",
        description: "Templates erase personality. We design illustrations from your brand’s tone and story, so they don’t look borrowed. They look like you.",
        features: ["Custom Icons", "Brand Illustrations", "Unique Visual Language", "Style Guidelines"],
        benefits: ["Brand personality", "Visual consistency", "Stand-out design"],
        icon: "pen",
    },
    {
        id: "ai-videos",
        title: "AI Videos",
        tagline: "Human Taste, AI Speed",
        description: "AI speeds execution. Human taste leads. Smarter visuals. Zero soulless content.",
        features: ["AI Video Generation", "Creative Direction", "Rapid Execution", "Human Polish"],
        benefits: ["Fast turnaround", "Cost-effective", "Leading-edge tech"],
        icon: "sparkles",
    },
    {
        id: "product-photography",
        title: "Product Photography",
        tagline: "Creating Desire",
        description: "We shoot products to create desire, through detail, light, and context. People pause. Then they want it.",
        features: ["Detail Photography", "Lifestyle Integration", "Professional Lighting", "Desire-led Framing"],
        benefits: ["Higher conversion", "Premium perception", "Brand trust"],
        icon: "camera",
    },
    {
        id: "video-editing",
        title: "High-Quality Video Editing",
        tagline: "Editing for Thumbs",
        description: "We edit for people with thumbs. Strong openings. Sharp cuts. No filler. If it doesn’t earn attention, it’s gone.",
        features: ["Sharp Cuts", "Attention-grabbing Hook", "Premium Polish", "Fast Rhythms"],
        benefits: ["High retention", "Better engagement", "Premium brand feel"],
        icon: "video",
    },
    {
        id: "graphic-motion-design",
        title: "Graphic & Motion Design",
        tagline: "Building Recognition",
        description: "We design with one narrative voice, same tone, same rhythm, everywhere. No design-for-design’s-sake. Only visuals that build recognition.",
        features: ["Visual Hierarchy", "Consistent Tone", "Rhythmic Motion", "Narrative Lead"],
        benefits: ["Instant recognition", "Cohesive brand image", "Design efficiency"],
        icon: "design",
    },
];

export const voiceAgentUseCases: AIUseCase[] = [
    {
        id: "healthcare",
        industry: "Healthcare",
        icon: "healthcare",
        useCases: [
            {
                title: "Appointment Scheduling",
                description: "AI voice agents handle appointment bookings, rescheduling, and reminders 24/7, reducing no-shows by 40%.",
            },
            {
                title: "Patient Follow-ups",
                description: "Automated post-treatment check-in calls to ensure patient recovery and medication compliance.",
            },
            {
                title: "Insurance Verification",
                description: "Voice AI verifies insurance details and pre-authorization before appointments.",
            },
        ],
    },
    {
        id: "finance",
        industry: "Finance & Banking",
        icon: "finance",
        useCases: [
            {
                title: "Account Inquiries",
                description: "Customers can check balances, transaction history, and account status through natural voice conversations.",
            },
            {
                title: "Payment Reminders",
                description: "Automated calling for payment due dates, overdue reminders, and payment confirmations.",
            },
            {
                title: "Fraud Alerts",
                description: "Instant voice calls to verify suspicious transactions and protect customer accounts.",
            },
        ],
    },
    {
        id: "ecommerce",
        industry: "E-commerce",
        icon: "cart",
        useCases: [
            {
                title: "Order Status Updates",
                description: "Proactive voice calls about shipping updates, delivery schedules, and delays.",
            },
            {
                title: "Returns & Refunds",
                description: "Voice-guided return initiation and refund status updates.",
            },
            {
                title: "Abandoned Cart Recovery",
                description: "Personalized voice outreach to recover abandoned shopping carts.",
            },
        ],
    },
    {
        id: "real-estate",
        industry: "Real Estate",
        icon: "building",
        useCases: [
            {
                title: "Property Inquiry Handling",
                description: "AI agents qualify leads by gathering requirements and scheduling site visits.",
            },
            {
                title: "Viewing Confirmations",
                description: "Automated confirmation calls and reminders for property viewings.",
            },
            {
                title: "Lead Nurturing",
                description: "Regular follow-up calls to nurture leads through the buying journey.",
            },
        ],
    },
    {
        id: "hospitality",
        industry: "Hospitality",
        icon: "hotel",
        useCases: [
            {
                title: "Reservation Management",
                description: "Handle table/room bookings, modifications, and cancellations via voice.",
            },
            {
                title: "Guest Feedback Collection",
                description: "Post-stay calls to gather feedback and encourage reviews.",
            },
            {
                title: "Concierge Services",
                description: "AI concierge for local recommendations, taxi bookings, and special requests.",
            },
        ],
    },
];

export const whatsappChatbotUseCases: AIUseCase[] = [
    {
        id: "customer-support",
        industry: "Customer Support",
        icon: "chat",
        useCases: [
            {
                title: "24/7 Query Resolution",
                description: "Instant responses to common questions with intelligent escalation to human agents when needed.",
            },
            {
                title: "Ticket Management",
                description: "Create, track, and update support tickets directly through WhatsApp conversations.",
            },
            {
                title: "FAQ Automation",
                description: "Answer repetitive questions automatically, freeing your team for complex issues.",
            },
        ],
    },
    {
        id: "lead-generation",
        industry: "Lead Generation",
        icon: "target",
        useCases: [
            {
                title: "Click-to-WhatsApp Ads",
                description: "Capture leads from Meta ads directly into WhatsApp conversations.",
            },
            {
                title: "Lead Qualification",
                description: "Automated qualifying questions to identify high-intent prospects.",
            },
            {
                title: "Nurture Campaigns",
                description: "Drip message sequences to nurture leads toward conversion.",
            },
        ],
    },
    {
        id: "order-tracking",
        industry: "Order & Delivery",
        icon: "package",
        useCases: [
            {
                title: "Real-time Tracking",
                description: "Customers receive live order status updates directly in WhatsApp.",
            },
            {
                title: "Delivery Coordination",
                description: "Two-way communication for delivery scheduling and rescheduling.",
            },
            {
                title: "Payment Collection",
                description: "Send payment links and confirm COD orders through chat.",
            },
        ],
    },
    {
        id: "appointment-booking",
        industry: "Appointment Booking",
        icon: "calendar",
        useCases: [
            {
                title: "Self-Service Booking",
                description: "Customers book appointments by chatting with the bot, viewing available slots.",
            },
            {
                title: "Automated Reminders",
                description: "Send timely reminders to reduce no-shows and last-minute cancellations.",
            },
            {
                title: "Reschedule & Cancel",
                description: "Easy rescheduling and cancellation without calling your office.",
            },
        ],
    },
];

export const aiAutomationData = {
    voiceAgent: {
        id: "voice-agent-ai",
        title: "Voice Agent AI",
        tagline: "Human-like Conversations at Scale",
        description: "Deploy intelligent voice agents that handle inbound and outbound calls with natural conversation abilities. Our AI voice solutions understand context, handle objections, and deliver personalized experiences 24/7.",
        features: [
            "Natural Language Understanding",
            "Multi-language Support",
            "CRM Integration",
            "Call Recording & Analytics",
            "Custom Voice Personas",
            "Seamless Human Handoff",
        ],
    },
    whatsappChatbot: {
        id: "whatsapp-chatbot",
        title: "WhatsApp Chatbots",
        tagline: "Engage on the World's Favorite App",
        description: "Build powerful WhatsApp automation that handles customer inquiries, drives sales, and nurtures relationships. With 2B+ users, WhatsApp is where your customers already are.",
        features: [
            "WhatsApp Business API Integration",
            "Rich Media Messages",
            "Quick Replies & Buttons",
            "Catalogue Integration",
            "Payment Links",
            "Analytics Dashboard",
        ],
    },
};

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
