import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Waves, Wind, Droplets, Thermometer, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function DistrictCard({ district, onSelect }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const name = district.districtName?.[lang] || district.districtName?.en || district.districtId;
  const secondaryName = lang !== 'en' ? district.districtName?.en : (district.districtName?.ur || '');

  const overall = district.overallRisk || { score: 0, level: 'LOW', primaryHazard: 'NORMAL' };
  const heat = district.heatRisk || { score: 0, level: 'LOW' };
  const flood = district.floodRisk || { score: 0, level: 'LOW' };
  const weather = district.currentWeather || {};

  const getBadgeStyle = (level) => {
    switch (level) {
      case 'EXTREME':
        return 'bg-red-500 text-white border-red-600 shadow-red-500/20';
      case 'HIGH':
        return 'bg-orange-500 text-white border-orange-600 shadow-orange-500/20';
      case 'MODERATE':
        return 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20';
      default:
        return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20';
    }
  };

  const getCardBorder = (level) => {
    switch (level) {
      case 'EXTREME': return 'border-red-300 ring-1 ring-red-300 bg-red-50/20';
      case 'HIGH': return 'border-orange-300 bg-orange-50/10';
      case 'MODERATE': return 'border-amber-200 bg-amber-50/10';
      default: return 'border-slate-200 bg-white hover:border-slate-300';
    }
  };

  return (
    <div
      onClick={() => onSelect(district)}
      className={`rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group ${getCardBorder(
        overall.level
      )}`}
    >
      <div>
        {/* Header: Name, Division & Risk Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                {name}
              </h3>
            </div>
            {secondaryName && (
              <p className="text-xs text-slate-400 font-sans tracking-wide">
                {secondaryName} &bull; {district.division} Division
              </p>
            )}
          </div>

          <div className="text-right rtl:text-left flex flex-col items-end rtl:items-start">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm border ${getBadgeStyle(
                overall.level
              )}`}
            >
              {t(`risk.${overall.level}`)}
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-1">
              Index: <strong className="text-slate-700">{overall.score}/100</strong>
            </span>
          </div>
        </div>

        {/* Hazard Indicator Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {overall.primaryHazard === 'HEATWAVE' && (
            <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1 text-amber-500" />
              {t('risk.hazardHeatwave')}
            </span>
          )}
          {overall.primaryHazard === 'FLOOD' && (
            <span className="inline-flex items-center text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
              <Waves className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1 text-sky-500" />
              {t('risk.hazardFlood')}
            </span>
          )}
          {overall.primaryHazard === 'COMPOUND_DISASTER' && (
            <span className="inline-flex items-center text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              <ShieldAlert className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1 text-red-500" />
              {t('risk.hazardCompound')}
            </span>
          )}
          {overall.primaryHazard === 'NORMAL' && (
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              {t('risk.hazardNormal')}
            </span>
          )}
          {district.geographicAttributes?.isRiverine && (
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Indus River Basin
            </span>
          )}
          {district.geographicAttributes?.isCoastal && (
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Coastal Shoreline
            </span>
          )}
        </div>

        {/* Telemetry Metric Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 text-center">
          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <Thermometer className="w-3 h-3 text-red-500" />
              <span>{t('metrics.currentTemp')}</span>
            </div>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              {weather.temp}°C
            </div>
            <div className="text-[10px] text-slate-400">
              Feels: {weather.apparentTemp}°C
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <Droplets className="w-3 h-3 text-sky-500" />
              <span>{t('metrics.rain24h')}</span>
            </div>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              {(flood.metrics?.precip24h || 0).toFixed(1)} mm
            </div>
            <div className="text-[10px] text-slate-400">
              7d: {(flood.metrics?.precip7DaySum || 0).toFixed(1)} mm
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <Waves className="w-3 h-3 text-indigo-500" />
              <span>{t('metrics.riverDischarge')}</span>
            </div>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              {Math.round(district.floodData?.riverDischargeMax || 0)}
            </div>
            <div className="text-[10px] text-slate-400">m³/s</div>
          </div>
        </div>

        {/* Live Safety Advisory Preview */}
        <div className="text-xs text-slate-600 line-clamp-2 italic bg-white p-2 rounded-lg border border-slate-100 mb-3">
          &ldquo;
          {overall.primaryHazard === 'FLOOD'
            ? flood.advisories?.[lang] || flood.advisories?.en
            : heat.advisories?.[lang] || heat.advisories?.en}
          &rdquo;
        </div>

        {/* Data Quality & Integrity Badge */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span className="inline-flex items-center space-x-1 rtl:space-x-reverse font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Confidence: <strong>{district.dataQuality?.confidenceScore || 98}%</strong></span>
          </span>
          <span className="text-slate-400">
            {district.dataQuality?.status === 'VERIFIED_LIVE' ? 'Open-Meteo & GloFAS' : 'Validated Model'}
          </span>
        </div>
      </div>

      {/* Footer / Open Dossier link & WhatsApp Share */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const advisory = overall.primaryHazard === 'FLOOD'
              ? (flood.advisories?.[lang] || flood.advisories?.en)
              : (heat.advisories?.[lang] || heat.advisories?.en);
            const msg = `🚨 *Sindh STREAM Early Warning Alert*\n📍 *District:* ${name} (${overall.level} Risk - Index: ${overall.score}/100)\n⚠️ *Advisory:* ${advisory}\n📞 *Emergency Rescue:* 1122 | *PDMA Sindh:* 1736`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
          }}
          className="inline-flex items-center space-x-1 rtl:space-x-reverse text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors"
          title="Broadcast alert to WhatsApp"
        >
          <span>Share WhatsApp</span>
        </button>

        <span className="text-sky-600 group-hover:text-sky-700 flex items-center space-x-1 rtl:space-x-reverse">
          <span>{t('modal.districtDetails')}</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}
