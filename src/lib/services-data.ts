export interface ServiceTrack {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  benefits: string[];
  capabilities: string[];
  caseStudy: {
    client: string;
    metrics: string;
    summary: string;
  };
}

export const SERVICE_TRACKS: ServiceTrack[] = [
  {
    slug: 'cloud-migration',
    title: 'Cloud Migration',
    shortDescription: 'Modernize enterprise infrastructure with seamless, zero-downtime multi-cloud transitions.',
    fullDescription: 'Our end-to-end cloud migration framework enables enterprise organizations to shift legacy monoliths to scalable, secure GCP, AWS, and Azure infrastructures with zero data loss and minimal operational disruption.',
    icon: 'Cloud',
    benefits: [
      'Up to 40% reduction in total infrastructure operational costs',
      'Automated disaster recovery with sub-15 minute RTO',
      'Continuous compliance and automated security guardrails',
      'Scalable Kubernetes orchestration and serverless execution'
    ],
    capabilities: [
      'Cloud Architecture & Readiness Assessment',
      'Database Migration (Relational to Spanner / Firestore)',
      'Legacy Modernization & Microservices Decoupling',
      'DevOps CI/CD Automation & Infrastructure as Code'
    ],
    caseStudy: {
      client: 'Global Fintech Leader',
      metrics: '99.99% Uptime & 35% Cost Optimization',
      summary: 'Migrated 120+ microservices to Google Cloud Run and Firestore with zero customer downtime.'
    }
  },
  {
    slug: 'app-development',
    title: 'App Development',
    shortDescription: 'High-performance web, mobile, and distributed enterprise applications engineered for speed.',
    fullDescription: 'Crafting responsive, secure, and intuitive digital applications using modern frontend architectures like Next.js and React alongside robust microservice backends.',
    icon: 'Code',
    benefits: [
      'Sub-second Largest Contentful Paint (LCP) performance',
      '100% WCAG 2.1 AA accessibility compliance',
      'Modular component libraries and design systems',
      'Cross-platform iOS and Android synchronization'
    ],
    capabilities: [
      'Full-Stack Next.js & React Web Applications',
      'React Native & Flutter Mobile Apps',
      'API Gateway & Microservices Engineering',
      'Enterprise CMS & Portal Integrations'
    ],
    caseStudy: {
      client: 'Healthcare Network',
      metrics: '2.5M Active Monthly Users',
      summary: 'Built patient engagement portal achieving Lighthouse score of 98 with AES-256 encrypted health data.'
    }
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics',
    shortDescription: 'Transform massive data streams into actionable intelligence with modern data platforms.',
    fullDescription: 'Architecting modern data lakes, BigQuery analytical engines, and real-time visualization dashboards to unlock predictive decision-making across global enterprises.',
    icon: 'BarChart3',
    benefits: [
      'Real-time streaming ingestion at petabyte scale',
      'Automated PII data masking and governance',
      'Interactive executive BI dashboards',
      'Reduced data pipeline latency by 75%'
    ],
    capabilities: [
      'Google BigQuery Data Warehousing',
      'Apache Kafka & Pub/Sub Real-Time Pipelines',
      'Business Intelligence (Looker & PowerBI)',
      'Data Governance & Compliance Automation'
    ],
    caseStudy: {
      client: 'Logistics Enterprise',
      metrics: 'Real-time telemetry across 50,000 assets',
      summary: 'Centralized telemetry data into unified data lake, reducing delivery anomalies by 28%.'
    }
  },
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    shortDescription: 'Enterprise GenAI models, predictive machine learning, and autonomous agent workflows.',
    fullDescription: 'Deploying secure, custom Large Language Models, computer vision, and cognitive automation agents that drive operational efficiency and customer engagement.',
    icon: 'Bot',
    benefits: [
      'Domain-adapted fine-tuned LLMs with RAG architecture',
      'Enterprise data isolation and least-privilege security',
      'Automated document extraction and synthesis',
      'Multimodal intelligence across text, images, and audio'
    ],
    capabilities: [
      'Enterprise Retrieval-Augmented Generation (RAG)',
      'Autonomous Agent Workflows & Tool Integration',
      'Predictive Analytics & Forecasting Models',
      'MLOps Pipelines & Model Lifecycle Monitoring'
    ],
    caseStudy: {
      client: 'Insurance Conglomerate',
      metrics: '85% automated claims triage',
      summary: 'Deployed cognitive assistant that processed claims in under 3 minutes with 99.2% accuracy.'
    }
  }
];

export function getServiceBySlug(slug: string): ServiceTrack | undefined {
  return SERVICE_TRACKS.find((s) => s.slug === slug);
}
