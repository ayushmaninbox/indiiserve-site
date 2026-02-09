export interface AIUseCase {
    id: string;
    industry: string;
    icon: string;
    useCases: {
        title: string;
        description: string;
    }[];
}

export interface AIService {
    id: string;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    industries: AIUseCase[];
}

export const voiceAgentUseCases: AIUseCase[] = [
    {
        id: "healthcare",
        industry: "Healthcare",
        icon: "🏥",
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
        icon: "🏦",
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
        icon: "🛒",
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
        icon: "🏠",
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
        icon: "🏨",
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
        icon: "💬",
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
        icon: "🎯",
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
        icon: "📦",
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
        icon: "📅",
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
