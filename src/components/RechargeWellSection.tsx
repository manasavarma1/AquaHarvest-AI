'use client';

import React, { useState } from 'react';
import {
  Compass,
  Layers,
  ArrowDownCircle,
  Shield,
  Info,
  Maximize2,
  CheckCircle,
} from 'lucide-react';
import { CalculationInputs, CalculationResults } from '@/lib/types';

interface RechargeWellSectionProps {
  inputs: CalculationInputs;
  results: CalculationResults;
}

export const RechargeWellSection: React.FC<RechargeWellSectionProps> = ({
  inputs,
  results,
}) => {
  const [soilType, setSoilType] = useState<'sandy' | 'silty_loam' | 'clay' | 'laterite'>('silty_loam');

  const soilData = {
    sandy: { name: 'Sandy / Gravelly Soil', percolationRateMmHr: 45, suitability: 'Excellent' },
    silty_loam: { name: 'Silty Loam Soil', percolationRateMmHr: 22, suitability: 'Good' },
    laterite: { name: 'Laterite / Porous Rock', percolationRateMmHr: 28, suitability: 'Very Good' },
    clay: { name: 'Dense Clay / Impermeable', percolationRateMmHr: 5, suitability: 'Poor (Use Storage Tank)' },
  };

  const selectedSoil = soilData[soilType];
  const pit = results.rechargeWellRecommendation;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Artificial Aquifer Recharge & Percolation Pit Sizing
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              Groundwater Restoration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Civil engineering sizing for divertible surplus storm runoff to replenish depleting subterranean water tables
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* Left Column: Soil Selector & Specs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Site Soil Classification & Infiltration Capacity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(soilData) as (keyof typeof soilData)[]).map((key) => {
                const isSelected = soilType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSoilType(key)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>{soilData[key].name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Rate: {soilData[key].percolationRateMmHr} mm/hr
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-900">Percolation Suitability:</span>
              <span className="font-extrabold text-emerald-700">{selectedSoil.suitability}</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Estimated infiltration recharge rate:{' '}
              <strong>{(pit.rechargeRateLPerHour * (selectedSoil.percolationRateMmHr / 22)).toFixed(0)} L/hour</strong> during peak storm events.
            </p>
          </div>
        </div>

        {/* Center Column: Pit Dimensions */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3">
              Recommended Civil Pit Sizing
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-600">Pit Diameter ($\phi$):</span>
                <span className="font-bold text-slate-900">{pit.diameterMeters} meters</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-600">Effective Depth ($h$):</span>
                <span className="font-bold text-slate-900">{pit.depthMeters} meters</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-600">Instant Retention Volume:</span>
                <span className="font-bold text-emerald-700">
                  {pit.capacityLitres.toLocaleString()} Litres ({(pit.capacityLitres / 1000).toFixed(1)} m³)
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 mt-4 flex items-center">
            <Info className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-400" />
            Designed for 25 mm/hr peak torrential downpour retention to prevent urban waterlogging.
          </div>
        </div>

        {/* Right Column: Inverted Filter Bed Cross-Section */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3">
            Inverted Gravel Filter Bed Layers
          </span>

          <div className="space-y-2 text-xs">
            <div className="bg-amber-100/70 border border-amber-200 p-2 rounded-lg">
              <div className="font-bold text-amber-900 text-[11px]">Top Layer: Coarse River Sand (0.5m)</div>
              <div className="text-[10px] text-amber-800">Traps microscopic dust and suspended silt.</div>
            </div>

            <div className="bg-slate-200/80 border border-slate-300 p-2 rounded-lg">
              <div className="font-bold text-slate-800 text-[11px]">Middle Layer: Pea Gravel 10-20mm (0.5m)</div>
              <div className="text-[10px] text-slate-600">Intermediate hydraulic diffusion buffer.</div>
            </div>

            <div className="bg-slate-300/80 border border-slate-400 p-2 rounded-lg">
              <div className="font-bold text-slate-900 text-[11px]">Bottom Layer: Boulders / Crushed Stone 40-60mm (0.8m)</div>
              <div className="text-[10px] text-slate-700">Provides high-void storage and directs water into subsoil stratum.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
