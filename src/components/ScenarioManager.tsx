'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  TrendingUp,
  Layers,
  Cylinder,
  CheckCircle,
} from 'lucide-react';
import { SavedProject, CalculationInputs, CalculationResults } from '@/lib/types';
import { calculateRWH } from '@/lib/calculator';

interface ScenarioManagerProps {
  currentProject: SavedProject;
  savedProjects: SavedProject[];
  onSelectProject: (project: SavedProject) => void;
  onSaveAsNewScenario: (name: string) => void;
  onDeleteProject: (id: string) => void;
}

export const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  currentProject,
  savedProjects,
  onSelectProject,
  onSaveAsNewScenario,
  onDeleteProject,
}) => {
  const [newScenarioName, setNewScenarioName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreate = () => {
    if (newScenarioName.trim()) {
      onSaveAsNewScenario(newScenarioName.trim());
      setNewScenarioName('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-sky-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Project Scenarios & Multi-Design Comparisons
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test and contrast design alternatives (e.g. Roof Only vs Extended Paved Surface, Tank Upgrades)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save As New Scenario</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Scenario Name (e.g. Option B: High-Capacity Tank)..."
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleCreate}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Scenarios Grid / Comparison Table */}
      {savedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {savedProjects.map((proj) => {
            const isActive = proj.id === currentProject.id;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/60 shadow-xs ring-1 ring-sky-400'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                    {proj.name}
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 mb-3 truncate">
                  {proj.location} • {proj.inputs.propertyType.replace('_', ' ')}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-100/70 p-2.5 rounded-lg mb-3">
                  <div>
                    <span className="text-slate-500 block">Harvest Yield:</span>
                    <span className="font-bold text-slate-800">
                      {proj.results.annualHarvestPotentialKL} kL/yr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sufficiency:</span>
                    <span className="font-bold text-sky-700">
                      {proj.results.selfSufficiencyRatio}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tank Size:</span>
                    <span className="font-bold text-slate-800">
                      {proj.results.recommendedTankSizeLitres.toLocaleString()} L
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payback:</span>
                    <span className="font-bold text-emerald-700">
                      {proj.results.paybackPeriodYears} yrs
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-slate-400">
                    Updated {new Date(proj.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete Scenario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-500">
          No saved scenarios yet. Use &ldquo;Save As New Scenario&rdquo; to compare alternative configurations.
        </div>
      )}
    </div>
  );
};
