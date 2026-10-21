'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Key,
  ExternalLink,
  CheckCircle2,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface GeminiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const GeminiConfigModal: React.FC<GeminiConfigModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  currentKey,
}) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Google Gemini AI Configuration</h3>
              <p className="text-[11px] text-slate-500">Autonomous civil engineering intelligence & advice</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 font-mono text-[11px]"
              />
              <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 flex items-center">
              <Shield className="w-3 h-3 text-emerald-600 mr-1 shrink-0" />
              Stored strictly on your local browser session or via environment variable.
            </p>
          </div>

          <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-purple-900">
            <div className="font-bold text-[11px] mb-1">Don&apos;t have an API key?</div>
            <p className="text-[10px] text-purple-800 leading-relaxed mb-2">
              You can get a free Google Gemini API key in less than a minute from Google AI Studio. Note that if no key is entered, the app seamlessly provides realistic built-in hydrological engineering intelligence!
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              setApiKey('');
              onSaveKey('');
            }}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Clear Key
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center space-x-1"
            >
              {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{saved ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
