import React, { useState } from 'react';
import { assembleShotPrompt } from './TimelineDirector';

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2v8M4.5 7L8 10.5 11.5 7M3 13h10" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V3.8A1.3 1.3 0 0 0 9.2 2.5H3.8A1.3 1.3 0 0 0 2.5 3.8v5.4a1.3 1.3 0 0 0 1.3 1.3h1.7" />
    </svg>
  );
}

function triggerDownload(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function PromptDeck({
  projectTitle,
  gist,
  storyPrompt,
  audioPrompt,
  locked,
  shots,
}) {
  const [mode, setMode] = useState('video'); // 'video' | 'timeline'
  const [copiedAll, setCopiedAll] = useState(false);
  const [dispatcherOpen, setDispatcherOpen] = useState(false);

  const buildAllPromptsText = () => {
    const header = [
      `${projectTitle}`,
      `Sound: ${audioPrompt}`,
      `Character: ${locked.character}`,
      `World: ${locked.world}`,
      `Look: ${locked.look}`,
      `Light: ${locked.light}`,
      '',
    ].join('\n');

    const body = shots
      .map((s, idx) => {
        const num = String(s.number).padStart(2, '0');
        return `--- SHOT ${num} ---\n${assembleShotPrompt(locked, shots, idx)}`;
      })
      .join('\n\n');

    return `${header}\n${body}`;
  };

  const buildCSV = () => {
    const escapeCSV = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
    const rows = [
      ['Shot', 'Camera', 'Starts', 'Scene', 'Ends', 'Look', 'Character', 'World', 'Light', 'Audio'].map(escapeCSV).join(','),
    ];
    shots.forEach((s, idx) => {
      const starts = idx === 0 ? 'Opening shot' : (shots[idx - 1]?.howItEnds || '');
      rows.push(
        [
          `SHOT ${String(s.number).padStart(2, '0')}`,
          s.camera,
          starts,
          s.whatHappens,
          s.howItEnds,
          locked.look,
          locked.character,
          locked.world,
          locked.light,
          audioPrompt,
        ]
          .map(escapeCSV)
          .join(',')
      );
    });
    return rows.join('\n');
  };

  const buildJSON = () => {
    const payload = {
      project: projectTitle,
      gist,
      story_prompt: storyPrompt,
      audio_prompt: audioPrompt,
      locked,
      shots: shots.map((s, idx) => ({
        shot: s.number,
        camera: s.camera,
        starts: idx === 0 ? 'Opening shot' : shots[idx - 1]?.howItEnds,
        scene: s.whatHappens,
        ends: s.howItEnds,
        assembled_prompt: assembleShotPrompt(locked, shots, idx),
      })),
    };
    return JSON.stringify(payload, null, 2);
  };

  const buildMarkdown = () => {
    const lines = [
      `# ${projectTitle}`,
      '',
      `## Story & Sound`,
      `- **Story Prompt:** ${storyPrompt}`,
      `- **Audio Prompt:** ${audioPrompt}`,
      '',
      `## Locked in Every Shot`,
      `- **Character:** ${locked.character}`,
      `- **World:** ${locked.world}`,
      `- **Look:** ${locked.look}`,
      `- **Light:** ${locked.light}`,
      '',
      `## Shots (${shots.length})`,
      '',
    ];
    shots.forEach((s, idx) => {
      const num = String(s.number).padStart(2, '0');
      lines.push(`### Shot ${num} · ${s.camera}`);
      lines.push('```');
      lines.push(assembleShotPrompt(locked, shots, idx));
      lines.push('```');
      lines.push('');
    });
    return lines.join('\n');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(buildAllPromptsText());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const videoFormats = [
    {
      title: 'Image directing sheet',
      sub: 'Prompt sheet',
      actionLabel: 'Download',
      onClick: () => triggerDownload('continuity-directing-sheet.md', buildMarkdown(), 'text/markdown;charset=utf-8'),
    },
    {
      title: 'Text-to-video matrix',
      sub: 'Prompts as CSV',
      actionLabel: 'Download',
      onClick: () => triggerDownload('continuity-video-matrix.csv', buildCSV(), 'text/csv;charset=utf-8'),
    },
    {
      title: 'Realtime video dispatcher',
      sub: 'Live prompt dispatch',
      actionLabel: dispatcherOpen ? 'Close' : 'Open',
      onClick: () => setDispatcherOpen((prev) => !prev),
    },
  ];

  const timelineFormats = [
    {
      title: 'Timeline shot markers',
      sub: 'Shot handoff & camera sheet',
      actionLabel: 'Download',
      onClick: () => triggerDownload('continuity-timeline-markers.txt', buildAllPromptsText()),
    },
    {
      title: 'Audio & narration cue sheet',
      sub: 'Sound brief & shot sync',
      actionLabel: 'Download',
      onClick: () =>
        triggerDownload(
          'continuity-audio-cues.txt',
          `AUDIO BRIEF:\n${audioPrompt}\n\nSHOT SYNC:\n` +
            shots.map((s) => `SHOT ${String(s.number).padStart(2, '0')} (${s.camera}): ${s.whatHappens}`).join('\n')
        ),
    },
    {
      title: 'NLE interchange bundle',
      sub: 'Structured timeline JSON',
      actionLabel: 'Download',
      onClick: () => triggerDownload('continuity-timeline.json', buildJSON(), 'application/json;charset=utf-8'),
    },
  ];

  const activeFormats = mode === 'video' ? videoFormats : timelineFormats;

  return (
    <section className="df-col-760" aria-labelledby="export-heading">
      <div style={{ marginBottom: '28px' }}>
        <p className="df-eyebrow">{projectTitle}</p>
        <h1 id="export-heading" className="df-title-xl">
          Export your prompts
        </h1>
        <p className="df-intro">
          Copy everything at once, or pick the format your tool expects.
        </p>
      </div>

      {/* Primary Action */}
      <div style={{ marginBottom: '36px' }}>
        <button
          type="button"
          className="df-btn-primary"
          onClick={handleCopyAll}
        >
          <CopyIcon />
          <span>{copiedAll ? `Copied all ${shots.length} prompts` : `Copy all ${shots.length} prompts`}</span>
        </button>
      </div>

      {/* Segmented Switch */}
      <div style={{ marginBottom: '24px' }}>
        <div className="df-segmented" role="group" aria-label="Export target">
          <button
            type="button"
            className="df-segment-btn"
            aria-pressed={mode === 'video'}
            onClick={() => setMode('video')}
          >
            Video tool
          </button>
          <button
            type="button"
            className="df-segment-btn"
            aria-pressed={mode === 'timeline'}
            onClick={() => setMode('timeline')}
          >
            Editing timeline
          </button>
        </div>
      </div>

      {/* Format Rows */}
      <div>
        {activeFormats.map((item) => (
          <div key={item.title} className="df-list-row">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px 20px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {item.title}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {item.sub}
                </div>
              </div>

              <button
                type="button"
                className="df-btn-ghost"
                onClick={item.onClick}
              >
                <DownloadIcon />
                <span>{item.actionLabel}</span>
              </button>
            </div>

            {item.title === 'Realtime video dispatcher' && dispatcherOpen && (
              <div style={{ marginTop: '18px' }}>
                <div className="df-dashed-box">
                  <span className="df-label" style={{ marginBottom: '8px' }}>
                    LIVE DISPATCH STREAM ({shots.length} SHOTS READY)
                  </span>
                  <div className="df-readout" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {buildAllPromptsText()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Raw Data Note */}
      <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
        Need the raw data?{' '}
        <button
          type="button"
          onClick={() => triggerDownload('continuity-prompts.json', buildJSON(), 'application/json;charset=utf-8')}
          style={{ background: 'none', border: 'none', color: 'var(--text-soft)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', padding: 0 }}
        >
          JSON
        </button>
        ,{' '}
        <button
          type="button"
          onClick={() => triggerDownload('continuity-prompts.txt', buildAllPromptsText())}
          style={{ background: 'none', border: 'none', color: 'var(--text-soft)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', padding: 0 }}
        >
          TXT
        </button>{' '}
        and{' '}
        <button
          type="button"
          onClick={() => triggerDownload('continuity-prompts.md', buildMarkdown(), 'text/markdown;charset=utf-8')}
          style={{ background: 'none', border: 'none', color: 'var(--text-soft)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', padding: 0 }}
        >
          Markdown
        </button>{' '}
        are available too.
      </p>
    </section>
  );
}
