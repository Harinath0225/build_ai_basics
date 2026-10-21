import React from 'react';
import { Camera, User, Sun, Video, Music, Activity, ExternalLink, Sliders } from 'lucide-react';

const STUDIO_BINDER_SHOTS = [
  "Wide Establishing Shot",
  "Low-Angle Hero Shot",
  "Dolly In Tracking Shot",
  "Tracking Shot",
  "Crane / High-Angle Dynamic Shot",
  "Close-Up Expression Shot",
  "Over-The-Shoulder Dynamic Shot"
];

export default function TimelineDirector({
  concept,
  onUpdateScene,
  visualStyle,
  includeDance
}) {
  if (!concept || !concept.scenes) return null;

  const handleAngleChange = async (index, newAngle) => {
    const sceneToUpdate = { ...concept.scenes[index], camera_angle: newAngle };

    try {
      const res = await fetch('http://localhost:8080/api/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene: sceneToUpdate,
          character: concept.character_anchor,
          visual_style: visualStyle || concept.visual_style,
          include_dance: includeDance
        })
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdateScene(index, updated);
      }
    } catch (e) {
      console.error('Failed to update scene direction:', e);
      // Local reactive update fallback
      onUpdateScene(index, sceneToUpdate);
    }
  };

  const handleDanceToggle = async (index) => {
    const currentAction = concept.scenes[index].dance_action;
    const newAction = currentAction ? "" : "Realistic expressive contemporary footwork and syncopated torso groove,";
    const sceneToUpdate = { ...concept.scenes[index], dance_action: newAction };

    try {
      const res = await fetch('http://localhost:8080/api/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene: sceneToUpdate,
          character: concept.character_anchor,
          visual_style: visualStyle || concept.visual_style,
          include_dance: true
        })
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdateScene(index, updated);
      }
    } catch (e) {
      onUpdateScene(index, sceneToUpdate);
    }
  };

  return (
    <section className="studio-card animate-unfold" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Camera size={20} color="#a855f7" />
          <h2 style={{ fontSize: '18px', margin: 0 }}>Step 3: Character DNA & Director Timeline</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a 
            href="https://www.studiobinder.com/blog/ultimate-guide-to-camera-shots/#dollyshot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="badge badge-purple"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>StudioBinder Shot Taxonomy</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Persistent Character Anchor Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)', 
        border: '1px solid rgba(168, 85, 247, 0.3)', 
        borderRadius: '14px', 
        padding: '20px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#c084fc" />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
              Persistent Character Anchor: {concept.character_anchor?.name}
            </span>
          </div>
          <span className="badge badge-emerald">
            ● Identity Locked Across All Scenes
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Visual DNA (Costume & Anatomy)
            </div>
            <p style={{ fontSize: '13px', color: '#f1f5f9', background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {concept.character_anchor?.visual_dna}
            </p>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Lighting Key & Color Palette
            </div>
            <p style={{ fontSize: '13px', color: '#f1f5f9', background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {concept.character_anchor?.lighting_key}
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Scene Timeline Cards */}
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sliders size={16} color="#06b6d4" />
        <span>Paced Scene Timeline ({concept.scenes.length} Continuous Shots)</span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {concept.scenes.map((scene, idx) => (
          <div 
            key={idx} 
            style={{ 
              background: 'rgba(15, 23, 42, 0.7)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '12px', 
              padding: '16px 20px',
              transition: 'border-color 0.2s ease',
            }}
          >
            {/* Header of Scene Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-purple" style={{ fontSize: '13px', padding: '4px 12px' }}>
                  Scene {scene.scene_number}
                </span>
                <span className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  [{scene.time_range}]
                </span>
              </div>

              {/* Controls: Camera Angle Selector + Dance Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={14} color="#a855f7" />
                  <select
                    className="studio-select"
                    value={scene.camera_angle}
                    onChange={(e) => handleAngleChange(idx, e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '13px', width: 'auto', background: '#1e293b' }}
                  >
                    {STUDIO_BINDER_SHOTS.map((shot, sIdx) => (
                      <option key={sIdx} value={shot}>
                        {shot}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleDanceToggle(idx)}
                  className={`btn-secondary ${scene.dance_action ? 'badge-cyan' : ''}`}
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '12px', 
                    background: scene.dance_action ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: scene.dance_action ? '#22d3ee' : 'var(--text-muted)'
                  }}
                  title="Toggle realistic human dance motion prompt for this scene"
                >
                  <Activity size={13} />
                  <span>{scene.dance_action ? 'Dance Enabled' : 'No Dance'}</span>
                </button>
              </div>
            </div>

            {/* Prompts Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                  <Video size={13} />
                  <span>Google Veo Video Prompt</span>
                </div>
                <p className="mono" style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  {scene.veo_prompt}
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                  <Music size={13} />
                  <span>Suno Audio Synchronization</span>
                </div>
                <p className="mono" style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {scene.suno_prompt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
