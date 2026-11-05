import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { Flame, Waves, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function SindhMap({ districts, onSelectDistrict }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Sindh Geographic Center
  const sindhCenter = [26.0, 68.4];

  const getColor = (level) => {
    switch (level) {
      case 'EXTREME': return '#ef4444'; // Red
      case 'HIGH': return '#f97316';    // Orange
      case 'MODERATE': return '#f59e0b';// Amber / Yellow
      default: return '#10b981';        // Emerald Green
    }
  };

  const getRadius = (score) => {
    // Dynamic radius from 8 to 18px based on risk intensity
    return 9 + Math.round((score / 100) * 9);
  };

  const getDistrictName = (district) => {
    if (!district?.districtName) return district?.districtId || '';
    return district.districtName[lang] || district.districtName.en;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      
      {/* Map Header */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping mr-1 rtl:mr-0 rtl:ml-1" />
            <span>{t('nav.mapView')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic risk distribution across all 30 districts (click any circle marker to view details)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">{t('risk.LOW')}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">{t('risk.MODERATE')}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-slate-600">{t('risk.HIGH')}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-600">{t('risk.EXTREME')}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[460px] w-full relative z-0">
        <MapContainer
          center={sindhCenter}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {districts.map((district) => {
            const lat = district.coordinates?.lat;
            const lon = district.coordinates?.lon;
            if (!lat || !lon) return null;

            const color = getColor(district.overallRisk?.level);
            const radius = getRadius(district.overallRisk?.score || 0);
            const name = getDistrictName(district);

            return (
              <CircleMarker
                key={district.districtId}
                center={[lat, lon]}
                radius={radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  weight: 2
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-xs font-bold font-sans">
                    {name} ({district.overallRisk?.score}/100)
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-2 min-w-[210px] font-sans">
                    <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                      <span className="font-extrabold text-sm text-slate-900">{name}</span>
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold rounded-full text-white"
                        style={{ backgroundColor: color }}
                      >
                        {district.overallRisk?.level}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-slate-700">
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-slate-400 block text-[10px]">Temp</span>
                        <strong>{district.currentWeather?.temp}°C</strong>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-slate-400 block text-[10px]">Feels Like</span>
                        <strong>{district.currentWeather?.apparentTemp}°C</strong>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-slate-400 block text-[10px]">24h Rain</span>
                        <strong>{district.floodRisk?.metrics?.precip24h || 0} mm</strong>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-slate-400 block text-[10px]">Discharge</span>
                        <strong>{Math.round(district.floodData?.riverDischargeMax || 0)} m³/s</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDistrict(district)}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs py-1.5 px-3 rounded flex items-center justify-center space-x-1"
                    >
                      <span>{t('modal.districtDetails')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}
