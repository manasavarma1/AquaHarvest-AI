'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProjectOverview } from '@/components/ProjectOverview';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { WaterBalanceChart } from '@/components/WaterBalanceChart';
import { CalculatorForm } from '@/components/CalculatorForm';
import { AIAdvisor } from '@/components/AIAdvisor';
import { RechargeWellSection } from '@/components/RechargeWellSection';
import { ScenarioManager } from '@/components/ScenarioManager';
import { SupabaseConfigModal } from '@/components/SupabaseConfigModal';
import { GeminiConfigModal } from '@/components/GeminiConfigModal';
import { ExportReportModal } from '@/components/ExportReportModal';

import {
  CalculationInputs,
  CalculationResults,
  SavedProject,
  AIRecommendationResult,
} from '@/lib/types';
import {
  calculateRWH,
  DEFAULT_INPUTS,
  REGIONAL_PRESETS,
} from '@/lib/calculator';
import {
  fetchAllProjects,
  persistProject,
  removeProject,
  getSupabaseClient,
} from '@/lib/supabase';
import { exportToCSV, printProjectReport } from '@/lib/export';
import { generateFallbackAIReport } from '@/lib/gemini';

export default function HomePage() {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);
  const [aiAnalysis, setAiAnalysis] = useState<AIRecommendationResult | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('default-project');
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  
  // Modals
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [showGeminiModal, setShowGeminiModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // States
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Hydrological calculations are calculated synchronously on any input change
  const results: CalculationResults = useMemo(() => {
    return calculateRWH(inputs);
  }, [inputs]);

  // Initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('rwh_gemini_key') || '';
      setGeminiApiKey(storedKey);

      // Check Supabase connection
      const client = getSupabaseClient();
      setIsCloudConnected(!!client);

      // Load saved projects
      fetchAllProjects().then(({ projects, isCloud }) => {
        setIsCloudConnected(isCloud);
        if (projects.length > 0) {
          setSavedProjects(projects);
          const first = projects[0];
          setActiveProjectId(first.id);
          setInputs(first.inputs);
          if (first.ai_analysis) setAiAnalysis(first.ai_analysis);
        } else {
          // Initialize with default project
          const initialProject: SavedProject = {
            id: 'default-project',
            name: DEFAULT_INPUTS.projectName,
            location: DEFAULT_INPUTS.locationName,
            inputs: DEFAULT_INPUTS,
            results: calculateRWH(DEFAULT_INPUTS),
            ai_analysis: generateFallbackAIReport(DEFAULT_INPUTS, calculateRWH(DEFAULT_INPUTS)),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'draft',
          };
          setSavedProjects([initialProject]);
          setAiAnalysis(initialProject.ai_analysis || null);
        }
      });
    }
  }, []);

  // Update a single input field
  const handleUpdateInput = <K extends keyof CalculationInputs>(field: K, value: CalculationInputs[K]) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update single month rainfall
  const handleUpdateMonthlyRain = (monthIdx: number, val: number) => {
    setInputs((prev) => {
      const arr = [...prev.monthlyRainfallDistribution];
      arr[monthIdx] = val;
      const sum = arr.reduce((a, b) => a + b, 0);
      return {
        ...prev,
        monthlyRainfallDistribution: arr,
        annualRainfallMm: sum,
      };
    });
  };

  // Update demand segregation
  const handleUpdateDemandUse = (key: keyof CalculationInputs['demandUses'], val: boolean) => {
    setInputs((prev) => ({
      ...prev,
      demandUses: {
        ...prev.demandUses,
        [key]: val,
      },
    }));
  };

  // Apply regional preset
  const handleApplyPreset = (presetIndex: number) => {
    const preset = REGIONAL_PRESETS[presetIndex];
    if (!preset) return;

    setInputs((prev) => ({
      ...prev,
      locationName: preset.name,
      annualRainfallMm: preset.annualRainfallMm,
      monthlyRainfallDistribution: [...preset.monthlyDistribution],
      lpcd: preset.defaultLPCD,
      dryPeriodDays: preset.dryPeriodDays,
    }));
  };

  // Reset to default
  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setAiAnalysis(null);
  };

  // Save current project state
  const handleSaveProject = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const projectToSave: SavedProject = {
      id: activeProjectId.startsWith('default-') ? crypto.randomUUID() : activeProjectId,
      name: inputs.projectName,
      location: inputs.locationName,
      inputs,
      results,
      ai_analysis: aiAnalysis,
      status: 'analyzed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { isCloud, id } = await persistProject(projectToSave);
    setIsCloudConnected(isCloud);
    setActiveProjectId(id);

    // Refresh projects list
    const { projects } = await fetchAllProjects();
    setSavedProjects(projects);

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Save as new scenario
  const handleSaveAsNewScenario = async (name: string) => {
    setIsSaving(true);
    const newId = crypto.randomUUID();
    const newInputs = { ...inputs, projectName: name };
    const newResults = calculateRWH(newInputs);

    const newProject: SavedProject = {
      id: newId,
      name,
      location: inputs.locationName,
      inputs: newInputs,
      results: newResults,
      ai_analysis: aiAnalysis,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await persistProject(newProject);
    const { projects } = await fetchAllProjects();
    setSavedProjects(projects);
    setActiveProjectId(newId);
    setInputs(newInputs);
    setIsSaving(false);
  };

  // Select project from scenario list
  const handleSelectProject = (proj: SavedProject) => {
    setActiveProjectId(proj.id);
    setInputs(proj.inputs);
    setAiAnalysis(proj.ai_analysis || null);
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    await removeProject(id);
    const { projects } = await fetchAllProjects();
    setSavedProjects(projects);
    if (activeProjectId === id && projects.length > 0) {
      handleSelectProject(projects[0]);
    }
  };

  // Save custom Gemini key
  const handleSaveGeminiKey = (key: string) => {
    setGeminiApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('rwh_gemini_key', key);
      } else {
        localStorage.removeItem('rwh_gemini_key');
      }
    }
  };

  const currentProjectObj = useMemo(() => {
    return (
      savedProjects.find((p) => p.id === activeProjectId) || {
        id: activeProjectId,
        name: inputs.projectName,
        location: inputs.locationName,
        inputs,
        results,
        ai_analysis: aiAnalysis,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'draft' as const,
      }
    );
  }, [savedProjects, activeProjectId, inputs, results, aiAnalysis]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Navigation */}
      <Navbar
        isCloudConnected={isCloudConnected}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        onOpenGeminiModal={() => setShowGeminiModal(true)}
        onSaveProject={handleSaveProject}
        onExportCSV={() => exportToCSV(inputs, results)}
        onPrintReport={() => setShowExportModal(true)}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        hasGeminiKey={!!geminiApiKey}
        activeScenarioName={inputs.projectName}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Project Header Overview */}
        <ProjectOverview
          inputs={inputs}
          results={results}
          onUpdateInput={handleUpdateInput}
          onApplyPreset={handleApplyPreset}
          onReset={handleReset}
        />

        {/* Real-time KPI Results Dashboard */}
        <ResultsDashboard inputs={inputs} results={results} />

        {/* Interactive Hydrological Water Balance Simulation Chart */}
        <WaterBalanceChart
          monthlyData={results.monthlyBreakdown}
          tankCapacityLitres={results.recommendedTankSizeLitres}
        />

        {/* Core Multi-Tab Calculator Configuration Form */}
        <CalculatorForm
          inputs={inputs}
          onUpdateInput={handleUpdateInput}
          onUpdateMonthlyRain={handleUpdateMonthlyRain}
          onUpdateDemandUse={handleUpdateDemandUse}
        />

        {/* Google Gemini AI Advisor Section */}
        <AIAdvisor
          inputs={inputs}
          results={results}
          aiAnalysis={aiAnalysis}
          onUpdateAnalysis={setAiAnalysis}
          geminiApiKey={geminiApiKey}
        />

        {/* Artificial Aquifer Recharge Section */}
        <RechargeWellSection inputs={inputs} results={results} />

        {/* Scenario Manager & Multi-Design Comparisons */}
        <ScenarioManager
          currentProject={currentProjectObj}
          savedProjects={savedProjects}
          onSelectProject={handleSelectProject}
          onSaveAsNewScenario={handleSaveAsNewScenario}
          onDeleteProject={handleDeleteProject}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500 text-center no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            AquaHarvest AI • Advanced Rainwater Harvesting Calculator & Hydrological Optimizer
          </div>
          <div className="text-slate-400">
            Powered by Next.js 14, Tailwind CSS, Supabase Persistence & Google Gemini API
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        onConnectionSuccess={() => {
          const client = getSupabaseClient();
          setIsCloudConnected(!!client);
          fetchAllProjects().then(({ projects, isCloud }) => {
            setIsCloudConnected(isCloud);
            if (projects.length > 0) setSavedProjects(projects);
          });
        }}
      />

      <GeminiConfigModal
        isOpen={showGeminiModal}
        onClose={() => setShowGeminiModal(false)}
        onSaveKey={handleSaveGeminiKey}
        currentKey={geminiApiKey}
      />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        inputs={inputs}
        results={results}
        aiAnalysis={aiAnalysis}
        onExportCSV={() => exportToCSV(inputs, results)}
        onPrint={() => printProjectReport()}
      />
    </div>
  );
}
