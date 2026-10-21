'use client';

import React from 'react';
import {
  Droplets,
  Database,
  Sparkles,
  Download,
  Printer,
  Save,
  CheckCircle2,
  FolderGit2,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  isCloudConnected: boolean;
  onOpenSupabaseModal: () => void;
  onOpenGeminiModal: () => void;
  onSaveProject: () => void;
  onExportCSV: () => void;
  onPrintReport: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  hasGeminiKey: boolean;
  activeScenarioName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isCloudConnected,
  onOpenSupabaseModal,
  onOpenGeminiModal,
  onSaveProject,
  onExportCSV,
  onPrintReport,
  isSaving,
  saveSuccess,
  hasGeminiKey,
  activeScenarioName,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-400/20">
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
                AquaHarvest<span className="text-sky-600">.AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Hydrological Sizing • Water Balance • Gemini Optimization
            </p>
          </div>
        </div>

        {/* Center / Scenario Display */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
          <FolderGit2 className="w-3.5 h-3.5 text-sky-600" />
          <span className="font-medium text-slate-500">Active Scenario:</span>
          <span className="font-semibold text-slate-900 max-w-[180px] truncate">{activeScenarioName}</span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabaseModal}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isCloudConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Configure Supabase Cloud Database"
          >
            <Database className={`w-3.5 h-3.5 ${isCloudConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {isCloudConnected ? 'Supabase Sync' : 'Local Persistence'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          </button>

          {/* Gemini AI Status Pill */}
          <button
            onClick={onOpenGeminiModal}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              hasGeminiKey
                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
            title="Configure Google Gemini API"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">
              {hasGeminiKey ? 'Gemini Pro' : 'AI Advisor'}
            </span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
            title="Download full project data as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">CSV</span>
          </button>

          {/* Print / Report */}
          <button
            onClick={onPrintReport}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
            title="Print or export PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Print / PDF</span>
          </button>

          {/* Save Button */}
          <button
            onClick={onSaveProject}
            disabled={isSaving}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              saveSuccess
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-sky-600 text-white hover:bg-sky-700 active:scale-95'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
