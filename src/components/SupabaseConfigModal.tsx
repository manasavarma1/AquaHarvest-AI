'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  Copy,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionSuccess: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConnectionSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(localStorage.getItem('rwh_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || '');
      setAnonKey(localStorage.getItem('rwh_supabase_anon_key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: 'Please enter both Supabase URL and Anon Key.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const client = createClient(url.trim(), anonKey.trim());
      // Quick ping query
      const { data, error } = await client.from('rwh_projects').select('count', { count: 'exact', head: true });

      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, let's inform the user to run SQL
        if (error.message.includes('relation "public.rwh_projects" does not exist')) {
          setTestResult({
            success: true,
            message: 'Connected to Supabase! However, the "rwh_projects" table is missing. Copy and run the SQL schema below in your Supabase SQL Editor.',
          });
        } else {
          throw error;
        }
      } else {
        setTestResult({ success: true, message: 'Connection successful! Database is online and synchronized.' });
      }

      // Persist in localStorage
      localStorage.setItem('rwh_supabase_url', url.trim());
      localStorage.setItem('rwh_supabase_anon_key', anonKey.trim());
      onConnectionSuccess();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to authenticate with Supabase. Check your URL and anon key.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('rwh_supabase_url');
    localStorage.removeItem('rwh_supabase_anon_key');
    setUrl('');
    setAnonKey('');
    setTestResult({ success: true, message: 'Reverted to local offline persistence mode.' });
    onConnectionSuccess();
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Supabase Database Configuration</h3>
              <p className="text-[11px] text-slate-500">Cloud persistence for multi-device sync and real-time history</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Supabase Anon Public Key (API Key)
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <span className="leading-snug">{testResult.message}</span>
            </div>
          )}

          {/* SQL Schema helper */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700 text-[11px]">Database Table SQL Schema</span>
              <button
                onClick={handleCopySchema}
                className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                {copiedSchema ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSchema ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mb-2">
              Run this in your Supabase project&apos;s SQL Editor to create the <code>rwh_projects</code> table with RLS.
            </p>
            <pre className="text-[9px] bg-slate-900 text-slate-200 p-2 rounded overflow-x-auto max-h-24">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Clear / Offline Mode
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={handleTestAndSave}
              disabled={testing}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1"
            >
              {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{testing ? 'Testing...' : 'Test & Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
