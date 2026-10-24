import React, { useState } from 'react';

export function assembleShotPrompt(locked, shots, index) {
  const shot = shots[index];
  if (!shot) return '';
  const starts =
    shot.isDance
      ? 'Rhythmic chorus cut / dance break'
      : index === 0
      ? 'Opening shot'
      : shots[index - 1]?.howItEnds || 'Continues from previous shot';

  const lines = [
    `Look: ${locked.look}`,
    `Character: ${locked.character}`,
    `World: ${locked.world}`,
    `Light: ${locked.light}`,
    `Camera: ${shot.camera}`,
    `Duration: ${shot.timeRange || '6s'}`,
    `Starts: ${starts}`,
    `Scene: ${shot.whatHappens}`,
  ];
  if (shot.danceMove) {
    lines.push(`Choreography: ${shot.danceMove}`);
  }
  lines.push(`Ends: ${shot.howItEnds}`);
  return lines.join('\n');
}

export default function TimelineDirector({
  locked,
  onChangeLocked,
  shots,
  initialShots,
  storyShotCount,
  bonusDanceCount,
  onUpdateShot,
  onRevertShot,
  showAllShots,
  onToggleShowAll,
  onBack,
  onCheckContinuity,
}) {
  const [isEditingLocked, setIsEditingLocked] = useState(false);
  const [openShotNumber, setOpenShotNumber] = useState(null);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'story' | 'dance'

  const filteredShots = shots.filter((s) => {
    if (filterTab === 'story') return !s.isDance;
    if (filterTab === 'dance') return !!s.isDance;
    return true;
  });

  const visibleShots =
    showAllShots || filterTab === 'dance'
      ? filteredShots
      : filteredShots.slice(0, 4);

  const handleCopyPrompt = (shotNumber) => {
    const idx = shots.findIndex((s) => s.number === shotNumber);
    if (idx === -1) return;
    const fullText = assembleShotPrompt(locked, shots, idx);
    navigator.clipboard.writeText(fullText);
    setCopiedNumber(shotNumber);
    setTimeout(() => setCopiedNumber(null), 1800);
  };

  return (
    <section className="df-col-860" aria-labelledby="shots-heading">
      {/* Page Intro */}
      <div style={{ marginBottom: '36px' }}>
        <p className="df-eyebrow">
          STEP 3 OF 4 &nbsp;·&nbsp; {storyShotCount} STORY PROMPTS + {bonusDanceCount} DANCE PROMPTS
        </p>
        <h1 id="shots-heading" className="df-title-xl">
          Write the shots
        </h1>
        <p className="df-intro">
          3D Animated Pixar-style prompts for every scene plus bonus dance prompts. We keep the look and the characters the same in all of them.
        </p>
      </div>

      {/* Locked in every shot Card */}
      <div className="df-card-compact" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 className="df-headline-sm">Locked in every shot</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Change these once and every story and dance shot follows.
            </p>
          </div>
          <button
            type="button"
            className="df-btn-ghost"
            aria-expanded={isEditingLocked}
            onClick={() => setIsEditingLocked((prev) => !prev)}
            style={{ height: '40px', padding: '0 16px' }}
          >
            {isEditingLocked ? 'Done' : 'Edit'}
          </button>
        </div>

        {!isEditingLocked ? (
          <dl className="df-locked-dl">
            <dt className="df-locked-dt">CHARACTER</dt>
            <dd className="df-locked-dd">{locked.character}</dd>

            <dt className="df-locked-dt">WORLD</dt>
            <dd className="df-locked-dd">{locked.world}</dd>

            <dt className="df-locked-dt">LOOK</dt>
            <dd className="df-locked-dd">{locked.look}</dd>

            <dt className="df-locked-dt">LIGHT</dt>
            <dd className="df-locked-dd">{locked.light}</dd>
          </dl>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label htmlFor="locked-character" className="df-label">CHARACTER</label>
              <textarea
                id="locked-character"
                className="df-textarea df-textarea-dense"
                rows={2}
                value={locked.character}
                onChange={(e) => onChangeLocked('character', e.target.value)}
              />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label htmlFor="locked-world" className="df-label">WORLD</label>
              <textarea
                id="locked-world"
                className="df-textarea df-textarea-dense"
                rows={2}
                value={locked.world}
                onChange={(e) => onChangeLocked('world', e.target.value)}
              />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label htmlFor="locked-look" className="df-label">LOOK</label>
              <textarea
                id="locked-look"
                className="df-textarea df-textarea-dense"
                rows={2}
                value={locked.look}
                onChange={(e) => onChangeLocked('look', e.target.value)}
              />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label htmlFor="locked-light" className="df-label">LIGHT</label>
              <textarea
                id="locked-light"
                className="df-textarea df-textarea-dense"
                rows={2}
                value={locked.light}
                onChange={(e) => onChangeLocked('light', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Shots Section */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--line-hairline)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
            <h2 className="df-headline-md">Shots</h2>
            <span className="df-meta">
              Showing {visibleShots.length} of {filteredShots.length}
            </span>
          </div>

          {bonusDanceCount > 0 && (
            <div className="df-segmented" role="group" aria-label="Filter shots">
              <button
                type="button"
                className="df-segment-btn"
                style={{ height: '36px', padding: '0 14px', fontSize: '13px' }}
                aria-pressed={filterTab === 'all'}
                onClick={() => setFilterTab('all')}
              >
                All ({shots.length})
              </button>
              <button
                type="button"
                className="df-segment-btn"
                style={{ height: '36px', padding: '0 14px', fontSize: '13px' }}
                aria-pressed={filterTab === 'story'}
                onClick={() => setFilterTab('story')}
              >
                Story ({storyShotCount})
              </button>
              <button
                type="button"
                className="df-segment-btn"
                style={{ height: '36px', padding: '0 14px', fontSize: '13px' }}
                aria-pressed={filterTab === 'dance'}
                onClick={() => setFilterTab('dance')}
              >
                Dance (+{bonusDanceCount})
              </button>
            </div>
          )}
        </div>

        <div>
          {visibleShots.map((shot, vIdx) => {
            const masterIdx = shots.findIndex((s) => s.number === shot.number);
            const shotNumStr = String(shot.number).padStart(2, '0');
            const isOpen = openShotNumber === shot.number;
            const orig = initialShots[masterIdx];
            const isModified = orig && (
              shot.whatHappens !== orig.whatHappens ||
              shot.camera !== orig.camera ||
              shot.howItEnds !== orig.howItEnds ||
              shot.danceMove !== orig.danceMove
            );

            let railClass = 'df-shot-rail df-shot-rail-mid';
            if (vIdx === 0) railClass = 'df-shot-rail df-shot-rail-first';
            if (vIdx === visibleShots.length - 1) railClass = 'df-shot-rail df-shot-rail-last';

            return (
              <div key={shot.number} className="df-shot-row">
                <span className={railClass} aria-hidden="true" />
                <span
                  className="df-shot-node"
                  aria-hidden="true"
                  style={{
                    top: '31px',
                    borderColor: shot.isDance ? '#ff7ab8' : 'var(--accent-cyan)',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px 20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 280px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: shot.isDance ? '#ff7ab8' : 'var(--text-muted)', marginBottom: '5px' }}>
                      {shot.isDance
                        ? `DANCE PROMPT ${String(shot.danceIndex || 1).padStart(2, '0')} (SHOT ${shotNumStr})  ·  ${shot.camera}`
                        : `SHOT ${shotNumStr}  ·  ${shot.timeRange || ''}  ·  ${shot.camera}`}
                    </div>
                    <p className={isOpen ? '' : 'df-clamp-2'} style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      {shot.whatHappens}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="df-btn-ghost"
                    aria-label={`${isOpen ? 'Close' : 'Edit'} prompt for shot ${shotNumStr}`}
                    aria-expanded={isOpen}
                    onClick={() => setOpenShotNumber(isOpen ? null : shot.number)}
                  >
                    {!isOpen && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2.5 13.5l.7-3L10.8 3a1.4 1.4 0 0 1 2 0l.2.2a1.4 1.4 0 0 1 0 2L5.5 12.8z" />
                      </svg>
                    )}
                    <span>{isOpen ? 'Close' : 'Edit prompt'}</span>
                  </button>
                </div>

                {isOpen && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line-hairline)' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label htmlFor={`shot-scene-${shot.number}`} className="df-label">
                        WHAT HAPPENS (3D PIXAR SCENE ACTION)
                      </label>
                      <textarea
                        id={`shot-scene-${shot.number}`}
                        className="df-textarea df-textarea-dense"
                        rows={2}
                        value={shot.whatHappens}
                        onChange={(e) => onUpdateShot(masterIdx, { whatHappens: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                      <div style={{ flex: '1 1 240px' }}>
                        <label htmlFor={`shot-camera-${shot.number}`} className="df-label">
                          CAMERA
                        </label>
                        <input
                          id={`shot-camera-${shot.number}`}
                          type="text"
                          className="df-input"
                          value={shot.camera}
                          onChange={(e) => onUpdateShot(masterIdx, { camera: e.target.value })}
                        />
                      </div>

                      <div style={{ flex: '1 1 240px' }}>
                        <label htmlFor={`shot-ends-${shot.number}`} className="df-label">
                          HOW IT ENDS
                        </label>
                        <input
                          id={`shot-ends-${shot.number}`}
                          type="text"
                          className="df-input"
                          value={shot.howItEnds}
                          onChange={(e) => onUpdateShot(masterIdx, { howItEnds: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="df-dashed-box" style={{ marginBottom: '16px' }}>
                      <span className="df-label" style={{ marginBottom: '8px' }}>
                        FULL 3D ANIMATED PIXAR PROMPT
                      </span>
                      <div className="df-readout">
                        {assembleShotPrompt(locked, shots, masterIdx)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="df-btn-primary df-btn-inline"
                        onClick={() => handleCopyPrompt(shot.number)}
                      >
                        <span>{copiedNumber === shot.number ? 'Copied prompt' : 'Copy prompt'}</span>
                      </button>

                      {isModified && (
                        <button
                          type="button"
                          className="df-btn-text"
                          onClick={() => onRevertShot(masterIdx)}
                        >
                          Revert to original
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filterTab !== 'dance' && filteredShots.length > 4 && (
          <div style={{ marginTop: '14px' }}>
            <button
              type="button"
              className="df-btn-text"
              onClick={onToggleShowAll}
            >
              <span>{showAllShots ? 'Show first 4 shots' : `See all ${filteredShots.length} shots`}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
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
          onClick={onCheckContinuity}
        >
          <span>Check continuity</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </section>
  );
}
