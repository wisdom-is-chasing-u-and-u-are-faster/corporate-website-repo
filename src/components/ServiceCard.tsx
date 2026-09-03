import React from 'react';
import Link from 'next/link';
import { Cloud, Code, BarChart3, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceTrack } from '../lib/services-data';

const iconMap: Record<string, React.ReactNode> = {
  Cloud: <Cloud className="h-6 w-6 text-blue-600" />,
  Code: <Code className="h-6 w-6 text-indigo-600" />,
  BarChart3: <BarChart3 className="h-6 w-6 text-emerald-600" />,
  Bot: <Bot className="h-6 w-6 text-purple-600" />,
};

interface ServiceCardProps {
  service: ServiceTrack;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
      <div>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
          {iconMap[service.icon] || <Code className="h-6 w-6 text-blue-600" />}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{service.shortDescription}</p>

        <div className="space-y-2 mb-6">
          {service.benefits.slice(0, 3).map((benefit, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group"
        >
          <span>Explore Capabilities</span>
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
