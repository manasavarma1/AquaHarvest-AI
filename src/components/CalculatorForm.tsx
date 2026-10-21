'use client';

import React, { useState } from 'react';
import {
  Layers,
  CloudRain,
  Users,
  Cylinder,
  Coins,
  ChevronRight,
  Info,
  Check,
  Building,
  Home,
  GraduationCap,
  Store,
  Trees,
} from 'lucide-react';
import {
  CalculationInputs,
  RoofMaterialType,
  PropertyType,
} from '@/lib/types';
import { ROOF_MATERIALS, TANK_MATERIALS } from '@/lib/calculator';

interface CalculatorFormProps {
  inputs: CalculationInputs;
  onUpdateInput: <K extends keyof CalculationInputs>(field: K, value: CalculationInputs[K]) => void;
  onUpdateMonthlyRain: (monthIdx: number, val: number) => void;
  onUpdateDemandUse: (key: keyof CalculationInputs['demandUses'], val: boolean) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs,
  onUpdateInput,
  onUpdateMonthlyRain,
  onUpdateDemandUse,
}) => {
  const [activeTab, setActiveTab] = useState<'catchment' | 'rainfall' | 'demand' | 'tank' | 'economics'>('catchment');
  const [useDimensions, setUseDimensions] = useState(false);

  const handleDimensionChange = (length?: number, width?: number) => {
    const l = length ?? (inputs.roofLengthM || 20);
    const w = width ?? (inputs.roofWidthM || 10);
    onUpdateInput('roofLengthM', l);
    onUpdateInput('roofWidthM', w);
    onUpdateInput('catchmentAreaSqM', Math.round(l * w));
  };

  const propertyTypes: { id: PropertyType; label: string; icon: any; defaultLpcd: number }[] = [
    { id: 'residential', label: 'Residential Home', icon: Home, defaultLpcd: 135 },
    { id: 'school_college', label: 'School / College', icon: GraduationCap, defaultLpcd: 45 },
    { id: 'hostel', label: 'Hostel / Dormitory', icon: Building, defaultLpcd: 150 },
    { id: 'commercial', label: 'Commercial Office', icon: Store, defaultLpcd: 50 },
    { id: 'agricultural', label: 'Farm / Agricultural', icon: Trees, defaultLpcd: 80 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none bg-slate-50/70">
        <button
          onClick={() => setActiveTab('catchment')}
          className={`flex items-center space-x-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'catchment'
              ? 'border-sky-600 text-sky-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-500" />
          <span>1. Catchment & Roof</span>
        </button>

        <button
          onClick={() => setActiveTab('rainfall')}
          className={`flex items-center space-x-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'rainfall'
              ? 'border-sky-600 text-sky-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <CloudRain className="w-4 h-4 text-emerald-500" />
          <span>2. Climate & Rain</span>
        </button>

        <button
          onClick={() => setActiveTab('demand')}
          className={`flex items-center space-x-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'demand'
              ? 'border-sky-600 text-sky-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-500" />
          <span>3. Water Demand</span>
        </button>

        <button
          onClick={() => setActiveTab('tank')}
          className={`flex items-center space-x-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'tank'
              ? 'border-sky-600 text-sky-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Cylinder className="w-4 h-4 text-amber-500" />
          <span>4. Tank & Storage</span>
        </button>

        <button
          onClick={() => setActiveTab('economics')}
          className={`flex items-center space-x-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'economics'
              ? 'border-sky-600 text-sky-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-600" />
          <span>5. Financial & Tariff</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: CATCHMENT & ROOF */}
        {activeTab === 'catchment' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800">
                  Catchment Footprint Area
                </label>
                <div className="flex items-center space-x-2 text-xs">
                  <span className={!useDimensions ? 'font-semibold text-sky-600' : 'text-slate-500'}>
                    Direct Area
                  </span>
                  <button
                    type="button"
                    onClick={() => setUseDimensions(!useDimensions)}
                    className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-300"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        useDimensions ? 'translate-x-4 bg-sky-600' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={useDimensions ? 'font-semibold text-sky-600' : 'text-slate-500'}>
                    Length × Width
                  </span>
                </div>
              </div>

              {!useDimensions ? (
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      value={inputs.catchmentAreaSqM}
                      onChange={(e) => onUpdateInput('catchmentAreaSqM', Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                    <span className="absolute right-4 top-2.5 text-sm font-medium text-slate-400">
                      m² (sq. meters)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={2000}
                    step={10}
                    value={inputs.catchmentAreaSqM}
                    onChange={(e) => onUpdateInput('catchmentAreaSqM', parseFloat(e.target.value))}
                    className="flex-1 accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Roof Length (m)</label>
                    <input
                      type="number"
                      value={inputs.roofLengthM || 20}
                      onChange={(e) => handleDimensionChange(parseFloat(e.target.value) || 0, undefined)}
                      className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Roof Width (m)</label>
                    <input
                      type="number"
                      value={inputs.roofWidthM || 10}
                      onChange={(e) => handleDimensionChange(undefined, parseFloat(e.target.value) || 0)}
                      className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1.5 flex items-center">
                <Info className="w-3.5 h-3.5 mr-1 text-slate-400 inline" />
                Equivalent horizontal projected catchment footprint: {inputs.catchmentAreaSqM} m² (≈ {(inputs.catchmentAreaSqM * 10.764).toFixed(0)} sq. ft.)
              </p>
            </div>

            {/* Roof Surface Material Selector */}
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">
                Roof Surface Material & Runoff Factor ($C_r$)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(ROOF_MATERIALS).map((material) => {
                  const isSelected = inputs.roofMaterial === material.id;
                  return (
                    <div
                      key={material.id}
                      onClick={() => onUpdateInput('roofMaterial', material.id)}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-1 ring-sky-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900">
                          {material.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                          C = {material.runoffCoefficient}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {material.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* First Flush & Filtration Efficiency */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  First-Flush Diverter & Screen Filtration Efficiency ($\eta$)
                </label>
                <span className="text-xs font-bold text-sky-700">
                  {(inputs.filterEfficiency * 100).toFixed(0)}% Efficiency
                </span>
              </div>
              <input
                type="range"
                min={0.70}
                max={0.95}
                step={0.01}
                value={inputs.filterEfficiency}
                onChange={(e) => onUpdateInput('filterEfficiency', parseFloat(e.target.value))}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>70% (Heavy leaf drop)</span>
                <span>85% (Standard civil filter)</span>
                <span>95% (High performance stainless screen)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIMATE & RAINFALL */}
        {activeTab === 'rainfall' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800">
                  Annual Precipitation / Rainfall ($P$)
                </label>
                <span className="text-sm font-bold text-emerald-700">
                  {inputs.annualRainfallMm} mm/year
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={100}
                    max={6000}
                    value={inputs.annualRainfallMm}
                    onChange={(e) => {
                      const val = Math.max(0, parseFloat(e.target.value) || 0);
                      onUpdateInput('annualRainfallMm', val);
                      // scale monthly distribution proportionally
                      const totalCurrent = inputs.monthlyRainfallDistribution.reduce((a, b) => a + b, 0) || 1;
                      const ratio = val / totalCurrent;
                      inputs.monthlyRainfallDistribution.forEach((m, i) => {
                        onUpdateMonthlyRain(i, Math.round(m * ratio));
                      });
                    }}
                    className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span className="absolute right-4 top-2.5 text-sm font-medium text-slate-400">
                    mm
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={3500}
                  step={25}
                  value={inputs.annualRainfallMm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateInput('annualRainfallMm', val);
                    const totalCurrent = inputs.monthlyRainfallDistribution.reduce((a, b) => a + b, 0) || 1;
                    const ratio = val / totalCurrent;
                    inputs.monthlyRainfallDistribution.forEach((m, i) => {
                      onUpdateMonthlyRain(i, Math.round(m * ratio));
                    });
                  }}
                  className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Monthly Breakdown Interactive Inputs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Monthly Rainfall Distribution (mm per month)
                </label>
                <span className="text-[11px] text-slate-400">
                  Sum of months: {inputs.monthlyRainfallDistribution.reduce((a, b) => a + b, 0)} mm
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                  (m, idx) => (
                    <div key={m} className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                        {m}
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={1500}
                        value={inputs.monthlyRainfallDistribution[idx] || 0}
                        onChange={(e) => onUpdateMonthlyRain(idx, Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WATER DEMAND */}
        {activeTab === 'demand' && (
          <div className="space-y-6">
            {/* Property Type Grid */}
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">
                Property & Facility Profile
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {propertyTypes.map((pt) => {
                  const Icon = pt.icon;
                  const isSelected = inputs.propertyType === pt.id;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => {
                        onUpdateInput('propertyType', pt.id);
                        onUpdateInput('lpcd', pt.defaultLpcd);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-400'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div className="font-semibold text-xs text-slate-800">{pt.label}</div>
                      <div className="text-[10px] text-slate-500">{pt.defaultLpcd} LPCD std</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occupants & LPCD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Number of Occupants / Daily Users
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    value={inputs.numberOfOccupants}
                    onChange={(e) => onUpdateInput('numberOfOccupants', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-32 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="range"
                    min={1}
                    max={300}
                    value={inputs.numberOfOccupants}
                    onChange={(e) => onUpdateInput('numberOfOccupants', parseInt(e.target.value, 10))}
                    className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Per Capita Demand (LPCD - Litres/person/day)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min={10}
                    max={400}
                    value={inputs.lpcd}
                    onChange={(e) => onUpdateInput('lpcd', Math.max(5, parseInt(e.target.value, 10) || 10))}
                    className="w-32 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="range"
                    min={20}
                    max={250}
                    value={inputs.lpcd}
                    onChange={(e) => onUpdateInput('lpcd', parseInt(e.target.value, 10))}
                    className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Dry Period Duration */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Longest Consecutive Dry Spell (T_dry)
                </label>
                <span className="text-xs font-bold text-indigo-700">
                  {inputs.dryPeriodDays} Consecutive Days
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={200}
                step={5}
                value={inputs.dryPeriodDays}
                onChange={(e) => onUpdateInput('dryPeriodDays', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Determines required tank storage volume to sustain the occupants with zero rainfall.
              </p>
            </div>

            {/* Targeted Uses */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Harvested Water Applications (Demand Segregation)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'toiletFlushing', label: 'Toilet Flushing', pct: '30%' },
                  { key: 'gardening', label: 'Gardening & Lawns', pct: '20%' },
                  { key: 'laundryWashing', label: 'Laundry & Washing', pct: '25%' },
                  { key: 'drinkingCooking', label: 'Drinking / Potable', pct: '25%' },
                ].map((item) => {
                  const isChecked = inputs.demandUses[item.key as keyof CalculationInputs['demandUses']];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onUpdateDemandUse(item.key as any, !isChecked)}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-medium'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-white text-xs ${
                          isChecked ? 'bg-indigo-600' : 'border border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="text-xs leading-none">
                        <span>{item.label}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">({item.pct})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TANK & STORAGE */}
        {activeTab === 'tank' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">
                Storage Tank Construction Material
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(TANK_MATERIALS).map((mat) => {
                  const isSelected = inputs.tankMaterial === mat.type;
                  return (
                    <div
                      key={mat.type}
                      onClick={() => onUpdateInput('tankMaterial', mat.type as any)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900">{mat.name}</span>
                        <span className="text-xs font-bold text-amber-700">
                          ${mat.costPerLitre}/L • {mat.durabilityYears} yrs
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mb-2">
                        Placement: <span className="font-medium text-slate-700">{mat.recommendedPlacement}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {mat.pros.map((p, i) => (
                          <span key={i} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            + {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Tank Sizing Override */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Custom Tank Capacity Override (Optional)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="Leave 0 for auto-calculated size"
                  value={inputs.customTankSizeLitres || ''}
                  onChange={(e) => onUpdateInput('customTankSizeLitres', parseFloat(e.target.value) || undefined)}
                  className="w-64 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-500">
                  {inputs.customTankSizeLitres
                    ? `Overridden to ${inputs.customTankSizeLitres.toLocaleString()} Litres`
                    : 'Auto-sizing enabled (Optimal Mass-Balance)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL & TARIFF */}
        {activeTab === 'economics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Municipal Water Tariff ($/kL)
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={inputs.waterTariffPerKL}
                  onChange={(e) => onUpdateInput('waterTariffPerKL', parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Cost per 1,000 Litres of utility water</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Filtration System Cost ($)
                </label>
                <input
                  type="number"
                  value={inputs.filtrationSystemCost}
                  onChange={(e) => onUpdateInput('filtrationSystemCost', parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">First flush diverter + sand/mesh filter</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Guttering & Piping Infrastructure ($)
                </label>
                <input
                  type="number"
                  value={inputs.gutterPipingCost}
                  onChange={(e) => onUpdateInput('gutterPipingCost', parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">PVC gutters, downspout brackets, valves</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
