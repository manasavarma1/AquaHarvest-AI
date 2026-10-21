'use client';

import React from 'react';
import {
  Printer,
  Download,
  X,
  Droplets,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  CalculationInputs,
  CalculationResults,
  AIRecommendationResult,
} from '@/lib/types';
import { ROOF_MATERIALS, TANK_MATERIALS } from '@/lib/calculator';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculationInputs;
  results: CalculationResults;
  aiAnalysis: AIRecommendationResult | null;
  onExportCSV: () => void;
  onPrint: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
  aiAnalysis,
  onExportCSV,
  onPrint,
}) => {
  if (!isOpen) return null;

  const roofMat = ROOF_MATERIALS[inputs.roofMaterial] || ROOF_MATERIALS.concrete_rcc;
  const tankMat = TANK_MATERIALS[inputs.tankMaterial] || TANK_MATERIALS.plastic_hdpe;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-800 text-sm">
              Engineering Assessment & Feasibility Report Preview
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExportCSV}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white" id="printable-report">
          {/* Header */}
          <div className="border-b-2 border-sky-600 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-6 h-6 text-sky-600" />
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  AquaHarvest.AI
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive Rainwater Harvesting & Stormwater Sizing Report
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div className="font-semibold text-slate-700">Project Ref: #{inputs.projectName.replace(/\s+/g, '-').slice(0, 16)}</div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-900 mb-2">
              1. Project & Catchment Site Profile
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Project Name:</span>
                <span className="font-bold text-slate-800">{inputs.projectName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="font-bold text-slate-800">{inputs.locationName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Property Classification:</span>
                <span className="font-bold text-slate-800">{inputs.propertyType.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Catchment Footprint:</span>
                <span className="font-bold text-slate-800">{inputs.catchmentAreaSqM} m²</span>
              </div>
              <div>
                <span className="text-slate-500 block">Roof Material & Runoff Coeff:</span>
                <span className="font-bold text-slate-800">{roofMat.name} (Cr = {roofMat.runoffCoefficient})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Filter Efficiency:</span>
                <span className="font-bold text-slate-800">{(inputs.filterEfficiency * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Annual Precipitation:</span>
                <span className="font-bold text-slate-800">{inputs.annualRainfallMm} mm/year</span>
              </div>
              <div>
                <span className="text-slate-500 block">Occupants / Users:</span>
                <span className="font-bold text-slate-800">{inputs.numberOfOccupants} persons</span>
              </div>
              <div>
                <span className="text-slate-500 block">Daily Target LPCD:</span>
                <span className="font-bold text-slate-800">{inputs.lpcd} L/person/day</span>
              </div>
            </div>
          </div>

          {/* Core Hydrological Outputs */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-900 mb-2">
              2. Hydrological Modeling & Volumetric Yield
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl">
                <span className="text-sky-800 block font-medium">Harvestable Yield:</span>
                <span className="text-base font-bold text-sky-950 mt-1 block">
                  {results.annualHarvestPotentialKL.toLocaleString()} kL/yr
                </span>
                <span className="text-[10px] text-sky-700">({results.annualHarvestPotentialLitres.toLocaleString()} L)</span>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
                <span className="text-indigo-800 block font-medium">Annual Targeted Demand:</span>
                <span className="text-base font-bold text-indigo-950 mt-1 block">
                  {results.annualDemandKL.toLocaleString()} kL/yr
                </span>
                <span className="text-[10px] text-indigo-700">({results.dailyDemandLitres} L/day)</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <span className="text-emerald-800 block font-medium">Self-Sufficiency Index:</span>
                <span className="text-base font-bold text-emerald-950 mt-1 block">
                  {results.selfSufficiencyRatio}%
                </span>
                <span className="text-[10px] text-emerald-700">Target demand covered</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <span className="text-amber-800 block font-medium">Recommended Storage:</span>
                <span className="text-base font-bold text-amber-950 mt-1 block">
                  {results.recommendedTankSizeLitres.toLocaleString()} Litres
                </span>
                <span className="text-[10px] text-amber-700">{results.autonomyDaysWithRecommendedTank} days autonomy</span>
              </div>
            </div>
          </div>

          {/* Financial ROI */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-900 mb-2">
              3. Financial Cost-Benefit & Ecological Analysis
            </h2>
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Est. Capital Investment:</span>
                <span className="font-bold text-slate-800">${results.estimatedCapitalCost.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">(Tank + Filter + Guttering)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Annual Utility Savings:</span>
                <span className="font-bold text-emerald-700">${results.annualUtilitySavings.toLocaleString()}/year</span>
                <span className="text-[10px] text-slate-400 block">(Tariff: ${inputs.waterTariffPerKL}/kL)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Payback Horizon:</span>
                <span className="font-bold text-slate-800">{results.paybackPeriodYears} Years</span>
                <span className="text-[10px] text-slate-400 block">CO2 saved: {results.co2OffsetKgPerYear} kg/yr</span>
              </div>
            </div>
          </div>

          {/* AI Insights if available */}
          {aiAnalysis && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-900 mb-2">
                4. Google Gemini AI Engineering Assessment
              </h2>
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-2">
                <p className="font-medium text-purple-950">{aiAnalysis.summary}</p>
                <div className="pt-2 border-t border-purple-200/60">
                  <span className="font-bold text-purple-900 block mb-1">Key Directives:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-purple-900 text-[11px]">
                    {aiAnalysis.keyInsights.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Aquifer recharge note */}
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between">
            <span>AquaHarvest AI Civil Hydrology Engine</span>
            <span>Formula standard: BS 8515 / NBC 2016 Rainwater Harvesting</span>
          </div>
        </div>
      </div>
    </div>
  );
};
