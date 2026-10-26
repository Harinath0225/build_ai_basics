import React from 'react';

/**
 * BlackHoleLoader
 * Depicts a cosmic black hole with a rotating accretion disk,
 * photon sphere ring, and an event horizon core.
 *
 * @param {'fullscreen' | 'stage' | 'compact'} size - 'fullscreen' (fixed full-screen modal backdrop); 'stage' (card); 'compact' (inline button)
 * @param {string} label - Primary headline
 * @param {string} sublabel - Secondary readout
 */
export default function BlackHoleLoader({
  size = 'fullscreen',
  label = 'Accreting 3D Pixar Storyline & Suno Soundtrack',
  sublabel = 'Gemini AI Studio · Event horizon locking 25 prompts across timeline...',
}) {
  if (size === 'compact') {
    return (
      <div className="df-blackhole-compact" aria-hidden="true">
        <div className="df-bh-disk-compact" />
        <div className="df-bh-horizon-compact" />
      </div>
    );
  }

  const content = (
    <div className="df-blackhole-centerpiece" role="status" aria-live="polite">
      {/* Black Hole Celestial Assembly */}
      <div className="df-bh-viewport" aria-hidden="true">
        {/* Relativistic Gravitational Lensing Halo */}
        <div className="df-bh-lensing-halo" />

        {/* Primary Tilted Accretion Disk (conic gradient spin) */}
        <div className="df-bh-disk-outer">
          <div className="df-bh-conic-spin" />
        </div>

        {/* Vertical Doppler Lensing Arc */}
        <div className="df-bh-vertical-arc" />

        {/* Razor-thin Photon Sphere Ring */}
        <div className="df-bh-photon-ring" />

        {/* Pure Void Event Horizon */}
        <div className="df-bh-event-horizon">
          <div className="df-bh-shadow-inner" />
        </div>

        {/* Orbiting photon dust specks */}
        <div className="df-bh-particle df-bh-p1" />
        <div className="df-bh-particle df-bh-p2" />
      </div>

      {/* Accompanying Space Readout */}
      {label && (
        <div style={{ textAlign: 'center', marginTop: '24px', maxWidth: '580px' }}>
          <p className="df-eyebrow" style={{ color: 'var(--accent-pink)', marginBottom: '8px', letterSpacing: '0.14em' }}>
            ACCRETION IN PROGRESS
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--text-main)',
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            {label}
          </h2>
          {sublabel && (
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--text-soft)',
                marginTop: '12px',
                lineHeight: 1.6,
              }}
            >
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="df-blackhole-overlay" role="dialog" aria-modal="true">
        {/* Star backdrop glow layers */}
        <div className="df-bh-overlay-glow" aria-hidden="true" />
        {content}
      </div>
    );
  }

  return <div className="df-blackhole-stage">{content}</div>;
}
