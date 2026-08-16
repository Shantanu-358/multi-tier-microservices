import React, { useState, useEffect } from 'react';
import { Server, Database, Shield, Globe, Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export function ArchitectureView() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHealth();
      setHealth(data);
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || 'Unable to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="architecture">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-outfit">System Architecture & Mesh</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time status monitoring of containerized microservices</p>
        </div>

        <button
          onClick={checkHealth}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-sm font-medium transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Probe Health</span>
        </button>
      </div>

      {/* Grid of Microservice Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Gateway */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-outfit">API Gateway</h3>
          <p className="text-xs text-slate-400 mt-1">Nginx Reverse Proxy (Port 80)</p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
            Routes /api/* & Static SPA
          </div>
        </div>

        {/* Frontend */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Globe className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-outfit">Web Front-End</h3>
          <p className="text-xs text-slate-400 mt-1">Vite + React SPA (Port 5173)</p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
            Tailwind CSS v4 + Context API
          </div>
        </div>

        {/* Backend API */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Server className="w-6 h-6" />
            </div>
            {health?.status === 'healthy' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> {health.status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Error
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white font-outfit">Backend API</h3>
          <p className="text-xs text-slate-400 mt-1">FastAPI Service (Port 8000)</p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
            JWT Auth & Pydantic Schemas
          </div>
        </div>

        {/* Database */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            {health?.database?.includes('connected') ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5" /> Unknown
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white font-outfit">Database Tier</h3>
          <p className="text-xs text-slate-400 mt-1">PostgreSQL 16 (Port 5432)</p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
            {health?.database || 'PostgreSQL Connection'}
          </div>
        </div>

      </div>

      {/* Live Probe Diagnostic Output Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Live Health Probe Output</span>
          </div>
          <span className="text-xs text-slate-500">Last checked: {lastCheckTime || 'N/A'}</span>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs text-indigo-300 font-mono overflow-x-auto">
          {JSON.stringify(health || { error: error || 'No data' }, null, 2)}
        </pre>
      </div>

    </section>
  );
}
