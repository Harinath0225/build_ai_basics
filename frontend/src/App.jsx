import React, { useState } from 'react';
import Header from './components/Header';
import ConceptStudio from './components/ConceptStudio';
import LyricistLounge from './components/LyricistLounge';
import TimelineDirector from './components/TimelineDirector';
import ContinuityAudit from './components/ContinuityAudit';
import PromptDeck from './components/PromptDeck';

export default function App() {
  const [formData, setFormData] = useState({
    storyGist: '',
    totalDuration: 60,
    sceneDuration: 6,
    visualStyle: 'Cinematic 3D Animation (Pixar/Dreamworks aesthetic)',
    musicGenre: 'Upbeat Electro-Swing Rhyme, 124 BPM, brass stabs',
    includeDance: true,
  });

  const [concept, setConcept] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreloadSample = () => {
    setFormData({
      storyGist: 'A whimsical young inventor in a clockwork metropolis discovers a clockwork dragon that breathes sparks to the rhythm of jazz beats.',
      totalDuration: 60,
      sceneDuration: 6,
      visualStyle: 'Cinematic 3D Animation (Pixar/Dreamworks aesthetic)',
      musicGenre: 'Upbeat Electro-Swing Rhyme, 124 BPM, brass stabs',
      includeDance: true,
    });
    setError(null);
  };

  const handleReset = () => {
    setConcept(null);
    setError(null);
  };

  const handleExpand = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story_gist: formData.storyGist,
          total_duration: formData.totalDuration,
          scene_duration: formData.sceneDuration,
          visual_style: formData.visualStyle,
          music_genre: formData.musicGenre,
          include_dance: formData.includeDance,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      setConcept(data);
    } catch (err) {
      console.error('Error expanding concept:', err);
      setError('Could not connect to Go backend on http://localhost:8080. Make sure the Go server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateScene = (index, updatedScene) => {
    setConcept(prev => {
      if (!prev) return prev;
      const updatedScenes = [...prev.scenes];
      updatedScenes[index] = updatedScene;
      return { ...prev, scenes: updatedScenes };
    });
  };

  const handleAuditComplete = (auditResult) => {
    if (auditResult?.scenes) {
      setConcept(prev => ({
        ...prev,
        scenes: auditResult.scenes
      }));
    }
  };

  return (
    <div className="app-container">
      <Header 
        onPreloadSample={handlePreloadSample} 
        onReset={handleReset} 
        isExpanded={!!concept} 
      />

      {error && (
        <div style={{ 
          background: 'rgba(244, 63, 94, 0.1)', 
          border: '1px solid rgba(244, 63, 94, 0.3)', 
          borderRadius: '12px', 
          padding: '16px', 
          color: '#fda4af', 
          marginBottom: '24px' 
        }}>
          <strong>Connection Notice:</strong> {error}
        </div>
      )}

      <ConceptStudio 
        formData={formData} 
        setFormData={setFormData} 
        onExpand={handleExpand} 
        isLoading={isLoading} 
      />

      {concept && (
        <>
          <LyricistLounge concept={concept} />
          <TimelineDirector 
            concept={concept}
            onUpdateScene={handleUpdateScene}
            visualStyle={formData.visualStyle}
            includeDance={formData.includeDance}
          />
          <ContinuityAudit 
            concept={concept}
            onAuditComplete={handleAuditComplete}
          />
          <PromptDeck concept={concept} />
        </>
      )}
    </div>
  );
}
