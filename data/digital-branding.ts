export interface DigitalBrandingService {
    id: string;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    benefits: string[];
    icon: string;
}

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
