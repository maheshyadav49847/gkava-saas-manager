import { create } from 'zustand';
import { apiClient } from '../../../lib/apiClient';

export interface WebsiteConfig {
  landing: {
    hero: { tagline: string; title: string; titleHighlight: string; subtitle: string; primaryCtaText: string; secondaryCtaText: string; };
    features: { title: string; subtitle: string; items: { id: string; title: string; desc: string; icon?: string; imageUrl?: string; }[]; };
    ecosystem: { tagline: string; title: string; subtitle: string; };
    engineering: { tagline: string; title: string; subtitle: string; };
    finalCta: { title: string; subtitle: string; buttonText: string; };
  };
  about: {
    hero: { tagline: string; title: string; titleHighlight: string; subtitle: string; };
    mission: { title: string; desc: string; };
    vision: { title: string; desc: string; };
    values: { title: string; items: { id: string; title: string; desc: string; icon?: string; imageUrl?: string; }[]; };
    cta: { title: string; subtitle: string; buttonText: string; };
  };
  products: {
    header: { tagline: string; title: string; titleHighlight: string; subtitle: string; };
    items: { id: string; title: string; desc: string; badge: string; isReady: boolean; icon?: string; imageUrl?: string; applicationId?: string; order?: number; features?: any[]; }[];
    customSolutions: { title: string; desc: string; buttonText: string; };
  };
  bookDemo: {
    hero: { title: string; subtitle: string; };
    faq: { question: string; answer: string; }[];
  };
  legal: {
    privacyPolicy: { title: string; lastUpdated: string; sections: { id: string; title: string; content: string; }[]; };
    termsOfService: { title: string; lastUpdated: string; sections: { id: string; title: string; content: string; }[]; };
  };
}

interface WebsiteConfigState {
  config: WebsiteConfig;
  isLoading: boolean;
  isSaving: boolean;
  updateConfig: (section: keyof WebsiteConfig, data: any) => void;
  updateNestedConfig: (section: keyof WebsiteConfig, subsection: string, data: any) => void;
  fetchConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
}

const defaultConfig: WebsiteConfig = {
  landing: {
    hero: {
      tagline: "Subscription Management Simplified",
      title: "Scale Your SaaS",
      titleHighlight: "Without Limits.",
      subtitle: "The all-in-one platform to manage tenants, subscriptions, billing, and access control. Built for modern B2B SaaS companies.",
      primaryCtaText: "Start Free Trial",
      secondaryCtaText: "Learn More",
    },
    features: {
      title: "Everything you need to grow",
      subtitle: "Enterprise-grade infrastructure designed for modern SaaS companies.",
      items: [
        { id: "1", title: "Tenant Isolation", desc: "Keep your customers' data logically separated and secure with built-in multi-tenancy." },
        { id: "2", title: "Automated Billing", desc: "Seamless Stripe integration for subscriptions, usage-based billing, and invoicing." },
        { id: "3", title: "Access Control", desc: "Fine-grained RBAC and customizable permissions for your users and teams." },
        { id: "4", title: "Developer First", desc: "Comprehensive APIs and webhooks to integrate easily into your existing stack." },
      ]
    },
    ecosystem: {
      tagline: "Our Ecosystem",
      title: "Purpose-built platforms.",
      subtitle: "Ready-to-deploy SaaS products engineered to solve complex operational challenges out of the box."
    },
    engineering: {
      tagline: "Custom Engineering",
      title: "Need something unique?",
      subtitle: "We don't just sell products. We partner with enterprises to architect, develop, and scale bespoke software solutions from the ground up."
    },
    finalCta: {
      title: "Ready to scale your business?",
      subtitle: "Get started today and see how our platform can transform your operations.",
      buttonText: "Let's Talk"
    }
  },
  products: {
    header: {
      tagline: "Product Catalog",
      title: "The Gkava",
      titleHighlight: "Ecosystem",
      subtitle: "A suite of foundational, highly scalable SaaS products designed to automate workflows and unify data across your entire organization."
    },
    items: [
      {
        id: "p1",
        title: "MyQCare",
        desc: "The ultimate clinic management and intelligent queueing system. Elevate patient satisfaction with deep WhatsApp integration, AI predictions, and automated billing.",
        badge: "Flagship",
        isReady: true
      },
      {
        id: "p2",
        title: "Gkava CRM",
        desc: "Advanced customer relationship management. Intelligent workflows, seamless API connections, and predictive insights to supercharge your sales team.",
        badge: "Coming Soon",
        isReady: false
      },
      {
        id: "p3",
        title: "Gkava Finance",
        desc: "Enterprise ledger and real-time financial tracking. Designed for scale, security, and global compliance across multiple jurisdictions.",
        badge: "In Development",
        isReady: false
      }
    ],
    customSolutions: {
      title: "Don't see what you need?",
      desc: "We engineer custom software systems tailored specifically for your unique operational requirements.",
      buttonText: "Book a Demo"
    }
  },
  about: {
    hero: {
      tagline: "Our Story",
      title: "Engineering the",
      titleHighlight: "Future of Business.",
      subtitle: "Gkava Software Solutions is on a mission to eliminate operational friction. We build foundational, highly scalable software infrastructure that powers the next generation of agile enterprises."
    },
    mission: {
      title: "Our Mission",
      desc: "To democratize enterprise-grade technology. We believe that every business, regardless of size, deserves access to intelligent, secure, and beautiful software that scales with their ambition."
    },
    vision: {
      title: "Our Vision",
      desc: "To become the default operating system for modern business management globally. From custom engineering to our flagship SaaS products, we are building the digital backbone of tomorrow's economy."
    },
    values: {
      title: "Our Core Values",
      items: [
        { id: "v1", title: "Performance First", desc: "Speed is a feature. We engineer systems that respond in milliseconds." },
        { id: "v2", title: "Uncompromising Security", desc: "Bank-grade encryption and privacy-by-design in everything we build." },
        { id: "v3", title: "Engineering Excellence", desc: "Clean code, robust architecture, and rigorous testing methodologies." },
        { id: "v4", title: "Client Partnership", desc: "We don't just write code; we partner in our clients' success." }
      ]
    },
    cta: {
      title: "Ready to build the future?",
      subtitle: "Whether you're looking for a bespoke software solution or want to implement our flagship products, our team is ready to help.",
      buttonText: "Get in Touch"
    }
  },
  bookDemo: {
    hero: {
      title: "Let's build something great",
      subtitle: "Fill out the form below and our team will get back to you within 24 hours to schedule a deep dive."
    },
    faq: [
      { question: "What happens after I submit this form?", answer: "Our team will review your requirements and reach out to schedule a 30-minute discovery call." },
      { question: "Do you offer custom integrations?", answer: "Yes, our enterprise plans include custom integration engineering for your existing stack." },
      { question: "How long does implementation take?", answer: "For our standard products like MyQCare, you can be up and running in 48 hours. Custom engineering projects vary based on scope." }
    ]
  },
  legal: {
    privacyPolicy: {
      title: "Privacy Policy",
      lastUpdated: "January 1, 2024",
      sections: [
        { id: "pp1", title: "Introduction", content: "This is the privacy policy content. It can be a long string of text detailing how user data is collected and used." }
      ]
    },
    termsOfService: {
      title: "Terms of Service",
      lastUpdated: "January 1, 2024",
      sections: [
        { id: "tos1", title: "General Terms", content: "This is the terms of service content. It details the rules and guidelines for using our services." }
      ]
    }
  }
};

export const useWebsiteConfigStore = create<WebsiteConfigState>((set) => ({
  config: defaultConfig,
  isLoading: false,
  isSaving: false,
  updateConfig: (section, data) => set((state) => ({
    config: {
      ...state.config,
      [section]: { ...state.config[section], ...data }
    }
  })),
  updateNestedConfig: (section, subsection, data) => set((state) => {
    const sectionData = state.config[section] as any;
    const isPrimitiveOrArray = Array.isArray(data) || typeof data !== 'object' || data === null;
    return {
      config: {
        ...state.config,
        [section]: {
          ...sectionData,
          [subsection]: isPrimitiveOrArray ? data : { ...sectionData[subsection], ...data }
        }
      }
    };
  }),
  fetchConfig: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get('/websiteconfig');
      
      let parsed = null;
      if (response) {
        if (typeof response === 'string') {
          try { parsed = JSON.parse(response); } catch (e) { console.error('Parse error string', e); }
        } else if ((response as any).jsonData) {
          try { parsed = JSON.parse((response as any).jsonData); } catch (e) { console.error('Parse error jsonData', e); }
        } else if (typeof response === 'object') {
          parsed = response;
        }
      }

      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        // Deep merge with defaultConfig to prevent undefined properties in case of partial saves
        const mergedConfig = JSON.parse(JSON.stringify(defaultConfig));
        
        // Simple top-level section merge (can be made deeper if needed)
        for (const key of Object.keys(parsed)) {
          if (mergedConfig[key] && typeof mergedConfig[key] === 'object') {
            mergedConfig[key] = { ...mergedConfig[key], ...parsed[key] };
          } else {
            mergedConfig[key] = parsed[key];
          }
        }
        
        set({ config: mergedConfig, isLoading: false });
      } else {
        // Fallback to default if empty or invalid
        set({ config: defaultConfig, isLoading: false });
      }
    } catch (error: any) {
      console.error('Failed to fetch config:', error);
      // Ensure we don't leave it in a broken state
      set({ config: defaultConfig, isLoading: false });
    }
  },
  saveConfig: async () => {
    try {
      set({ isSaving: true });
      const currentConfig = useWebsiteConfigStore.getState().config;
      await apiClient.post('/websiteconfig', { jsonData: JSON.stringify(currentConfig) });
      set({ isSaving: false });
    } catch (error) {
      console.error('Failed to save config:', error);
      set({ isSaving: false });
      throw error;
    }
  }
}));
