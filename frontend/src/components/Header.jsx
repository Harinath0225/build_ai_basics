import React from 'react';

function BrandMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <ellipse
        cx="14"
        cy="14"
        rx="12"
        ry="5"
        transform="rotate(-30 14 14)"
        stroke="#f4f4fe"
        strokeWidth="1.4"
      />
      <circle cx="14" cy="14" r="3.2" fill="#f4f4fe" />
      <circle cx="23.6" cy="12.2" r="2.4" fill="#ff7ab8" />
    </svg>
  );
}

function StepIcon({ id }) {
  switch (id) {
    case 'story':
      return (
        <svg className="df-step-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5C7.5 10.9 5.1 8.5 1.5 8 5.1 7.5 7.5 5.1 8 1.5z" />
        </svg>
      );
    case 'sound':
      return (
        <svg className="df-step-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="8" cy="8" r="1.4" />
          <path d="M5 5.2a4.2 4.2 0 0 0 0 5.6M11 5.2a4.2 4.2 0 0 1 0 5.6M2.8 3a7.2 7.2 0 0 0 0 10M13.2 3a7.2 7.2 0 0 1 0 10" />
        </svg>
      );
    case 'shots':
      return (
        <svg className="df-step-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="8" cy="8" rx="6.6" ry="2.8" transform="rotate(-30 8 8)" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
      );
    case 'check':
      return (
        <svg className="df-step-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="8" cy="8" r="4.6" />
          <path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Header({ currentScreen, onNavigate }) {
  const steps = [
    { id: 'story', label: 'Story' },
    { id: 'sound', label: 'Sound' },
    { id: 'shots', label: 'Shots' },
    { id: 'check', label: 'Check' },
  ];

  return (
    <header className="df-header">
      <button
        type="button"
        className="df-brand"
        onClick={() => onNavigate('story')}
        aria-label="Continuity Studio — Go to first step"
      >
        <BrandMark />
        <span>Continuity Studio</span>
      </button>

      {currentScreen === 'export' ? (
        <button
          type="button"
          className="df-step-link"
          onClick={() => onNavigate('check')}
          style={{ color: 'var(--text-main)', fontWeight: 500 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          <span>Back to check</span>
        </button>
      ) : (
        <nav aria-label="Production steps">
          <ol className="df-step-trail">
            {steps.map((step, index) => {
              const isCurrent = currentScreen === step.id;
              return (
                <li key={step.id} className="df-step-item">
                  {index > 0 && <span className="df-step-connector" aria-hidden="true" />}
                  <button
                    type="button"
                    className="df-step-link"
                    aria-current={isCurrent ? 'step' : undefined}
                    onClick={() => onNavigate(step.id)}
                  >
                    <StepIcon id={step.id} />
                    <span>{step.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </header>
  );
}
