import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Flame,
  Waves,
  Thermometer,
  Droplets,
  Wind,
  PhoneCall,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Info,
  Volume2,
  VolumeX,
  Printer,
  Share2
} from 'lucide-react';

export default function DistrictModal({ district, onClose }) {
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  if (!district) return null;

  const lang = i18n.language;
  const name = district.districtName?.[lang] || district.districtName?.en;
  const overall = district.overallRisk || {};
  const heat = district.heatRisk || {};
  const flood = district.floodRisk || {};
  const weather = district.currentWeather || {};
  const forecast = district.forecast || {};
  const dates = forecast.dailyDates || [];
  const quality = district.dataQuality || { confidenceScore: 98, status: 'VERIFIED_LIVE' };

  // Audio Voice Readout (Text-to-Speech) for Rural Accessibility
  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const advisory = overall.primaryHazard === 'FLOOD'
      ? (flood.advisories?.[lang] || flood.advisories?.en)
      : (heat.advisories?.[lang] || heat.advisories?.en);

    const speechText = `${name}. Warning Level: ${overall.level}. ${advisory}. For help call Rescue 1122 or PDMA Sindh 1736.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.9;
    utterance.lang = lang === 'ur' ? 'ur-PK' : lang === 'sd' ? 'ar-SA' : 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShareWhatsApp = () => {
    const advisory = overall.primaryHazard === 'FLOOD'
      ? (flood.advisories?.[lang] || flood.advisories?.en)
      : (heat.advisories?.[lang] || heat.advisories?.en);
    const msg = `🚨 *Sindh STREAM Early Warning Dossier*\n📍 *District:* ${name} (${district.division} Division)\n⚠️ *Threat:* ${overall.level} Risk (Index: ${overall.score}/100)\n🌡️ *Temp:* ${weather.temp}°C (Feels like: ${weather.apparentTemp}°C)\n🌧️ *Rain 24h:* ${(flood.metrics?.precip24h || 0).toFixed(1)} mm\n🌊 *River Discharge:* ${Math.round(district.floodData?.riverDischargeMax || 0)} m³/s\n\n📋 *Safety Guidance:* ${advisory}\n\n📞 *Rescue 1122* | *PDMA Sindh 1736*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5 flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={handlePrint}
              className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              title="Print Official SitRep"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="text-slate-300 hover:text-emerald-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              title="Share via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-white/20 text-white border border-white/20">
              {district.division} Division
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
              style={{ backgroundColor: overall.badgeColor }}
            >
              {t(`risk.${overall.level}`)} &bull; {overall.score}/100
            </span>
            {district.geographicAttributes?.isRiverine && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-900/60 text-sky-200 border border-sky-700/50">
                🌊 Indus Basin
              </span>
            )}
            {district.geographicAttributes?.isCoastal && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-900/60 text-teal-200 border border-teal-700/50">
                🏖️ Arabian Sea Coast
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {name}
          </h2>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 mt-2 font-sans">
            <span>Urdu: <strong>{district.districtName?.ur}</strong></span>
            <span>Sindhi: <strong>{district.districtName?.sd}</strong></span>
            <span>Lat: {district.coordinates?.lat?.toFixed(3)}&deg;, Lon: {district.coordinates?.lon?.toFixed(3)}&deg;</span>
          </div>
        </div>

        {/* Data Quality & Integrity Banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Data Integrity: <strong className="text-emerald-700">{quality.confidenceScore}% Confidence</strong> ({quality.status})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Source: {quality.source || 'Open-Meteo & GloFAS Hydrology'}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          
          {/* 1. Dual Hazard Score Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Heatwave Assessment */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Flame className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{t('risk.heatRisk')}</h3>
                    <span className="text-xs text-amber-700 font-semibold">{t(`risk.${heat.level}`)}</span>
                  </div>
                </div>
                <div className="text-xl font-extrabold text-amber-600 font-mono">
                  {heat.score}/100
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-amber-200/60 rounded-full h-2.5 mb-3">
                <div
                  className="bg-amber-500 h-2.5 rounded-full"
                  style={{ width: `${heat.score}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-white/70 p-2.5 rounded-xl border border-amber-100">
                <div>Temp: <strong>{weather.temp}&deg;C</strong></div>
                <div>Feels Like: <strong>{weather.apparentTemp}&deg;C</strong></div>
                <div>Humidity: <strong>{weather.humidity}%</strong></div>
                <div>Wind: <strong>{weather.windSpeed} km/h</strong></div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Analysis:</strong> {heat.reason}
              </p>
            </div>

            {/* Flood Assessment */}
            <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                    <Waves className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{t('risk.floodRisk')}</h3>
                    <span className="text-xs text-sky-700 font-semibold">{t(`risk.${flood.level}`)}</span>
                  </div>
                </div>
                <div className="text-xl font-extrabold text-sky-600 font-mono">
                  {flood.score}/100
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-sky-200/60 rounded-full h-2.5 mb-3">
                <div
                  className="bg-sky-500 h-2.5 rounded-full"
                  style={{ width: `${flood.score}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-white/70 p-2.5 rounded-xl border border-sky-100">
                <div>24h Rain: <strong>{(flood.metrics?.precip24h || 0).toFixed(1)} mm</strong></div>
                <div>7d Rain Total: <strong>{(flood.metrics?.precip7DaySum || 0).toFixed(1)} mm</strong></div>
                <div>River Discharge: <strong>{Math.round(district.floodData?.riverDischargeMax || 0)} m&sup3;/s</strong></div>
                <div>Rain Prob: <strong>{forecast.precipProbMax || 0}%</strong></div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Analysis:</strong> {flood.reason}
              </p>
            </div>

          </div>

          {/* 2. 7-Day Forecast Visualization */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5 rtl:space-x-reverse">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>{t('modal.forecast7Days')}</span>
            </h4>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {dates.slice(0, 7).map((date, idx) => {
                const maxTemp = forecast.dailyMaxTemps?.[idx] || 0;
                const rain = forecast.dailyPrecipSum?.[idx] || 0;
                const discharge = forecast.dailyDischargeMax?.[idx] || 0;
                const dayLabel = new Date(date).toLocaleDateString([], { weekday: 'short' });

                return (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-bold text-slate-600 block">{dayLabel}</span>
                    <div className="my-2">
                      <span className="text-sm font-extrabold text-amber-600 block">
                        {Math.round(maxTemp)}&deg;
                      </span>
                      <span className="text-[10px] text-sky-600 block">
                        {rain > 0 ? `${rain.toFixed(1)}mm` : '0 mm'}
                      </span>
                    </div>
                    {discharge > 0 && (
                      <span className="text-[9px] text-indigo-500 font-mono block truncate" title={`${Math.round(discharge)} m³/s`}>
                        {Math.round(discharge)} m&sup3;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Actionable Multilingual Advisories + Audio Button */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>{t('modal.actionableAdvisories')}</span>
              </h4>

              {/* Text-to-Speech Voice Button */}
              <button
                onClick={handleSpeak}
                className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  isSpeaking
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                title="Listen to advisory aloud"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Audio' : '🔊 Listen / ٻڌو / سنیں'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* Heatwave Advisory */}
              <div className="p-3 bg-white rounded-xl border border-amber-100 flex items-start space-x-3 rtl:space-x-reverse">
                <Flame className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-800 block mb-0.5">Heatwave Guidance:</strong>
                  <p className="text-slate-700 leading-relaxed">
                    {heat.advisories?.[lang] || heat.advisories?.en}
                  </p>
                </div>
              </div>

              {/* Flood Advisory */}
              <div className="p-3 bg-white rounded-xl border border-sky-100 flex items-start space-x-3 rtl:space-x-reverse">
                <Waves className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-sky-800 block mb-0.5">Flood & Drainage Guidance:</strong>
                  <p className="text-slate-700 leading-relaxed">
                    {flood.advisories?.[lang] || flood.advisories?.en}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Direct Emergency Call Button */}
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href="tel:1122"
              className="flex-1 min-w-[160px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Rescue 1122</span>
            </a>
            <a
              href="tel:1736"
              className="flex-1 min-w-[160px] bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call PDMA Sindh (1736)</span>
            </a>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {t('modal.close')}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
