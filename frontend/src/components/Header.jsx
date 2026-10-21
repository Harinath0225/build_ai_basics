import React from 'react';
import { Clapperboard, Sparkles, RefreshCw, Zap } from 'lucide-react';

export default function Header({ onPreloadSample, onReset, isExpanded }) {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #a855f7, #06b6d4)', 
          padding: '12px', 
          borderRadius: '14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
        }}>
          <Clapperboard size={26} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
              Continuity<span style={{ color: 'var(--accent-purple)' }}>Studio</span>
            </h1>
            <span className="badge badge-purple">
              <Zap size={12} /> Agent V1.0
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
            Multi-Scene Continuity Workflow Agent for Google Veo & Suno
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={onPreloadSample} 
          className="btn-secondary"
          title="Load pre-tested sample story with scene math"
        >
          <Sparkles size={16} color="#c084fc" />
          <span>Load Demo Sample</span>
        </button>

        {isExpanded && (
          <button 
            onClick={onReset} 
            className="btn-secondary"
            title="Start fresh project"
            style={{ color: 'var(--text-dim)' }}
          >
            <RefreshCw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </header>
  );
}
