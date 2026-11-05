import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import EmergencyBanner from './components/EmergencyBanner';
import DashboardStats from './components/DashboardStats';
import SindhMap from './components/SindhMap';
import FilterBar from './components/FilterBar';
import DistrictCard from './components/DistrictCard';
import DistrictModal from './components/DistrictModal';
import { fetchDistricts, fetchHighlights, triggerLiveSync, switchScenario } from './services/api';
import { AlertCircle, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [districts, setDistricts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [highlights, setHighlights] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [activeScenario, setActiveScenario] = useState('live');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [hazardFilter, setHazardFilter] = useState('ALL');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [sortBy, setSortBy] = useState('RISK_DESC');

  // Selected district for detail modal
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Load initial data
  const loadData = async () => {
    try {
      setError(null);
      const [districtsData, highlightsData] = await Promise.all([
        fetchDistricts(),
        fetchHighlights().catch(() => null)
      ]);

      if (districtsData?.data) {
        setDistricts(districtsData.data);
        setSummary(districtsData.summary);
        setLastSyncTime(districtsData.lastSync);
        if (districtsData.activeScenario) {
          setActiveScenario(districtsData.activeScenario);
        }
      }
      if (highlightsData?.success) {
        setHighlights(highlightsData);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle manual live refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await triggerLiveSync();
      await loadData();
    } catch (err) {
      console.error('Live sync error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Judge Demo Scenario switcher
  const handleSelectScenario = async (scenarioId) => {
    setIsRefreshing(true);
    try {
      await switchScenario(scenarioId);
      setActiveScenario(scenarioId);
      await loadData();
    } catch (err) {
      console.error('Scenario switch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Distinct divisions
  const divisions = useMemo(() => {
    const set = new Set();
    districts.forEach(d => { if (d.division) set.add(d.division); });
    return Array.from(set).sort();
  }, [districts]);

  // Filtered and Sorted Districts
  const filteredDistricts = useMemo(() => {
    return districts
      .filter((d) => {
        // 1. Division filter
        if (selectedDivision !== 'ALL' && d.division !== selectedDivision) {
          return false;
        }

        // 2. Hazard filter
        if (hazardFilter === 'HEATWAVE' && d.overallRisk?.primaryHazard !== 'HEATWAVE') {
          return false;
        }
        if (hazardFilter === 'FLOOD' && d.overallRisk?.primaryHazard !== 'FLOOD') {
          return false;
        }
        if (hazardFilter === 'CRITICAL' && d.overallRisk?.level !== 'HIGH' && d.overallRisk?.level !== 'EXTREME') {
          return false;
        }

        // 3. Search Term (searches English, Urdu, Sindhi, and division)
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim();
          const enMatch = d.districtName?.en?.toLowerCase().includes(query);
          const urMatch = d.districtName?.ur?.toLowerCase().includes(query);
          const sdMatch = d.districtName?.sd?.toLowerCase().includes(query);
          const divMatch = d.division?.toLowerCase().includes(query);
          return enMatch || urMatch || sdMatch || divMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'RISK_DESC') {
          return (b.overallRisk?.score || 0) - (a.overallRisk?.score || 0);
        }
        if (sortBy === 'NAME_ASC') {
          const nameA = a.districtName?.[lang] || a.districtName?.en || '';
          const nameB = b.districtName?.[lang] || b.districtName?.en || '';
          return nameA.localeCompare(nameB);
        }
        if (sortBy === 'TEMP_DESC') {
          return (b.currentWeather?.temp || 0) - (a.currentWeather?.temp || 0);
        }
        if (sortBy === 'PRECIP_DESC') {
          return (b.floodRisk?.metrics?.precip24h || 0) - (a.floodRisk?.metrics?.precip24h || 0);
        }
        return 0;
      });
  }, [districts, searchTerm, hazardFilter, selectedDivision, sortBy, lang]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* 1. Emergency Helpline Banner */}
      <EmergencyBanner />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastSyncTime={lastSyncTime}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Hero Section */}
        <div className="mb-6 bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 mb-3 shadow-sm">
              Sindh STREAM Innovation 2026-27
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {t('app.subtitle')}
            </h1>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl">
              {t('app.tagline')}
            </p>
          </div>
          
          {/* Subtle background wave graphic */}
          <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none text-white text-[200px] leading-none select-none">
            🌊
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-slate-600 font-semibold">
              Connecting to Sindh Early Warning telemetry...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center space-x-3 rtl:space-x-reverse">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <strong>Connection Note:</strong> {error}
              <button
                onClick={loadData}
                className="ml-3 underline font-bold hover:text-red-900"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Top KPI Metrics */}
            <DashboardStats summary={summary} highlights={highlights} />

            {/* Interactive Leaflet Map */}
            <SindhMap
              districts={districts}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
            />

            {/* Filter and Search Bar */}
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              hazardFilter={hazardFilter}
              setHazardFilter={setHazardFilter}
              selectedDivision={selectedDivision}
              setSelectedDivision={setSelectedDivision}
              sortBy={sortBy}
              setSortBy={setSortBy}
              divisions={divisions}
            />

            {/* District Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>
                    {t('nav.districts')} ({filteredDistricts.length})
                  </span>
                </h3>
              </div>

              {filteredDistricts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-500 font-semibold">
                    No districts match the selected filters or search terms.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setHazardFilter('ALL');
                      setSelectedDivision('ALL');
                    }}
                    className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-lg text-slate-700"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDistricts.map((district) => (
                    <DistrictCard
                      key={district.districtId}
                      district={district}
                      onSelect={(d) => setSelectedDistrict(d)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </main>

      {/* Deep-dive Dossier Modal */}
      {selectedDistrict && (
        <DistrictModal
          district={selectedDistrict}
          onClose={() => setSelectedDistrict(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            {t('footer.credit')}
          </p>
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto">
            {t('footer.dataSource')}
          </p>
        </div>
      </footer>

    </div>
  );
}
