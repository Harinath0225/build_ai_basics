import React, { useState } from 'react';
import { Copy, Check, Sparkles, Video, Music, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function PromptDeck({ concept }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedType, setCopiedType] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'veo', 'suno'

  if (!concept || !concept.scenes) return null;

  const handleCopySingle = (text, index, type) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedIndex(null);
      setCopiedType(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    const header = `=====================================================
🎬 CONTINUITYSTUDIO: MULTI-SCENE PRODUCTION DECK
Project: ${concept.title}
Total Duration: ${concept.total_duration}s | Pacing: ${concept.scene_duration}s per scene (${concept.scenes.length} Scenes)
Visual Style: ${concept.visual_style}
Music Style: ${concept.music_genre}
=====================================================

--- CHARACTER DNA ANCHOR ---
Name: ${concept.character_anchor?.name}
Visual DNA: ${concept.character_anchor?.visual_dna}
Lighting Key: ${concept.character_anchor?.lighting_key}

--- MASTER SUNO AUDIO PROMPT ---
${concept.suno_master_prompt}

--- LYRICS / RHYMES ---
${concept.lyrics}

=====================================================
📽️ CONTINUOUS SCENE PROMPTS (GOOGLE VEO + SUNO)
=====================================================
`;

    const scenesText = concept.scenes.map((s) => `
[SCENE ${s.scene_number}] [${s.time_range}] Camera: ${s.camera_angle}
GOOGLE VEO PROMPT:
${s.veo_prompt}

SUNO AUDIO CUE:
${s.suno_prompt}
-----------------------------------------------------`).join('\n');

    navigator.clipboard.writeText(header + scenesText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <section className="studio-card animate-unfold" style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="#a855f7" />
          <h2 style={{ fontSize: '18px', margin: 0 }}>Step 5: Production Prompt Deck (Veo & Suno)</h2>
        </div>

        {/* Action: Copy All */}
        <button 
          onClick={handleCopyAll}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
        >
          {copiedAll ? <Check size={16} color="#34d399" /> : <Download size={16} />}
          <span>{copiedAll ? 'Full Deck Copied to Clipboard!' : 'Copy Master Production Deck'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setFilterMode('all')}
          className={`btn-secondary ${filterMode === 'all' ? 'badge-purple' : ''}`}
          style={{ 
            padding: '6px 14px', 
            fontSize: '13px', 
            background: filterMode === 'all' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.04)',
            color: filterMode === 'all' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          All Prompts ({concept.scenes.length})
        </button>
        <button
          onClick={() => setFilterMode('veo')}
          className={`btn-secondary ${filterMode === 'veo' ? 'badge-purple' : ''}`}
          style={{ 
            padding: '6px 14px', 
            fontSize: '13px', 
            background: filterMode === 'veo' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.04)',
            color: filterMode === 'veo' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <Video size={13} />
          <span>Google Veo Only</span>
        </button>
        <button
          onClick={() => setFilterMode('suno')}
          className={`btn-secondary ${filterMode === 'suno' ? 'badge-cyan' : ''}`}
          style={{ 
            padding: '6px 14px', 
            fontSize: '13px', 
            background: filterMode === 'suno' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.04)',
            color: filterMode === 'suno' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <Music size={13} />
          <span>Suno Music Only</span>
        </button>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {concept.scenes.map((scene, idx) => (
          <div 
            key={idx}
            style={{ 
              background: 'rgba(15, 23, 42, 0.65)', 
              border: '1px solid rgba(255,255,255,0.07)', 
              borderRadius: '12px', 
              padding: '18px 20px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-purple" style={{ fontSize: '12px' }}>
                  Scene {scene.scene_number}
                </span>
                <span className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  [{scene.time_range}]
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '12px' }}>
                  {scene.camera_angle}
                </span>
              </div>
              <span className="badge badge-emerald">
                <CheckCircle2 size={12} /> Continuity Verified
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Veo Box */}
              {(filterMode === 'all' || filterMode === 'veo') && (
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(168, 85, 247, 0.2)', 
                  borderRadius: '10px', 
                  padding: '12px 16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase' }}>
                      <Video size={13} />
                      <span>Google Veo Prompt (Video)</span>
                    </div>
                    <button 
                      onClick={() => handleCopySingle(scene.veo_prompt, idx, 'veo')}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      {copiedIndex === idx && copiedType === 'veo' ? (
                        <>
                          <Check size={13} color="#34d399" />
                          <span style={{ color: '#34d399' }}>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Veo Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mono" style={{ fontSize: '12px', color: '#f1f5f9', margin: 0, lineHeight: 1.5 }}>
                    {scene.veo_prompt}
                  </p>
                </div>
              )}

              {/* Suno Box */}
              {(filterMode === 'all' || filterMode === 'suno') && (
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(6, 182, 212, 0.2)', 
                  borderRadius: '10px', 
                  padding: '12px 16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                      <Music size={13} />
                      <span>Suno Prompt (Audio Cue)</span>
                    </div>
                    <button 
                      onClick={() => handleCopySingle(scene.suno_prompt, idx, 'suno')}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      {copiedIndex === idx && copiedType === 'suno' ? (
                        <>
                          <Check size={13} color="#34d399" />
                          <span style={{ color: '#34d399' }}>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Suno Cue</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mono" style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    {scene.suno_prompt}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
