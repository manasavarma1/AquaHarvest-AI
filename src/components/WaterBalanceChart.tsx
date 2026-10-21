'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Table as TableIcon,
  CloudRain,
  Droplet,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { MonthlyData } from '@/lib/types';

interface WaterBalanceChartProps {
  monthlyData: MonthlyData[];
  tankCapacityLitres: number;
}

export const WaterBalanceChart: React.FC<WaterBalanceChartProps> = ({
  monthlyData,
  tankCapacityLitres,
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Maximum value for scaling the SVG chart bars
  const maxVolume = Math.max(
    ...monthlyData.map((m) => Math.max(m.harvestedLitres, m.demandLitres, m.storedLitres, m.overflowLitres)),
    tankCapacityLitres,
    1000
  );

  const maxRain = Math.max(...monthlyData.map((m) => m.rainfallMm), 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Monthly Hydrological Water Balance
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-medium">
              Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic mass balance: Harvested Inflow vs Occupant Demand vs Storage Level & Overflow
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'chart'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
            <span>Chart</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-slate-600" />
            <span>Data Table</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 my-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-sm bg-sky-500" />
          <span>Harvested Inflow (L)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-400" />
          <span>Demand Required (L)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span>Stored Volume (L)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400" />
          <span>Overflow / Recharge (L)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-1 bg-sky-700" />
          <span>Rainfall (mm)</span>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="relative pt-6 pb-2">
          {/* Main Visual Column Chart */}
          <div className="grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-64 border-b border-slate-200 px-1">
            {monthlyData.map((m, idx) => {
              const harvestHeight = (m.harvestedLitres / maxVolume) * 100;
              const demandHeight = (m.demandLitres / maxVolume) * 100;
              const storedHeight = (m.storedLitres / maxVolume) * 100;
              const overflowHeight = (m.overflowLitres / maxVolume) * 100;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={m.month}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex flex-col items-center h-full justify-end relative group cursor-pointer"
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-3 z-30 bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs w-48 pointer-events-none -left-16 sm:-left-12">
                      <div className="font-bold border-b border-slate-700 pb-1 mb-1.5 flex justify-between">
                        <span>{m.month} Summary</span>
                        <span className="text-sky-400">{m.rainfallMm} mm rain</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between text-sky-300">
                          <span>Harvested:</span>
                          <span className="font-semibold">{m.harvestedLitres.toLocaleString()} L</span>
                        </div>
                        <div className="flex justify-between text-indigo-300">
                          <span>Demand:</span>
                          <span className="font-semibold">{m.demandLitres.toLocaleString()} L</span>
                        </div>
                        <div className="flex justify-between text-emerald-300">
                          <span>Storage Level:</span>
                          <span className="font-semibold">{m.storedLitres.toLocaleString()} L</span>
                        </div>
                        {m.overflowLitres > 0 && (
                          <div className="flex justify-between text-amber-300">
                            <span>Overflow Spill:</span>
                            <span className="font-semibold">{m.overflowLitres.toLocaleString()} L</span>
                          </div>
                        )}
                        {m.deficitLitres > 0 && (
                          <div className="flex justify-between text-rose-300">
                            <span>Municipal Top-up:</span>
                            <span className="font-semibold">{m.deficitLitres.toLocaleString()} L</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Multiple Bar Columns in slot */}
                  <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full pb-1">
                    {/* Harvest Bar */}
                    <div
                      className="w-1.5 sm:w-2.5 bg-sky-500 rounded-t transition-all group-hover:brightness-110"
                      style={{ height: `${Math.max(2, harvestHeight)}%` }}
                    />
                    {/* Demand Bar */}
                    <div
                      className="w-1.5 sm:w-2.5 bg-indigo-400 rounded-t transition-all group-hover:brightness-110"
                      style={{ height: `${Math.max(2, demandHeight)}%` }}
                    />
                    {/* Stored Bar */}
                    <div
                      className="w-1.5 sm:w-2.5 bg-emerald-500 rounded-t transition-all group-hover:brightness-110"
                      style={{ height: `${Math.max(2, storedHeight)}%` }}
                    />
                    {/* Overflow Bar */}
                    {overflowHeight > 0 && (
                      <div
                        className="w-1.5 sm:w-2.5 bg-amber-400 rounded-t transition-all group-hover:brightness-110"
                        style={{ height: `${Math.max(2, overflowHeight)}%` }}
                      />
                    )}
                  </div>

                  {/* Month Label */}
                  <span className={`text-[10px] sm:text-xs font-semibold mt-2 transition-colors ${
                    isHovered ? 'text-sky-700 font-bold' : 'text-slate-600'
                  }`}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            Hover over any monthly column to reveal detailed volumetric balance and overflow metrics.
          </p>
        </div>
      ) : (
        /* Data Table Mode */
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-2.5 px-3 font-semibold">Month</th>
                <th className="py-2.5 px-3 font-semibold">Rainfall</th>
                <th className="py-2.5 px-3 font-semibold">Harvest Inflow</th>
                <th className="py-2.5 px-3 font-semibold">Demand</th>
                <th className="py-2.5 px-3 font-semibold">Stored Volume</th>
                <th className="py-2.5 px-3 font-semibold">Overflow Spill</th>
                <th className="py-2.5 px-3 font-semibold">Deficit Need</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyData.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-3 font-bold text-slate-800">{m.month}</td>
                  <td className="py-2 px-3 text-slate-600">{m.rainfallMm} mm</td>
                  <td className="py-2 px-3 font-medium text-sky-700">{m.harvestedLitres.toLocaleString()} L</td>
                  <td className="py-2 px-3 text-indigo-700">{m.demandLitres.toLocaleString()} L</td>
                  <td className="py-2 px-3 font-medium text-emerald-700">{m.storedLitres.toLocaleString()} L</td>
                  <td className="py-2 px-3 text-amber-700">
                    {m.overflowLitres > 0 ? `${m.overflowLitres.toLocaleString()} L` : '—'}
                  </td>
                  <td className="py-2 px-3 text-rose-600">
                    {m.deficitLitres > 0 ? `${m.deficitLitres.toLocaleString()} L` : '0 L (Covered)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
