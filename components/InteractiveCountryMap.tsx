'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NEST_COUNTRIES, AFRICA_MAP_VIEWBOX, NestCountry } from '@/lib/data/countries';

interface InteractiveCountryMapProps {
  countries?: NestCountry[];
}

export default function InteractiveCountryMap({
  countries = NEST_COUNTRIES,
}: InteractiveCountryMapProps) {
  const [selectedCode, setSelectedCode] = useState<string>(countries[0]?.code ?? 'KE');
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  const selectedCountry =
    countries.find((c) => c.code === selectedCode) ?? countries[0];

  useEffect(() => {
    setIsVideoOpen(false);
  }, [selectedCode]);

  const handleKeyDown = (e: React.KeyboardEvent, code: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedCode(code);
    }
  };

  if (!selectedCountry) return null;

  return (
    <section
      aria-labelledby="nest-map-heading"
      className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm"
    >
      <div className="mb-6">
        <h2 id="nest-map-heading" className="text-2xl font-bold text-slate-900">
          Where NEST360 Works
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Select a country on the map or from the list below to explore regional programs.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="NEST360 Partner Countries"
        className="flex flex-wrap gap-2 mb-6"
      >
        {countries.map((country) => {
          const isSelected = country.code === selectedCountry.code;
          return (
            <button
              key={country.code}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCode(country.code)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {country.name}
            </button>
          );
        })}
      </div>

      {/* Responsive Split Layout: Map Left, Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-center justify-center">
          <svg
            viewBox="0 0 920 1001"
            role="img"
            aria-label="Interactive map of Africa highlighting NEST360 partner countries"
            className="w-full h-auto max-h-[480px] mx-auto block select-none"
          >
            {/* Background Africa Map */}
            <image
              href="/africa.svg"
              x="0"
              y="0"
              width="1000"
              height="1001"
              aria-hidden="true"
            />

            {/* Interactive Country Shapes */}
            {countries.map((country) => {
              const isSelected = country.code === selectedCountry.code;
              return (
                <g
                  key={country.code}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${country.name}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCode(country.code)}
                  onKeyDown={(e) => handleKeyDown(e, country.code)}
                  className="cursor-pointer focus:outline-none group"
                >
                  {/* Full Country Border Shape */}
                  <path
                    d={country.svgPath}
                    className={`transition-colors duration-150 stroke-white stroke-[2] ${
                      isSelected
                        ? 'fill-teal-700'
                        : 'fill-teal-500/80 group-hover:fill-teal-600 group-focus:fill-teal-600 group-focus:stroke-slate-900 group-focus:stroke-[3]'
                    }`}
                  />
                  {/* Country Name Label */}
                  <text
                    x={country.coordinates.x}
                    y={country.coordinates.y}
                    textAnchor="middle"
                    className={`text-[18px] font-bold pointer-events-none drop-shadow-sm ${
                      isSelected ? 'fill-white' : 'fill-slate-900'
                    }`}
                  >
                    {country.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Country Details Panel */}
        <div
          role="tabpanel"
          aria-live="polite"
          className="lg:col-span-5 bg-slate-50 rounded-lg border border-slate-200 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-2xl font-bold text-slate-900">
                {selectedCountry.name}
              </h3>
              {selectedCountry.isSampleData && (
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-800">
                  Sample Data
                </span>
              )}
            </div>

            <p className="text-slate-700 leading-relaxed mb-6">
              {selectedCountry.description}
            </p>

            {/* Action Links */}
            <div className="flex flex-wrap items-center gap-3">
              {selectedCountry.subpageUrl ? (
                <Link
                  href={selectedCountry.subpageUrl}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
                >
                  Explore {selectedCountry.name} Page →
                </Link>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  Country subpage coming soon
                </span>
              )}

              {selectedCountry.videoUrl && !isVideoOpen && (
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
                >
                  ▶ Watch Country Video
                </button>
              )}
            </div>
          </div>

          
          {selectedCountry.videoUrl && isVideoOpen && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">
                  {selectedCountry.videoTitle || `${selectedCountry.name} Video`}
                </span>
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Close video
                </button>
              </div>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                <iframe
                  src={selectedCountry.videoUrl}
                  title={selectedCountry.videoTitle || `${selectedCountry.name} Video`}
                  className="w-full h-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}