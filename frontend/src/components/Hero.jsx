import React from 'react';
import { Sparkles, ShieldCheck, Database, Server, Cpu } from 'lucide-react';

export function Hero({ onExplore }) {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24">
      {/* Radial Gradient Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-6 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Production-Ready Multi-Tier Microservices</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight font-outfit">
          Cloud Infrastructure & <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Microservice Mesh</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          Orchestrating high-performance REST microservices, PostgreSQL 16 data persistence, JWT security middleware, and Nginx reverse proxy gateway.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Explore Product Catalog
          </button>
        </div>

        {/* Feature Pills */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">FastAPI Gateway</div>
              <div className="text-xs text-slate-400">REST API v1</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">PostgreSQL 16</div>
              <div className="text-xs text-slate-400">Alembic ORM</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">JWT Auth</div>
              <div className="text-xs text-slate-400">Bcrypt Security</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Docker Mesh</div>
              <div className="text-xs text-slate-400">Bridge Network</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
