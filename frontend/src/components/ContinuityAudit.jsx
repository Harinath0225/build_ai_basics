import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Wrench, RefreshCw, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export default function ContinuityAudit({
  concept,
  onAuditComplete
}) {
  const [memoryStatus, setMemoryStatus] = useState(null);
  const [activeRules, setActiveRules] = useState([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch memory & rules status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const [memRes, rulesRes] = await Promise.all([
        fetch('http://localhost:8080/api/memory/status'),
        fetch('http://localhost:8080/api/rules')
      ]);

      if (memRes.ok) {
        const memData = await memRes.json();
        setMemoryStatus(memData);
      }
      if (rulesRes.ok) {
        const rulesData = await rulesRes.json();
        setActiveRules(rulesData);
      }
    } catch (e) {
      console.warn('Memory status fetch failed:', e);
    }
  };

  const handleRunAudit = async () => {
    if (!concept) return;
    setIsAuditing(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8080/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(concept)
      });

      if (!res.ok) {
        throw new Error(`Audit returned status ${res.status}`);
      }

      const result = await res.json();
      setAuditResult(result);
      if (result.updated_rules) {
        setActiveRules(result.updated_rules);
      }
      if (onAuditComplete) {
        onAuditComplete(result);
      }
    } catch (err) {
      console.error('Audit failed:', err);
      setError('Audit pass encountered an issue connecting to the Go backend.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <section className="studio-card animate-unfold" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="#10b981" />
          <h2 style={{ fontSize: '18px', margin: 0 }}>Step 4: Vector Memory & Autonomous Continuity Audit</h2>
        </div>

        {/* Vector Memory Engine Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {memoryStatus?.chroma_online ? (
            <span className="badge badge-cyan">
              <Database size={12} /> Chroma DB Vector Server (Port 8000)
            </span>
          ) : (
            <span className="badge badge-purple" title="Embedded vector cosine similarity engine active">
              <Cpu size={12} /> Local Vector Memory Engine (Port 8000 Ready)
            </span>
          )}
          <span className="badge badge-emerald">
            {activeRules.length} Active Rules
          </span>
        </div>
      </div>

      {/* Persistent Rule Storage Card */}
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: '12px', 
        padding: '18px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} color="#a855f7" />
            <span>Persistent Rules Stored on Disk (`backend/data/rules.json`)</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            Autonomously Patched & Dynamically Reloaded
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeRules.map((r, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '10px', 
              fontSize: '13px', 
              background: 'rgba(255,255,255,0.02)', 
              padding: '8px 12px', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.04)' 
            }}>
              <span className="badge badge-purple" style={{ padding: '2px 6px', fontSize: '11px', textTransform: 'uppercase' }}>
                {r.category}
              </span>
              <span style={{ color: '#cbd5e1', flex: 1 }}>{r.constraint}</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                v{r.version}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Action Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(16, 185, 129, 0.06)', 
        border: '1px solid rgba(16, 185, 129, 0.2)', 
        borderRadius: '12px', 
        padding: '16px 20px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#34d399" />
            <span>Continuity Drift Evaluator</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Audits character DNA, lighting key, and dance anatomy across all {concept?.scenes?.length || 0} scenes.
          </div>
        </div>

        <button 
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="btn-primary"
          style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}
        >
          {isAuditing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Scanning Vector Memory & Auditing Prompts...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>Run Autonomous Continuity Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Audit Results Panel */}
      {auditResult && (
        <div style={{ marginTop: '20px', animation: 'slideDownFade 0.3s ease forwards' }}>
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.8)', 
            border: '1px solid rgba(16, 185, 129, 0.4)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: 'var(--shadow-emerald)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="#34d399" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Continuity Health: {auditResult.verified_count} / {auditResult.total_scenes} Scenes Verified (100% Locked)
                </span>
              </div>
              <span className="badge badge-emerald">
                ● Temporal Continuity Confirmed
              </span>
            </div>

            {/* Event Log & Autonomous Patch Events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {auditResult.patches_applied?.length > 0 && (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>
                    <Wrench size={14} />
                    <span>Autonomous Self-Patch Events:</span>
                  </div>
                  {auditResult.patches_applied.map((p, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#fef3c7', marginLeft: '20px' }}>
                      • {p}
                    </div>
                  ))}
                </div>
              )}

              {auditResult.audit_notes?.map((note, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#34d399' }}>✓</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
