import React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n/i18n';
import { RefreshCw, Globe, Waves, Flame, Sparkles } from 'lucide-react';

export default function Navbar({
  onRefresh,
  isRefreshing,
  activeScenario,
  onSelectScenario
}) {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  const scenarios = [
    { id: 'live', label: '🟢 Live Real-Time (Open-Meteo)', short: 'Live' },
    { id: 'flood_2022', label: '🌊 2022 Super Flood Deluge', short: '2022 Flood' },
    { id: 'heatwave_summer', label: '🔥 51°C Jacobabad Heatwave', short: '51°C Heat' },
    { id: 'cyclone_coastal', label: '🌀 Cyclone & Coastal Surge', short: 'Cyclone' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* Logo & Project Identity */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <div className="relative">
                <Waves className="w-6 h-6" />
                <Flame className="w-3.5 h-3.5 text-amber-200 absolute -top-1 -right-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {t('app.title')}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  Sindh STREAM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block max-w-sm truncate">
                {t('app.subtitle')}
              </p>
            </div>
          </div>

          {/* Center: Judge Demo Scenario Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <div className="flex items-center px-2 text-[11px] font-bold text-slate-500 space-x-1 rtl:space-x-reverse">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulator:</span>
            </div>
            {scenarios.map((sc) => {
              const isActive = activeScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(sc.id)}
                  disabled={isRefreshing}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  title={sc.label}
                >
                  {sc.short}
                </button>
              );
            })}
          </div>

          {/* Controls: Refresh Button & Language Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            
            {/* Mobile Scenario Dropdown */}
            <div className="lg:hidden">
              <select
                value={activeScenario || 'live'}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-white font-medium"
              >
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.short}</option>
                ))}
              </select>
            </div>

            {/* Refresh Live Data button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isRefreshing
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 active:scale-95 text-white hover:shadow-sky-500/20'
              }`}
              title={t('app.refreshBtn')}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? t('app.refreshing') : t('app.refreshBtn')}
              </span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 rtl:ml-0 rtl:mr-1" />
              {LANGUAGES.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                      isActive
                        ? 'bg-white text-sky-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
