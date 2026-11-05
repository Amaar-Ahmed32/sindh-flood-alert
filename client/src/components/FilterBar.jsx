import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, Flame, Waves, AlertTriangle } from 'lucide-react';

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  hazardFilter,
  setHazardFilter,
  selectedDivision,
  setSelectedDivision,
  sortBy,
  setSortBy,
  divisions
}) {
  const { t } = useTranslation();

  const filterTabs = [
    { id: 'ALL', label: t('filters.allHazards'), icon: null },
    { id: 'HEATWAVE', label: t('filters.heatwaveOnly'), icon: Flame, color: 'text-amber-500' },
    { id: 'FLOOD', label: t('filters.floodOnly'), icon: Waves, color: 'text-sky-500' },
    { id: 'CRITICAL', label: t('filters.highOnly'), icon: AlertTriangle, color: 'text-red-500' }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 space-y-4">
      
      {/* Top Row: Search and Dropdowns */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-50/50"
          />
        </div>

        {/* Division & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Division Select */}
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">{t('filters.allDivisions')}</option>
            {divisions.map((div) => (
              <option key={div} value={div}>
                {div} Division
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="RISK_DESC">{t('filters.riskDesc')}</option>
            <option value="NAME_ASC">{t('filters.nameAsc')}</option>
            <option value="TEMP_DESC">{t('filters.tempDesc')}</option>
            <option value="PRECIP_DESC">{t('filters.precipDesc')}</option>
          </select>

        </div>

      </div>

      {/* Bottom Row: Hazard Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400 font-medium mr-1 rtl:mr-0 rtl:ml-1">Filter:</span>
        {filterTabs.map((tab) => {
          const isActive = hazardFilter === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setHazardFilter(tab.id)}
              className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${tab.color}`} />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
