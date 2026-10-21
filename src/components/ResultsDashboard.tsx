'use client';

import React from 'react';
import {
  Droplet,
  PieChart,
  Cylinder,
  TrendingUp,
  Leaf,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  Clock,
  Waves,
} from 'lucide-react';
import { CalculationInputs, CalculationResults } from '@/lib/types';
import { TANK_MATERIALS } from '@/lib/calculator';

interface ResultsDashboardProps {
  inputs: CalculationInputs;
  results: CalculationResults;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  inputs,
  results,
}) => {
  const isHighSufficiency = results.selfSufficiencyRatio >= 60;
  const isSurplus = results.selfSufficiencyRatio >= 100;
  const tankMat = TANK_MATERIALS[inputs.tankMaterial] || TANK_MATERIALS.plastic_hdpe;

  return (
    <div className="space-y-6 mb-8">
      {/* 4 Main Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Harvest Potential */}
        <div className="bg-gradient-to-br from-white to-sky-50/50 rounded-2xl border border-sky-100 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-200/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
              Harvest Potential
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-sky-500" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {results.annualHarvestPotentialKL.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-sky-700">kL/year</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {results.annualHarvestPotentialLitres.toLocaleString()} Litres annually
          </div>

          <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Daily Average:</span>
            <span className="font-bold text-slate-800">{results.dailyHarvestAverageLitres} L/day</span>
          </div>
        </div>

        {/* Card 2: Self Sufficiency */}
        <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl border border-indigo-100 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
              Self-Sufficiency Index
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {results.selfSufficiencyRatio}%
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isSurplus
                ? 'bg-emerald-100 text-emerald-800'
                : isHighSufficiency
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isSurplus ? 'Surplus' : isHighSufficiency ? 'High' : 'Moderate'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSurplus
                  ? 'bg-emerald-500'
                  : isHighSufficiency
                  ? 'bg-indigo-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, results.selfSufficiencyRatio)}%` }}
            />
          </div>

          <div className="mt-3.5 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Annual Targeted Demand:</span>
            <span className="font-bold text-slate-800">{results.annualDemandKL} kL</span>
          </div>
        </div>

        {/* Card 3: Storage Tank */}
        <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl border border-amber-100 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Optimal Storage Tank
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Cylinder className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {results.recommendedTankSizeLitres.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-amber-700">Litres</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {tankMat.name} ({tankMat.recommendedPlacement})
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Dry Autonomy:</span>
            <span className="font-bold text-slate-800 flex items-center">
              <Clock className="w-3.5 h-3.5 text-amber-600 mr-1" />
              {results.autonomyDaysWithRecommendedTank} Days
            </span>
          </div>
        </div>

        {/* Card 4: Financial ROI */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl border border-emerald-100 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Utility Savings & Payback
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${results.annualUtilitySavings.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-emerald-700">/year</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Payback Period: <span className="font-bold text-slate-800">{results.paybackPeriodYears} years</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Est. Capital Capex:</span>
            <span className="font-bold text-slate-800">${results.estimatedCapitalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Ecological & Sustainability Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-sky-950 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-emerald-200 uppercase">
              Ecological & Carbon Dividends
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              By collecting rainwater on-site, you prevent energy-intensive municipal groundwater pumping and centralized water treatment.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 shrink-0 text-right">
          <div>
            <div className="text-xs text-slate-300">Annual Water Conserved</div>
            <div className="text-lg font-bold text-emerald-300">
              {(results.waterSavedLitres / 1000).toFixed(1)} kL
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <div className="text-xs text-slate-300">Carbon Abatement</div>
            <div className="text-lg font-bold text-sky-300">
              {results.co2OffsetKgPerYear} kg CO₂/yr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
