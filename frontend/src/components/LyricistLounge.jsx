import React, { useState } from 'react';
import { Mic2, Music2, BookOpen, Copy, Check, Sparkles } from 'lucide-react';

export default function LyricistLounge({ concept }) {
  const [copied, setCopied] = useState(false);

  if (!concept) return null;

  const handleCopySuno = () => {
    navigator.clipboard.writeText(concept.suno_master_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="studio-card animate-unfold" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mic2 size={20} color="#06b6d4" />
          <h2 style={{ fontSize: '18px', margin: 0 }}>Step 2: Story Arc & AI Lyricist Lounge</h2>
        </div>
        <span className="badge badge-cyan">
          <Sparkles size={12} /> Lyricist Persona Active
        </span>
      </div>

      {/* Project Overview */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
          {concept.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontStyle: 'italic' }}>
          "{concept.logline}"
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Narrative Beats */}
        <div style={{ 
          background: 'rgba(0,0,0,0.25)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '12px', 
          padding: '18px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-purple)' }}>
            <BookOpen size={16} />
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Expanded Narrative Beats
            </h4>
          </div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {concept.story_beats?.map((beat, idx) => (
              <li key={idx} style={{ 
                display: 'flex', 
                gap: '12px', 
                fontSize: '14px', 
                color: 'var(--text-main)', 
                marginBottom: '10px',
                lineHeight: 1.5 
              }}>
                <span className="badge badge-purple" style={{ height: 'fit-content', padding: '2px 8px', fontSize: '11px' }}>
                  Beat {idx + 1}
                </span>
                <span>{beat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lyricist Verses */}
        <div style={{ 
          background: 'rgba(0,0,0,0.25)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '12px', 
          padding: '18px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-cyan)' }}>
            <Music2 size={16} />
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Synchronized Lyrics & Rhyme Persona
            </h4>
          </div>
          <pre style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '13px', 
            color: '#e2e8f0', 
            whiteSpace: 'pre-wrap', 
            background: 'rgba(15, 23, 42, 0.6)', 
            padding: '14px', 
            borderRadius: '8px', 
            border: '1px solid rgba(255,255,255,0.04)',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            {concept.lyrics}
          </pre>
        </div>
      </div>

      {/* Suno Master Audio Prompt */}
      <div style={{ 
        marginTop: '20px', 
        background: 'rgba(6, 182, 212, 0.05)', 
        border: '1px solid rgba(6, 182, 212, 0.2)', 
        borderRadius: '12px', 
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">Suno AI Audio Master Prompt</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Paste directly into Suno.com</span>
          </div>
          <button onClick={handleCopySuno} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>
        </div>
        <p className="mono" style={{ fontSize: '13px', color: '#38bdf8', margin: 0 }}>
          {concept.suno_master_prompt}
        </p>
      </div>
    </section>
  );
}
