'use client';

import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  CloudRain,
  Layers,
  Sparkles,
  RotateCcw,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { CalculationInputs, CalculationResults, PropertyType } from '@/lib/types';
import { REGIONAL_PRESETS } from '@/lib/calculator';

interface ProjectOverviewProps {
  inputs: CalculationInputs;
  results: CalculationResults;
  onUpdateInput: <K extends keyof CalculationInputs>(field: K, value: CalculationInputs[K]) => void;
  onApplyPreset: (presetIndex: number) => void;
  onReset: () => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  inputs,
  results,
  onUpdateInput,
  onApplyPreset,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
              <Building2 className="w-3 h-3 mr-1 text-sky-500" />
              {inputs.propertyType.replace('_', ' ').toUpperCase()}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CloudRain className="w-3 h-3 mr-1 text-emerald-500" />
              {inputs.annualRainfallMm} mm Annual Rain
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Layers className="w-3 h-3 mr-1 text-indigo-500" />
              {inputs.catchmentAreaSqM} m² Catchment
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputs.projectName}
              onChange={(e) => onUpdateInput('projectName', e.target.value)}
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-300 focus:border-sky-500 rounded-lg px-2 py-0.5 transition-all outline-none"
              placeholder="Project Name..."
            />
          </div>

          <div className="flex items-center text-xs text-slate-500 mt-1 pl-2 space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={inputs.locationName}
              onChange={(e) => onUpdateInput('locationName', e.target.value)}
              className="bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-sky-500 outline-none px-1 text-xs text-slate-600 font-medium"
              placeholder="City, Country..."
            />
          </div>
        </div>

        {/* Quick Presets Dropdown & Reset */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value !== '') {
                  onApplyPreset(parseInt(e.target.value, 10));
                }
              }}
              defaultValue=""
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer transition-colors"
            >
              <option value="" disabled>
                Load Climate Preset...
              </option>
              {REGIONAL_PRESETS.map((preset, idx) => (
                <option key={preset.name} value={idx}>
                  {preset.name} ({preset.annualRainfallMm} mm)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Reset to default values"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
        <div className="bg-sky-50/60 rounded-xl p-3 border border-sky-100/80">
          <div className="text-xs font-medium text-sky-800">Harvest Potential</div>
          <div className="text-lg sm:text-xl font-bold text-sky-950 mt-1">
            {results.annualHarvestPotentialKL.toLocaleString()}{' '}
            <span className="text-xs font-normal text-sky-700">kL/yr</span>
          </div>
          <div className="text-[11px] text-sky-600 font-medium">
            ≈ {results.dailyHarvestAverageLitres} L/day avg
          </div>
        </div>

        <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100/80">
          <div className="text-xs font-medium text-emerald-800">Water Demand</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-950 mt-1">
            {results.annualDemandKL.toLocaleString()}{' '}
            <span className="text-xs font-normal text-emerald-700">kL/yr</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {results.dailyDemandLitres.toLocaleString()} L/day targeted
          </div>
        </div>

        <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100/80">
          <div className="text-xs font-medium text-indigo-800">Self-Sufficiency</div>
          <div className="text-lg sm:text-xl font-bold text-indigo-950 mt-1">
            {results.selfSufficiencyRatio}%
          </div>
          <div className="text-[11px] text-indigo-600 font-medium">
            {results.selfSufficiencyRatio >= 100 ? 'Surplus Capacity' : 'Municipal Offset'}
          </div>
        </div>

        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100/80">
          <div className="text-xs font-medium text-amber-800">Tank Autonomy</div>
          <div className="text-lg sm:text-xl font-bold text-amber-950 mt-1">
            {results.autonomyDaysWithRecommendedTank}{' '}
            <span className="text-xs font-normal text-amber-700">days</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium">
            {results.recommendedTankSizeLitres.toLocaleString()} L tank
          </div>
        </div>
      </div>
    </div>
  );
};
