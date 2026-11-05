import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Flame, Waves, AlertOctagon, CheckCircle2, Droplets } from 'lucide-react';

export default function DashboardStats({ summary, highlights }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const total = summary?.total || 30;
  const extreme = summary?.extreme || 0;
  const high = summary?.high || 0;
  const moderate = summary?.moderate || 0;
  const safe = summary?.low || 0;

  const getDistrictName = (nameObj) => {
    if (!nameObj) return '—';
    return nameObj[lang] || nameObj.en;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* 1. Total Monitored */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">{t('stats.monitoredDistricts')}</span>
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sindh Province</div>
        </div>
      </div>

      {/* 2. Extreme Emergency */}
      <div className={`rounded-xl p-4 border shadow-sm flex flex-col justify-between transition-all ${
        extreme > 0 ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className={`text-xs font-semibold ${extreme > 0 ? 'text-red-700' : ''}`}>
            {t('stats.extremeAlerts')}
          </span>
          <span className={`p-1.5 rounded-lg ${extreme > 0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
            <AlertOctagon className="w-4 h-4" />
          </span>
        </div>
        <div>
          <div className={`text-2xl font-bold ${extreme > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {extreme}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Immediate Action</div>
        </div>
      </div>

      {/* 3. High Risk */}
      <div className={`rounded-xl p-4 border shadow-sm flex flex-col justify-between transition-all ${
        high > 0 ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className={`text-xs font-semibold ${high > 0 ? 'text-amber-700' : ''}`}>
            {t('stats.highAlerts')}
          </span>
          <span className={`p-1.5 rounded-lg ${high > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
            <ShieldAlert className="w-4 h-4" />
          </span>
        </div>
        <div>
          <div className={`text-2xl font-bold ${high > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {high}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">High Vigilance</div>
        </div>
      </div>

      {/* 4. Peak Heat Stress */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">{t('stats.heatAlerts')}</span>
          <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
            <Flame className="w-4 h-4" />
          </span>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900">
            {highlights?.hottestDistrict ? `${highlights.hottestDistrict.temp}°C` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">
            {highlights?.hottestDistrict ? getDistrictName(highlights.hottestDistrict.name) : 'Normal Range'}
          </div>
        </div>
      </div>

      {/* 5. Peak Flood Indicator */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">{t('stats.floodAlerts')}</span>
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <Droplets className="w-4 h-4" />
          </span>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900">
            {highlights?.highestFloodRisk ? `${highlights.highestFloodRisk.precip24h.toFixed(1)} mm` : '0 mm'}
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">
            {highlights?.highestFloodRisk ? getDistrictName(highlights.highestFloodRisk.name) : 'No Inundation'}
          </div>
        </div>
      </div>

      {/* 6. Indus River Discharge */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">{t('stats.riverStatus')}</span>
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Waves className="w-4 h-4" />
          </span>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900">
            {highlights?.highestDischarge ? `${Math.round(highlights.highestDischarge.riverDischarge)} m³/s` : 'Safe'}
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">
            {highlights?.highestDischarge ? getDistrictName(highlights.highestDischarge.name) : 'Indus Barrages'}
          </div>
        </div>
      </div>

    </div>
  );
}
