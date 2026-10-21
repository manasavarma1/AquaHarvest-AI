import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SavedProject } from './types';

// Default demo keys or environment variables
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Allow client-side runtime configuration via LocalStorage
if (typeof window !== 'undefined') {
  const localUrl = localStorage.getItem('rwh_supabase_url');
  const localKey = localStorage.getItem('rwh_supabase_anon_key');
  if (localUrl) supabaseUrl = localUrl;
  if (localKey) supabaseAnonKey = localKey;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('rwh_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const localKey = localStorage.getItem('rwh_supabase_anon_key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (localUrl && localKey && localUrl.startsWith('http')) {
      try {
        return createClient(localUrl, localKey);
      } catch (err) {
        console.warn('Invalid Supabase configuration:', err);
        return null;
      }
    }
  } else if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    try {
      return createClient(supabaseUrl, supabaseAnonKey);
    } catch {
      return null;
    }
  }
  return null;
}

export const SUPABASE_SQL_SCHEMA = `-- SQL Schema for Rainwater Harvesting Projects Table
create table if not exists public.rwh_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  property_type text default 'residential',
  inputs jsonb not null,
  results jsonb not null,
  ai_analysis jsonb,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.rwh_projects enable row level security;

-- Allow public read/write for demo/community usage (or adjust to auth.uid())
create policy "Allow public access to rwh_projects"
  on public.rwh_projects
  for all
  using (true)
  with check (true);
`;

const LOCAL_STORAGE_KEY = 'rwh_calculator_saved_projects_v1';

export async function fetchAllProjects(): Promise<{ projects: SavedProject[]; isCloud: boolean }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rwh_projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        const mapped: SavedProject[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          location: item.location,
          inputs: item.inputs,
          results: item.results,
          ai_analysis: item.ai_analysis,
          status: item.status || 'draft',
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        return { projects: mapped, isCloud: true };
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase, falling back to local storage', err);
    }
  }

  // Fallback to local storage
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const parsed: SavedProject[] = JSON.parse(raw);
        return { projects: parsed, isCloud: false };
      } catch {}
    }
  }
  return { projects: [], isCloud: false };
}

export async function persistProject(project: SavedProject): Promise<{ success: boolean; isCloud: boolean; id: string }> {
  const supabase = getSupabaseClient();
  let savedId = project.id;
  let isCloud = false;

  if (supabase) {
    try {
      const payload = {
        name: project.name,
        location: project.location,
        property_type: project.inputs.propertyType,
        inputs: project.inputs,
        results: project.results,
        ai_analysis: project.ai_analysis || null,
        status: project.status,
        updated_at: new Date().toISOString(),
      };

      // Check if project exists by id
      const { data, error } = await supabase
        .from('rwh_projects')
        .upsert((project.id ? { id: project.id, ...payload } : payload) as any)
        .select()
        .single();

      if (!error && data) {
        savedId = data.id;
        isCloud = true;
      }
    } catch (err) {
      console.warn('Supabase save failed, storing locally', err);
    }
  }

  // Always mirror in localStorage for offline resilience
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: SavedProject[] = raw ? JSON.parse(raw) : [];
      const updatedProject = { ...project, id: savedId, updated_at: new Date().toISOString() };
      const existingIdx = list.findIndex(p => p.id === savedId);
      if (existingIdx >= 0) {
        list[existingIdx] = updatedProject;
      } else {
        list.unshift(updatedProject);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }

  return { success: true, isCloud, id: savedId };
}

export async function removeProject(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('rwh_projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        let list: SavedProject[] = JSON.parse(raw);
        list = list.filter(p => p.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
  }
  return true;
}
