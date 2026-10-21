'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Send,
  HelpCircle,
  RefreshCw,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import {
  CalculationInputs,
  CalculationResults,
  AIRecommendationResult,
} from '@/lib/types';

interface AIAdvisorProps {
  inputs: CalculationInputs;
  results: CalculationResults;
  aiAnalysis: AIRecommendationResult | null;
  onUpdateAnalysis: (analysis: AIRecommendationResult) => void;
  geminiApiKey: string;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  inputs,
  results,
  aiAnalysis,
  onUpdateAnalysis,
  geminiApiKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAIAnalysis = async (customQ?: string) => {
    if (customQ) {
      setQueryLoading(true);
    } else {
      setLoading(true);
    }
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs,
          results,
          apiKey: geminiApiKey || undefined,
          customQuestion: customQ || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI Request failed with status ${res.status}`);
      }

      const data: AIRecommendationResult = await res.json();
      onUpdateAnalysis(data);
      if (customQ) setCustomQuery('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to generate AI insights. Check your connection or API key.');
    } finally {
      setLoading(false);
      setQueryLoading(false);
    }
  };

  const sampleQuestions = [
    'What diameter PVC gutters and downspouts are required?',
    'How do I maintain potable safety and prevent mosquito breeding?',
    'Is a dual-tank or single underground sump better here?',
  ];

  return (
    <div className="bg-gradient-to-b from-purple-50/50 via-white to-indigo-50/40 rounded-2xl border border-purple-200/80 shadow-sm p-6 mb-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-purple-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Google Gemini AI Hydrological Advisor
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wide">
                Smart Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Generative civil engineering site assessment, filtration specs, and maintenance scheduling
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchAIAnalysis()}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Hydrology...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiAnalysis ? 'Re-Analyze with Gemini' : 'Generate AI Site Assessment'}</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Content Section */}
      {aiAnalysis ? (
        <div className="mt-6 space-y-6">
          {/* Feasibility & Executive Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 bg-white p-4 rounded-xl border border-purple-100 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Feasibility Score
              </span>
              <div className="text-4xl font-extrabold text-slate-900 my-2">
                {aiAnalysis.feasibilityScore}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {aiAnalysis.feasibilityScore >= 75 ? 'Highly Viable Site' : 'Viable with Optimization'}
              </div>
            </div>

            <div className="md:col-span-3 bg-white p-4 rounded-xl border border-purple-100 shadow-xs flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-purple-600" />
                Civil Engineering Executive Brief
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{aiAnalysis.summary}</p>
            </div>
          </div>

          {/* Key Insights & Storage Optimization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center">
                <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                Key Hydrological Insights
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {aiAnalysis.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
                Tank & Placement Strategy
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {aiAnalysis.tankOptimizationNote}
              </p>
              <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100 text-[11px] text-sky-800">
                <strong>Groundwater Recharge:</strong> {aiAnalysis.groundwaterRechargeAdvice}
              </div>
            </div>
          </div>

          {/* Recommended Filtration System */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Recommended Filtration Hierarchy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiAnalysis.recommendedFilters.map((filter, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900">{filter.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        filter.priority === 'Essential'
                          ? 'bg-rose-100 text-rose-700'
                          : filter.priority === 'Recommended'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {filter.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{filter.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Protocol & Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Preventative Maintenance Protocol
              </h4>
              <div className="space-y-3">
                {aiAnalysis.maintenanceChecklist.map((m, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-slate-700 block mb-1">
                      {m.frequency}:
                    </span>
                    <ul className="space-y-1 pl-3 text-slate-500 text-[11px] list-disc">
                      {m.tasks.map((t, tidx) => (
                        <li key={tidx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center">
                <BadgeAlert className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Regulatory & Vector Safety Standards
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {aiAnalysis.regulatoryComplianceTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Custom Question Answer if present */}
          {aiAnalysis.customAnswer && (
            <div className="bg-purple-100/50 border border-purple-200 rounded-xl p-4 text-xs">
              <span className="font-bold text-purple-900 block mb-1">Gemini Engineering Response:</span>
              <p className="text-slate-800 leading-relaxed">{aiAnalysis.customAnswer}</p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-6 py-8 px-4 text-center bg-white/70 rounded-xl border border-dashed border-purple-200">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
          <h4 className="text-sm font-semibold text-slate-800">
            AI Civil Hydrology Advisor is Ready
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Click &quot;Generate AI Site Assessment&quot; above to have Google Gemini evaluate your roof runoff, calculate site feasibility, propose filtration equipment, and build a maintenance schedule.
          </p>
          <button
            onClick={() => fetchAIAnalysis()}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Now</span>
          </button>
        </div>
      )}

      {/* Interactive "Ask Gemini AI" Query Bar */}
      <div className="mt-6 pt-5 border-t border-purple-100">
        <div className="flex items-center space-x-1.5 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-xs font-bold text-slate-800">
            Ask Gemini AI Site-Specific Questions:
          </span>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setCustomQuery(q);
                fetchAIAnalysis(q);
              }}
              className="text-[11px] bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-lg px-2.5 py-1 transition-colors text-left"
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customQuery.trim()) {
                fetchAIAnalysis(customQuery.trim());
              }
            }}
            placeholder="Ask anything (e.g. Can I use bamboo gutters? What about solar pump sizing?)..."
            className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 outline-none"
          />
          <button
            onClick={() => {
              if (customQuery.trim()) {
                fetchAIAnalysis(customQuery.trim());
              }
            }}
            disabled={queryLoading || !customQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-40 transition-colors shrink-0"
          >
            {queryLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
