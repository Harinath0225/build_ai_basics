import React from 'react';
import { Film, Music, Clock, Layers, Sparkles, Activity } from 'lucide-react';

export default function ConceptStudio({ 
  formData, 
  setFormData, 
  onExpand, 
  isLoading 
}) {
  const sceneCount = Math.max(1, Math.floor(formData.totalDuration / formData.sceneDuration));

  const visualStylePresets = [
    "Cinematic 3D Animation (Pixar/Dreamworks aesthetic)",
    "Photorealistic Cyberpunk Noir (Neon rim-lighting, 4K)",
    "Anime / Studio Ghibli Aesthetic (Lush hand-painted colors)",
    "Stylized Watercolor Storybook (Soft edges, artistic)"
  ];

  const handleTotalChange = (val) => {
    setFormData(prev => ({ ...prev, totalDuration: Number(val) }));
  };

  const handleSceneChange = (val) => {
    setFormData(prev => ({ ...prev, sceneDuration: Number(val) }));
  };

  return (
    <section className="studio-card studio-card-glow" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Film size={20} color="#a855f7" />
          <h2 style={{ fontSize: '18px', margin: 0 }}>Step 1: Project Concept & Scene Math</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-cyan">
            <Clock size={13} /> {formData.totalDuration}s Total
          </span>
          <span className="badge badge-purple">
            <Layers size={13} /> {sceneCount} Scenes ({formData.sceneDuration}s each)
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Left Column: Story Outline */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Story Outline, Rhyme Gist, or Narrative Kernel
          </label>
          <textarea
            className="studio-textarea"
            rows={3}
            placeholder="e.g., A charismatic street detective in a rainy neon city searches for an elusive cybernetic fox while humming an electro-swing melody..."
            value={formData.storyGist}
            onChange={(e) => setFormData(prev => ({ ...prev, storyGist: e.target.value }))}
            required
          />
        </div>

        {/* Duration Selectors */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Total Video Duration
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[30, 60, 90, 120].map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => handleTotalChange(dur)}
                className={`btn-secondary ${formData.totalDuration === dur ? 'badge-purple' : ''}`}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  background: formData.totalDuration === dur ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.05)',
                  borderColor: formData.totalDuration === dur ? 'var(--accent-purple)' : 'var(--border-subtle)',
                  color: formData.totalDuration === dur ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: formData.totalDuration === dur ? 700 : 500
                }}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Scene Cut Duration (Google Veo pacing)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[6, 8, 10].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handleSceneChange(sec)}
                className={`btn-secondary ${formData.sceneDuration === sec ? 'badge-cyan' : ''}`}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  background: formData.sceneDuration === sec ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.05)',
                  borderColor: formData.sceneDuration === sec ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  color: formData.sceneDuration === sec ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: formData.sceneDuration === sec ? 700 : 500
                }}
              >
                {sec}s / scene
              </button>
            ))}
          </div>
        </div>

        {/* Visual Style */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Visual Art Style
          </label>
          <select 
            className="studio-select"
            value={formData.visualStyle}
            onChange={(e) => setFormData(prev => ({ ...prev, visualStyle: e.target.value }))}
          >
            {visualStylePresets.map((preset, idx) => (
              <option key={idx} value={preset} style={{ background: '#0f172a', color: '#f8fafc' }}>
                {preset}
              </option>
            ))}
          </select>
        </div>

        {/* Music Genre & Mood */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Music Genre & Sound Atmosphere (Suno)
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="studio-input"
              placeholder="e.g. Upbeat Electro-Swing, 124 BPM, brass stabs"
              value={formData.musicGenre}
              onChange={(e) => setFormData(prev => ({ ...prev, musicGenre: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Dance & Motion Toggle */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.03)', 
        border: '1px solid rgba(255,255,255,0.06)', 
        borderRadius: '12px', 
        padding: '14px 18px',
        marginBottom: '24px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={20} color="#06b6d4" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
              Enable Realistic Human-like Dance Steps
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Injects expressive tempo-locked choreography into prompts while preserving character anatomy and costume continuity
            </div>
          </div>
        </div>
        <input 
          type="checkbox"
          checked={formData.includeDance}
          onChange={(e) => setFormData(prev => ({ ...prev, includeDance: e.target.checked }))}
          style={{ width: '20px', height: '20px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
        />
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onExpand} 
          disabled={isLoading || !formData.storyGist.trim()}
          className="btn-primary"
          style={{ opacity: isLoading || !formData.storyGist.trim() ? 0.6 : 1 }}
        >
          {isLoading ? (
            <>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid rgba(255,255,255,0.3)', 
                borderTopColor: '#ffffff', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
              <span>Expanding Concept & Computing Timeline...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Expand & Direct Project ({sceneCount} Scenes)</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
