import React from 'react';

export default function ConceptStudio({
  gist,
  onChangeGist,
  totalDuration,
  onChangeTotalDuration,
  shotDuration,
  onChangeShotDuration,
  bonusDanceCount,
  onChangeBonusDanceCount,
  storyPrompt,
  suggestedStoryPrompt,
  onChangeStoryPrompt,
  onResetStoryPrompt,
  onTryDemo,
  onContinue,
  isLoading,
}) {
  const hasText = gist.trim().length > 0;
  const isPromptModified = storyPrompt !== suggestedStoryPrompt;

  const storyShotCount = Math.max(1, Math.floor((Number(totalDuration) || 120) / (Number(shotDuration) || 6)));
  const danceCount = Math.max(0, Number(bonusDanceCount) || 0);
  const totalPrompts = storyShotCount + danceCount;
  const minsLabel =
    totalDuration % 60 === 0
      ? `${totalDuration / 60} ${totalDuration === 60 ? 'min' : 'mins'} (${totalDuration}s)`
      : `${(totalDuration / 60).toFixed(1)} mins (${totalDuration}s)`;

  return (
    <section className="df-col-760" aria-labelledby="story-heading">
      <div style={{ marginBottom: '32px' }}>
        <p className="df-eyebrow">STEP 1 OF 4</p>
        <h1 id="story-heading" className="df-title-xl">
          What is your story about?
        </h1>
        <p className="df-intro">
          Give us the gist and expected video length. We generate 3D Animated Pixar-style shot prompts, bonus dance prompts, and a matching Suno music prompt.
        </p>
      </div>

      {/* The Gist */}
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="story-gist-input" className="df-label">
          THE GIST
        </label>
        <textarea
          id="story-gist-input"
          className="df-textarea"
          rows={4}
          placeholder="A sleepy dreamer finds a clockwork ship and floats over a meadow of glowing hills..."
          value={gist}
          onChange={(e) => onChangeGist(e.target.value)}
        />
      </div>

      {/* Duration & Prompt Count Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '18px',
        }}
      >
        <div style={{ flex: '1 1 210px' }}>
          <label htmlFor="video-length-select" className="df-label">
            EXPECTED VIDEO LENGTH
          </label>
          <select
            id="video-length-select"
            className="df-input"
            value={totalDuration}
            onChange={(e) => onChangeTotalDuration(Number(e.target.value))}
            style={{ cursor: 'pointer' }}
          >
            <option value={60} style={{ background: '#0b0b20' }}>1 min (60 secs)</option>
            <option value={90} style={{ background: '#0b0b20' }}>1.5 mins (90 secs)</option>
            <option value={120} style={{ background: '#0b0b20' }}>2 mins (120 secs)</option>
            <option value={150} style={{ background: '#0b0b20' }}>2.5 mins (150 secs)</option>
            <option value={180} style={{ background: '#0b0b20' }}>3 mins (180 secs)</option>
          </select>
        </div>

        <div style={{ flex: '1 1 210px' }}>
          <label htmlFor="shot-duration-select" className="df-label">
            SECS GENERATED PER SHOT
          </label>
          <select
            id="shot-duration-select"
            className="df-input"
            value={shotDuration}
            onChange={(e) => onChangeShotDuration(Number(e.target.value))}
            style={{ cursor: 'pointer' }}
          >
            <option value={5} style={{ background: '#0b0b20' }}>5 secs / prompt</option>
            <option value={6} style={{ background: '#0b0b20' }}>6 secs / prompt (20 per 2m)</option>
            <option value={8} style={{ background: '#0b0b20' }}>8 secs / prompt</option>
            <option value={10} style={{ background: '#0b0b20' }}>10 secs / prompt</option>
          </select>
        </div>

        <div style={{ flex: '1 1 210px' }}>
          <label htmlFor="bonus-dance-select" className="df-label">
            ADDITIONAL DANCE PROMPTS
          </label>
          <select
            id="bonus-dance-select"
            className="df-input"
            value={bonusDanceCount}
            onChange={(e) => onChangeBonusDanceCount(Number(e.target.value))}
            style={{ cursor: 'pointer' }}
          >
            <option value={0} style={{ background: '#0b0b20' }}>0 dance prompts</option>
            <option value={3} style={{ background: '#0b0b20' }}>+3 dance prompts</option>
            <option value={5} style={{ background: '#0b0b20' }}>+5 dance prompts</option>
            <option value={8} style={{ background: '#0b0b20' }}>+8 dance prompts</option>
            <option value={10} style={{ background: '#0b0b20' }}>+10 dance prompts</option>
          </select>
        </div>
      </div>

      {/* Spectral Readout Summary */}
      <div className="df-dashed-box" style={{ marginBottom: hasText ? '28px' : '24px', padding: '12px 16px' }}>
        <div className="df-readout" style={{ color: 'var(--accent-cyan)', fontSize: '12.5px' }}>
          PLAN &nbsp;·&nbsp; {minsLabel} video @ {shotDuration}s/shot → <strong>{storyShotCount} 3D Animated Pixar video prompts</strong>
          {danceCount > 0 ? <> + <strong>{danceCount} bonus dance prompts</strong> ({totalPrompts} total prompts)</> : null} + <strong>1 Suno music prompt</strong>
        </div>
      </div>

      {hasText && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <label htmlFor="story-prompt-input" className="df-label" style={{ marginBottom: 0 }}>
              3D PIXAR STORY PROMPT
            </label>
            {isPromptModified && (
              <button
                type="button"
                className="df-btn-text"
                onClick={onResetStoryPrompt}
                style={{ height: '32px', fontSize: '14px' }}
              >
                Reset to suggestion
              </button>
            )}
          </div>
          <textarea
            id="story-prompt-input"
            className="df-textarea"
            rows={3}
            value={storyPrompt}
            onChange={(e) => onChangeStoryPrompt(e.target.value)}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          type="button"
          className="df-btn-ghost"
          onClick={onTryDemo}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#e9c98f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5C7.5 10.9 5.1 8.5 1.5 8 5.1 7.5 7.5 5.1 8 1.5z" />
          </svg>
          <span>Try a demo story (2m · 20 + 5 dance)</span>
        </button>

        <button
          type="button"
          className="df-btn-primary"
          disabled={!hasText || isLoading}
          onClick={onContinue}
        >
          <span>{isLoading ? 'Generating Pixar & Suno prompts...' : 'Continue'}</span>
          {hasText && !isLoading && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
