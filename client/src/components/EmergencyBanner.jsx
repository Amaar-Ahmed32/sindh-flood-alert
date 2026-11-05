import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function EmergencyBanner() {
  const { t } = useTranslation();

  const contacts = [
    { label: 'PDMA Sindh 24/7', number: '1736', href: 'tel:1736', color: 'bg-red-600' },
    { label: 'Rescue 1122', number: '1122', href: 'tel:1122', color: 'bg-emerald-600' },
    { label: 'Edhi Helpline', number: '115', href: 'tel:115', color: 'bg-amber-600' },
    { label: 'Chhipa Emergency', number: '1020', href: 'tel:1020', color: 'bg-blue-600' }
  ];

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-400 font-semibold">
          <AlertTriangle className="w-4 h-4 animate-pulse flex-shrink-0" />
          <span>{t('emergency.bannerTitle')}:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {contacts.map((c, idx) => (
            <a
              key={idx}
              href={c.href}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-700/60"
            >
              <span className={`w-2 h-2 rounded-full ${c.color}`} />
              <span className="text-slate-300">{c.label}:</span>
              <strong className="text-white font-mono tracking-wider">{c.number}</strong>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
