import React, { useState } from 'react';
import { OFFICE_LOCATIONS, OfficeLocation } from '../lib/locations-data';
import { MapPin, Phone, Mail, Globe, Building2, Check } from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [activeLocation, setActiveLocation] = useState<OfficeLocation>(OFFICE_LOCATIONS[0]);

  const regions = ['ALL', 'North America', 'EMEA', 'APAC', 'LATAM'];

  const filteredLocations =
    selectedRegion === 'ALL'
      ? OFFICE_LOCATIONS
      : OFFICE_LOCATIONS.filter((loc) => loc.region === selectedRegion);

  return (
    <div className="space-y-8">
      {/* Region Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {regions.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedRegion === region
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {region === 'ALL' ? 'All Regions' : region}
          </button>
        ))}
      </div>

      {/* Map View & Location Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Stylized World Map Component */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-md flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <span className="font-bold text-sm tracking-wide">Interactive Global Operations Map</span>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-400/30">
              {filteredLocations.length} Active Hubs
            </span>
          </div>

          {/* Interactive Hub Grid representation */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
            {OFFICE_LOCATIONS.map((loc) => {
              const isSelected = activeLocation.id === loc.id;
              const isRegionMatch = selectedRegion === 'ALL' || loc.region === selectedRegion;

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setActiveLocation(loc)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-400 shadow-lg scale-102'
                      : isRegionMatch
                      ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700/80'
                      : 'opacity-40 bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{loc.city}</span>
                    {loc.isHeadquarters && (
                      <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                        HQ
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300">{loc.country}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {loc.coordinates.lat.toFixed(2)}°, {loc.coordinates.lng.toFixed(2)}°
                  </p>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between pt-3 border-t border-slate-800">
            <span>Powered by Google Maps Platform API</span>
            <span className="font-mono text-blue-400">Status: Operational · 99.95% SLA</span>
          </div>
        </div>

        {/* Selected Hub Details Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
              <Building2 className="h-3.5 w-3.5" />
              <span>{activeLocation.region} Hub</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-1">{activeLocation.city}</h3>
            <p className="text-sm font-medium text-slate-600 mb-6">{activeLocation.country}</p>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeLocation.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{activeLocation.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{activeLocation.email}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <a
              href={`https://maps.google.com/?q=${activeLocation.coordinates.lat},${activeLocation.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Get Directions & Route
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
