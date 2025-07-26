import { BarChart2, FileText, Phone, TrendingUp, Calendar, GraduationCap, Home, Users, FileCheck, Palette, Target, Send, Star, ShoppingCart, Package } from 'lucide-react';

export const nichesData = [
  {
    name: 'Sales',
    features: [
      {
        name: 'CRM Data Automation',
        description: 'Automated contact management, follow-up scheduling, and sales activity tracking.',
        icon: BarChart2
      },
      {
        name: 'Proposal Generation',
        description: 'AI-powered custom quotes, contracts, and sales document creation.',
        icon: FileText
      },
      {
        name: 'Sales Call Analysis',
        description: 'Conversation insights, sentiment analysis, and performance coaching recommendations.',
        icon: Phone
      }
    ]
  },
  {
    name: 'Coaching',
    features: [
      {
        name: 'Client Progress Tracking',
        description: 'Automated goal monitoring, milestone tracking, and progress report generation.',
        icon: TrendingUp
      },
      {
        name: 'Session Scheduling & Reminders',
        description: 'Smart calendar management with automated booking and follow-up communications.',
        icon: Calendar
      },
      {
        name: 'Personalized Content Delivery',
        description: 'AI-curated learning materials and resources based on individual client needs.',
        icon: GraduationCap
      }
    ]
  },
  {
    name: 'Real Estate',
    features: [
      {
        name: 'Property Valuation AI',
        description: 'Automated market analysis and property pricing based on comparable sales data.',
        icon: Home
      },
      {
        name: 'Lead Management System',
        description: 'Automated buyer/seller qualification and nurturing workflows.',
        icon: Users
      },
      {
        name: 'Document Processing',
        description: 'Automated contract generation, compliance checking, and transaction management.',
        icon: FileCheck
      }
    ]
  },
  {
    name: 'Marketing',
    features: [
      {
        name: 'Content Generation',
        description: 'AI-created marketing copy, social media posts, and campaign materials.',
        icon: Palette
      },
      {
        name: 'Lead Scoring & Qualification',
        description: 'Automated prospect evaluation and sales pipeline management.',
        icon: Target
      },
      {
        name: 'Email Campaign Automation',
        description: 'Personalized email sequences based on customer behavior and preferences.',
        icon: Send
      }
    ]
  },
  {
    name: 'E-Commerce',
    features: [
      {
        name: 'Review & Rating Management',
        description: 'Automated review collection, sentiment analysis, and response generation for customer feedback.',
        icon: Star
      },
      {
        name: 'Abandoned Cart Recovery',
        description: 'Automated email and SMS sequences that re-engage customers who left items in their cart with personalized offers and reminders.',
        icon: ShoppingCart
      },
      {
        name: 'Inventory Management & Forecasting',
        description: 'Automated stock level monitoring, demand prediction, and supplier reordering to prevent stockouts and overstock situations.',
        icon: Package
      }
    ]
  }
]; 