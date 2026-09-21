import { Service } from "./services.model.js";

const services = [
  {
    slug: "web-development",
    title: "Web Development",
    category: "Development",
    icon: "Globe",
    shortDescription:
      "Build fast, scalable, and modern web applications tailored to your business needs.",
    description:
      "We design and develop high-performance web applications using modern technologies and scalable architecture. From business websites to complex platforms, we build secure and maintainable solutions that support long-term growth.",
    image: {
      url: "/images/services/web-development.jpg",
      alt: "Modern web development workspace",
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
    ],
    features: [
      {
        title: "Responsive Design",
        description:
          "Optimized experiences across desktop, tablet, and mobile devices.",
        icon: "MonitorSmartphone",
      },
      {
        title: "Scalable Architecture",
        description:
          "Clean architecture designed to support growing users and business requirements.",
        icon: "Layers3",
      },
      {
        title: "Performance Optimization",
        description:
          "Fast-loading and optimized applications for better user experience.",
        icon: "Gauge",
      },
    ],
    benefits: [
      {
        title: "Better User Experience",
        description:
          "Create intuitive and engaging digital experiences for your customers.",
        icon: "Smile",
      },
      {
        title: "Business Growth",
        description:
          "Build a reliable digital platform that can evolve with your business.",
        icon: "TrendingUp",
      },
    ],
    process: [
      {
        number: 1,
        title: "Discovery",
        description:
          "Understand your goals, requirements, users, and business challenges.",
      },
      {
        number: 2,
        title: "Planning",
        description:
          "Define the architecture, technology stack, features, and project roadmap.",
      },
      {
        number: 3,
        title: "Development",
        description:
          "Build the application using clean, scalable, and maintainable code.",
      },
      {
        number: 4,
        title: "Testing",
        description:
          "Validate functionality, performance, security, and responsiveness.",
      },
      {
        number: 5,
        title: "Launch",
        description:
          "Deploy the application and monitor its production performance.",
      },
    ],
    useCases: [
      "Business websites",
      "Corporate portals",
      "Customer portals",
      "Web applications",
      "Internal business systems",
    ],
    faqs: [
      {
        question: "How long does web development take?",
        answer:
          "Project duration depends on the scope, number of features, integrations, and design requirements.",
      },
      {
        question: "Can you develop a custom web application?",
        answer:
          "Yes. We build custom web applications based on specific business requirements and workflows.",
      },
    ],
    isPublished: true,
    sortOrder: 1,
  },

  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    category: "Development",
    icon: "Smartphone",
    shortDescription:
      "Create reliable and user-friendly mobile applications for iOS and Android.",
    description:
      "We develop modern mobile applications focused on performance, usability, security, and maintainability. Our solutions are designed to provide consistent experiences across mobile platforms.",
    image: {
      url: "/images/services/mobile-app-development.jpg",
      alt: "Mobile application development",
    },
    technologies: [
      "React Native",
      "Flutter",
      "TypeScript",
      "Node.js",
      "Firebase",
      "PostgreSQL",
    ],
    features: [
      {
        title: "Cross-Platform Apps",
        description:
          "Build applications that work efficiently across multiple mobile platforms.",
        icon: "Smartphone",
      },
      {
        title: "API Integration",
        description:
          "Connect mobile applications with secure and scalable backend services.",
        icon: "Plug",
      },
      {
        title: "Push Notifications",
        description:
          "Keep users engaged with reliable notification and messaging systems.",
        icon: "Bell",
      },
    ],
    benefits: [
      {
        title: "Wider Reach",
        description:
          "Deliver your product to customers across major mobile platforms.",
        icon: "Users",
      },
      {
        title: "Better Engagement",
        description:
          "Provide convenient mobile experiences that keep customers connected.",
        icon: "Heart",
      },
    ],
    process: [
      {
        number: 1,
        title: "Requirement Analysis",
        description:
          "Understand the product idea, target users, and required functionality.",
      },
      {
        number: 2,
        title: "UI/UX Design",
        description:
          "Create intuitive interfaces and user flows optimized for mobile devices.",
      },
      {
        number: 3,
        title: "Development",
        description:
          "Develop the application and integrate required backend services.",
      },
      {
        number: 4,
        title: "Testing",
        description:
          "Test functionality, compatibility, performance, and usability.",
      },
      {
        number: 5,
        title: "Deployment",
        description:
          "Prepare and publish the application for production use.",
      },
    ],
    useCases: [
      "Business apps",
      "E-commerce apps",
      "Customer apps",
      "Booking platforms",
      "Internal workforce apps",
    ],
    faqs: [
      {
        question: "Can you build both Android and iOS applications?",
        answer:
          "Yes. We can build cross-platform applications targeting both Android and iOS.",
      },
      {
        question: "Can the app connect with an existing backend?",
        answer:
          "Yes. Mobile applications can integrate with existing REST APIs or other backend services.",
      },
    ],
    isPublished: true,
    sortOrder: 2,
  },

  {
    slug: "saas-development",
    title: "SaaS Development",
    category: "Development",
    icon: "Cloud",
    shortDescription:
      "Build scalable SaaS platforms with secure architecture, subscriptions, and multi-tenant capabilities.",
    description:
      "We develop scalable SaaS platforms designed for recurring-revenue businesses. From multi-tenant architecture and authentication to subscription management and analytics, we build the foundation required for long-term SaaS growth.",
    image: {
      url: "/images/services/saas-development.jpg",
      alt: "SaaS application dashboard",
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Redis",
    ],
    features: [
      {
        title: "Multi-Tenant Architecture",
        description:
          "Design secure architectures that support multiple organizations from a shared platform.",
        icon: "Building2",
      },
      {
        title: "Subscription Management",
        description:
          "Manage plans, pricing, subscriptions, invoices, and payment workflows.",
        icon: "CreditCard",
      },
      {
        title: "Role-Based Access",
        description:
          "Control access to platform resources with flexible roles and permissions.",
        icon: "ShieldCheck",
      },
    ],
    benefits: [
      {
        title: "Scalable Business Model",
        description:
          "Create a technology foundation suitable for recurring-revenue products.",
        icon: "TrendingUp",
      },
      {
        title: "Centralized Management",
        description:
          "Manage customers, subscriptions, users, and business operations from one platform.",
        icon: "LayoutDashboard",
      },
    ],
    process: [
      {
        number: 1,
        title: "Product Discovery",
        description:
          "Understand the SaaS product model, target customers, and core workflows.",
      },
      {
        number: 2,
        title: "Architecture",
        description:
          "Design scalable application, database, authentication, and tenant architecture.",
      },
      {
        number: 3,
        title: "Development",
        description:
          "Build the platform modules and business functionality.",
      },
      {
        number: 4,
        title: "Integration",
        description:
          "Integrate payments, notifications, analytics, storage, and external services.",
      },
      {
        number: 5,
        title: "Launch & Scale",
        description:
          "Deploy the platform and prepare it for future users and feature growth.",
      },
    ],
    useCases: [
      "B2B SaaS platforms",
      "Business management software",
      "Subscription platforms",
      "Multi-tenant applications",
      "Internal SaaS tools",
    ],
    faqs: [
      {
        question: "Can you build a multi-tenant SaaS platform?",
        answer:
          "Yes. We can design and develop SaaS platforms with tenant isolation, role-based access, subscriptions, and scalable architecture.",
      },
      {
        question: "Can you integrate subscription payments?",
        answer:
          "Yes. Subscription, billing, invoice, and payment workflows can be integrated according to the product requirements.",
      },
    ],
    isPublished: true,
    sortOrder: 3,
  },
];

export const seedServices = async (): Promise<void> => {
  await Service.deleteMany({});

  await Service.insertMany(services);

  console.log(`${services.length} services seeded successfully`);
};