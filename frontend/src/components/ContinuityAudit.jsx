import React, { useState } from 'react';

function StatusIcon({ status }) {
  if (status === 'aligned') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#7ee8f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="9" r="7" />
        <path d="M6 9.2l2.1 2.1 4.2-4.4" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#e9c98f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 1.8l7.2 7.2L9 16.2 1.8 9z" />
      <path d="M9 6v3.4M9 11.6v.1" />
    </svg>
  );
}

function ContinuityDial({ shots, flaggedMap, totalShots }) {
  const count = shots.length || 15;
  const alignedCount = shots.filter((s) => !flaggedMap[s.number] || flaggedMap[s.number].resolved).length;

  return (
    <div style={{ position: 'relative', width: '200px', height: '200px', flexShrink: 0 }}>
      <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
        {/* Faint tilted orbital ellipses behind center */}
        <ellipse
          cx="100"
          cy="100"
          rx="54"
          ry="20"
          transform="rotate(-28 100 100)"
          stroke="rgba(255, 255, 255, 0.09)"
          strokeWidth="1"
          fill="none"
        />
        <ellipse
          cx="100"
          cy="100"
          rx="54"
          ry="20"
          transform="rotate(32 100 100)"
          stroke="rgba(255, 255, 255, 0.09)"
          strokeWidth="1"
          fill="none"
        />

        {/* 15 ticks around (100, 100) */}
        {shots.map((shot, i) => {
          const deg = i * (360 / count);
          const rad = ((deg - 90) * Math.PI) / 180;
          const x1 = 100 + 76 * Math.cos(rad);
          const y1 = 100 + 76 * Math.sin(rad);
          const x2 = 100 + 92 * Math.cos(rad);
          const y2 = 100 + 92 * Math.sin(rad);
          const dotX = 100 + 100 * Math.cos(rad);
          const dotY = 100 + 100 * Math.sin(rad);

          const flagInfo = flaggedMap[shot.number];
          const needsLook = flagInfo && !flagInfo.resolved;

          return (
            <g key={shot.number}>
              <line
                x1={x1.toFixed(2)}
                y1={y1.toFixed(2)}
                x2={x2.toFixed(2)}
                y2={y2.toFixed(2)}
                stroke={needsLook ? '#e9c98f' : '#7ee8f0'}
                strokeWidth="3"
                strokeLinecap="round"
              />
              {needsLook && (
                <circle
                  cx={dotX.toFixed(2)}
                  cy={dotY.toFixed(2)}
                  r="3.5"
                  fill="#e9c98f"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center Readout */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 600,
            lineHeight: 1,
            color: 'var(--text-main)',
          }}
        >
          {alignedCount}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginTop: '4px',
          }}
        >
          of {totalShots} shots
        </span>
      </div>
    </div>
  );
}

export default function ContinuityAudit({
  projectTitle,
  shots,
  flaggedItems,
  onUpdateShotPrompt,
  onAcceptSuggestion,
  onKeepVersion,
  onReviewAllShots,
  onExportPrompts,
}) {
  const [openShotNum, setOpenShotNum] = useState(null);

  const flaggedMap = {};
  flaggedItems.forEach((item) => {
    flaggedMap[item.shotNumber] = item;
  });

  const unresolvedCount = flaggedItems.filter((f) => !f.resolved).length;
  const alignedCount = shots.length - unresolvedCount;

  return (
    <section className="df-col-960" aria-labelledby="check-heading">
      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        <div>
          <p className="df-eyebrow">STEP 4 OF 4</p>
          <h1 id="check-heading" className="df-title-lg">
            Check continuity
          </h1>
          <p className="df-meta" style={{ marginTop: '10px' }}>
            {projectTitle} &nbsp;·&nbsp; {shots.length} shots
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="df-btn-ghost"
            onClick={onReviewAllShots}
          >
            Review all shots
          </button>

          <button
            type="button"
            className="df-btn-primary"
            onClick={onExportPrompts}
          >
            <span>Export prompts</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dial Summary Card */}
      <div
        className="df-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
          flexWrap: 'wrap',
          marginBottom: '44px',
        }}
      >
        <ContinuityDial
          shots={shots}
          flaggedMap={flaggedMap}
          totalShots={shots.length}
        />

        <div style={{ flex: '1 1 320px' }}>
          <h2 className="df-card-headline">
            {alignedCount} of {shots.length} shots line up
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-soft)', lineHeight: 1.5, marginTop: '10px' }}>
            {unresolvedCount > 0
              ? `We compared each prompt with your locked details and with the shots on either side. ${unresolvedCount} ${unresolvedCount === 1 ? 'needs' : 'need'} a look.`
              : 'We compared each prompt with your locked details and with the shots on either side. Every shot lines up across the film.'}
          </p>

          <div style={{ height: '1px', background: 'var(--line-hairline)', margin: '20px 0 16px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '2px', borderRadius: '2px', background: '#7ee8f0' }} aria-hidden="true" />
              <span>Lines up</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '2px', borderRadius: '2px', background: '#e9c98f' }} aria-hidden="true" />
              <span>Needs a look</span>
            </span>
          </div>
        </div>
      </div>

      {/* Flagged Shots List */}
      <div>
        <h2 className="df-headline-md" style={{ marginBottom: '16px' }}>
          Flagged shots
        </h2>

        <div>
          {flaggedItems.map((item) => {
            const shotIndex = shots.findIndex((s) => s.number === item.shotNumber);
            const shot = shots[shotIndex];
            if (!shot) return null;

            const shotNumStr = String(shot.number).padStart(2, '0');
            const isOpen = openShotNum === shot.number;

            return (
              <div key={shot.number} className="df-list-row">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px 24px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: '1 1 320px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        marginBottom: '6px',
                      }}
                    >
                      SHOT {shotNumStr}
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        marginBottom: '6px',
                      }}
                    >
                      {item.reason}
                    </div>
                    <p
                      className={isOpen ? '' : 'df-clamp-2'}
                      style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}
                    >
                      {shot.whatHappens}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: 500 }}>
                      <StatusIcon status={item.resolved ? 'aligned' : 'flagged'} />
                      <span style={{ color: item.resolved ? '#7ee8f0' : '#e9c98f' }}>
                        {item.resolved ? 'Lines up' : 'Needs a look'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="df-btn-ghost"
                      aria-expanded={isOpen}
                      aria-label={`Review shot ${shotNumStr}`}
                      onClick={() => setOpenShotNum(isOpen ? null : shot.number)}
                    >
                      {isOpen ? (item.resolved ? 'Done' : 'Close') : 'Review'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line-hairline)' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label htmlFor={`review-prompt-${shot.number}`} className="df-label">
                        SHOT {shotNumStr} PROMPT
                      </label>
                      <textarea
                        id={`review-prompt-${shot.number}`}
                        className="df-textarea df-textarea-dense"
                        rows={2}
                        value={shot.whatHappens}
                        onChange={(e) => onUpdateShotPrompt(shotIndex, e.target.value)}
                      />
                    </div>

                    <div className="df-dashed-box" style={{ marginBottom: '16px' }}>
                      <span className="df-label" style={{ marginBottom: '6px' }}>
                        SUGGESTION
                      </span>
                      <p style={{ fontSize: '15px', color: 'var(--text-soft)', lineHeight: 1.55 }}>
                        {item.suggestedCamera
                          ? `[Camera: ${item.suggestedCamera}] ${item.suggestion}`
                          : item.suggestion}
                      </p>
                    </div>

                    {!item.resolved ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="df-btn-primary df-btn-inline"
                          onClick={() => onAcceptSuggestion(item.shotNumber)}
                        >
                          Use suggestion
                        </button>
                        <button
                          type="button"
                          className="df-btn-ghost"
                          onClick={() => {
                            onKeepVersion(item.shotNumber);
                            setOpenShotNum(null);
                          }}
                        >
                          Keep my version
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          className="df-btn-ghost"
                          onClick={() => setOpenShotNum(null)}
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
