import { MessageSquare, Phone, Code, Settings, Mail, Share2 } from 'lucide-react';

export interface Service {
  icon: any; // Using 'any' for Lucide icons
  title: string;
  description: string;
}

export const servicesData: Service[] = [
  {
    icon: MessageSquare,
    title: 'AI Chatbots',
    description: 'Instant AI-powered chatbots that handle customer inquiries, book appointments, qualify leads, and provide 24/7 support across websites and messaging platforms.'
  },
  {
    icon: Phone,
    title: 'AI Voice Agents',
    description: 'Intelligent voice assistants that manage phone calls, schedule appointments, take orders, and provide customer service through natural speech conversations.'
  },
  {
    icon: Code,
    title: 'Smart Development',
    description: 'AI-enhanced websites and applications that learn user behavior, personalize content, optimize performance, and adapt interfaces for maximum engagement and conversion.'
  },
  {
    icon: Mail,
    title: 'Email Marketing Automation',
    description: 'Intelligent email campaigns that segment audiences, trigger personalized messages based on behavior, recover abandoned carts, and nurture leads automatically.'
  },
  {
    icon: Share2,
    title: 'Social Media Management Automation',
    description: 'AI-powered social media tools that schedule content across platforms, monitor engagement, generate posts, analyze performance, and maintain consistent brand presence.'
  },
  {
    icon: Settings,
    title: 'AI-Driven Automations',
    description: 'Custom workflow automation solutions that streamline operations, process data intelligently, manage inventory, and eliminate repetitive tasks to boost productivity.'
  }
]; 