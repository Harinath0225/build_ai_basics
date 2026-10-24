import React, { useState } from 'react';

export default function LyricistLounge({
  totalDuration,
  storyShotCount,
  bonusDanceCount,
  audioPrompt,
  suggestedAudioPrompt,
  onChangeAudioPrompt,
  onResetAudioPrompt,
  sunoLyrics,
  onChangeSunoLyrics,
  onBack,
  onContinue,
}) {
  const [copiedSuno, setCopiedSuno] = useState(false);
  const isModified = audioPrompt !== suggestedAudioPrompt;

  const mins = Math.floor(totalDuration / 60);
  const secs = String(totalDuration % 60).padStart(2, '0');

  const handleCopySuno = () => {
    const bundle = `SUNO STYLE PROMPT (${mins}:${secs}):\n${audioPrompt}\n\nSUNO LYRICS & DANCE STRUCTURE:\n${sunoLyrics}`;
    navigator.clipboard.writeText(bundle);
    setCopiedSuno(true);
    setTimeout(() => setCopiedSuno(false), 1800);
  };

  return (
    <section className="df-col-760" aria-labelledby="sound-heading">
      <div style={{ marginBottom: '32px' }}>
        <p className="df-eyebrow">STEP 2 OF 4 &nbsp;·&nbsp; SUNO AUDIO BRIEF ({mins}:{secs})</p>
        <h1 id="sound-heading" className="df-title-xl">
          How should it sound?
        </h1>
        <p className="df-intro">
          Describe the voice and Suno music prompt once for your {totalDuration}s film ({storyShotCount} story shots + {bonusDanceCount} dance prompts). The same sound carries through every shot.
        </p>
      </div>

      {/* Suno Style & Instrumentation Prompt */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <label htmlFor="audio-prompt-input" className="df-label" style={{ marginBottom: 0 }}>
            SUNO MUSIC &amp; AUDIO PROMPT ({mins}:{secs} TRACK)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isModified && (
              <button
                type="button"
                className="df-btn-text"
                onClick={onResetAudioPrompt}
                style={{ height: '32px', fontSize: '14px' }}
              >
                Reset to suggestion
              </button>
            )}
            <button
              type="button"
              className="df-btn-text"
              onClick={handleCopySuno}
              style={{ height: '32px', fontSize: '14px' }}
            >
              {copiedSuno ? 'Copied Suno prompt ✓' : 'Copy Suno prompt'}
            </button>
          </div>
        </div>
        <textarea
          id="audio-prompt-input"
          className="df-textarea"
          rows={4}
          placeholder="Describe Suno genre, BPM, instrumentation, vocal tone, and dance drop..."
          value={audioPrompt}
          onChange={(e) => onChangeAudioPrompt(e.target.value)}
        />
      </div>

      {/* Suno Song Structure & Dance Cues */}
      <div style={{ marginBottom: '28px' }}>
        <label htmlFor="suno-lyrics-input" className="df-label">
          SUNO SONG STRUCTURE &amp; DANCE GROOVE CUES
        </label>
        <textarea
          id="suno-lyrics-input"
          className="df-textarea df-textarea-dense"
          rows={5}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.65 }}
          value={sunoLyrics}
          onChange={(e) => onChangeSunoLyrics(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          type="button"
          className="df-btn-ghost"
          onClick={onBack}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          <span>Back</span>
        </button>

        <button
          type="button"
          className="df-btn-primary"
          onClick={onContinue}
        >
          <span>Continue</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </section>
  );
}
