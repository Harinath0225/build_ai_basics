import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ConceptStudio from './components/ConceptStudio';
import LyricistLounge from './components/LyricistLounge';
import TimelineDirector from './components/TimelineDirector';
import ContinuityAudit from './components/ContinuityAudit';
import PromptDeck from './components/PromptDeck';

const DEMO_GIST =
  'Pip is a sleepy dreamer in a straw hat and copper goggles. He flies a clockwork ship over a velvet meadow of glowing hills, lands softly in the moss, and plants a tiny clover flag.';

const DEMO_STORY_PROMPT =
  '3D Animated Pixar film treatment: Pip, a sleepy dreamer in a straw hat and copper goggles, pilots a brass clockwork vessel above a velvet meadow of glowing butter hills, touches down in spongy moss, plants a tiny clover flag, and celebrates with joyful 3D animated dance breaks.';

const buildDemoAudioPrompt = (totalSec, storyCount, danceCount) => {
  const mins = Math.floor(totalSec / 60);
  const secs = String(totalSec % 60).padStart(2, '0');
  return `Suno AI Master Prompt (${mins}:${secs} duration): Warm, whimsical 3D Pixar orchestral-pop and electro-swing groove at 124 BPM. Gentle acoustic guitar and celesta chimes for the ${storyCount} story shots, building into an upbeat brass and percussive dance breakdown for the ${danceCount} bonus dance prompts. Expressive narrator vocal, crisp studio mix.`;
};

const buildDemoSunoLyrics = (totalSec, danceCount) => {
  const mins = Math.floor(totalSec / 60);
  const secs = String(totalSec % 60).padStart(2, '0');
  return `[Intro - 00:00 - Soft Celesta & Brass]
Drift above the velvet hill,
Clockwork wings in twilight still,
Straw hat tilted, goggles bright,
Floating through the golden light.

[Chorus - Upbeat Pixar Dance Groove - 124 BPM]
Spin the gears and tap the moss!
Every glowing hill we cross,
(${danceCount}x 3D Pixar Dance Prompts Cue: Syncopated footwork & joyful spin)
Plant the clover, catch the gleam,
Dancing inside a clockwork dream!

[Outro - 0${mins}:${secs} - Warm Acoustic Fade]
Lanterns dim and shadows fall,
Safe inside the mossy hall.`;
};

const DEMO_LOCKED = {
  character: 'Pip, a small 3D Pixar-style dreamer with twitching ears, a tiny straw hat and copper goggles.',
  world: 'A velvet meadow with spongy moss, glowing butter hills and drifting golden flower dust.',
  look: '3D Animated Pixar style, expressive character animation, soft Octane macro depth of field and rich subsurface scattering.',
  light: 'Twilight, warm gold key light with soft violet shadows.',
};

const BASE_STORY_TEMPLATES = [
  {
    camera: 'Wide macro dolly',
    whatHappens: 'Pip hangs in gentle suspension above the meadow in his 3D Pixar clockwork ship, ears twitching beneath his straw hat and copper goggles.',
    howItEnds: 'The brass hull drifts toward the cockpit window.',
  },
  {
    camera: 'Cockpit glass, forward',
    whatHappens: 'Reflections slide across the clockwork cockpit glass around Pip and his copper goggles as a hill of glowing velvet butter rushes closer.',
    howItEnds: 'Landing skids lower just above the mossy crest.',
  },
  {
    camera: 'Low-angle tracking',
    whatHappens: 'The ship touches down on spongy moss as Pip peers out in his copper goggles, sending golden flower dust floating into the twilight.',
    howItEnds: 'Pip steps down onto the quiet mossy hollow.',
  },
  {
    camera: 'Rotational arc',
    whatHappens: 'Pip, wearing his tiny straw hat and copper goggles, sets up a miniature flag with a clover emblem in the mossy hollow.',
    howItEnds: 'The clover emblem catches the warm twilight glow.',
  },
  {
    camera: 'Extreme macro close-up',
    whatHappens: 'Pip adjusts his copper goggles and tiny straw hat with expressive 3D Pixar animation as golden flower dust settles on his sleeve.',
    howItEnds: 'He gazes out toward the next ridge of glowing hills.',
  },
  {
    camera: 'Over-the-shoulder pan',
    whatHappens: 'From behind Pip’s straw hat and copper goggles, a ribbon of bioluminescent spores rises across the velvet meadow.',
    howItEnds: 'The spores swirl around Pip’s smiling face.',
  },
  {
    camera: 'Intimate portrait shot',
    whatHappens: "Close-up on Pip's face in the glow of the butter hills, ears twitching.",
    howItEnds: 'Pip smiles softly as a chime-like breeze passes.',
  },
  {
    camera: 'Lateral slider shot',
    whatHappens: 'Pip, wearing his straw hat and copper goggles, checks the brass pressure dial on the clockwork hull.',
    howItEnds: 'The tiny brass gears click into resting position.',
  },
  {
    camera: 'High crane tilt down',
    whatHappens: 'Overhead view of Pip in his copper goggles beside the resting ship in the glowing velvet hollow.',
    howItEnds: 'Long violet shadows stretch toward the clover flag.',
  },
  {
    camera: 'Slow dolly in',
    whatHappens: 'Pip tips his tiny straw hat and copper goggles toward the horizon as twilight deepens.',
    howItEnds: 'The breeze rustles the miniature clover flag.',
  },
  {
    camera: 'Slow dolly in',
    whatHappens: 'Slow dolly in on the clover flag as golden dust settles.',
    howItEnds: 'A single golden pollen mote rests on the flagstaff.',
  },
  {
    camera: 'Low-angle hero frame',
    whatHappens: 'Pip stands proudly in his copper goggles and straw hat beside the planted clover emblem.',
    howItEnds: 'He turns back toward the warm cabin lantern.',
  },
  {
    camera: 'Warm cabin interior shot',
    whatHappens: 'Inside the clockwork cabin, Pip rests his copper goggles on his forehead and yawns with expressive 3D Pixar charm.',
    howItEnds: 'Amber lantern light dims to a soft ember.',
  },
  {
    camera: 'Wide twilight pullback',
    whatHappens: 'The clockwork ship and Pip in his straw hat and copper goggles nestle peacefully in the spongy moss.',
    howItEnds: 'Firefly-like flower dust drifts into the indigo sky.',
  },
  {
    camera: 'High orbital crane rise',
    whatHappens: 'Rising high above the velvet meadow as Pip in his copper goggles waves from beside the tiny clover flag.',
    howItEnds: 'Golden pollen forms a glowing trail above the ship.',
  },
  {
    camera: 'Dynamic tracking glide',
    whatHappens: 'Pip, wearing his straw hat and copper goggles, skips along the glowing butter ridge as fireflies orbit his boots.',
    howItEnds: 'He pauses at a mossy overlook.',
  },
  {
    camera: 'Medium two-axis pan',
    whatHappens: 'Pip polishes his copper goggles with his sleeve and peers through a tiny brass spyglass at the distant stars.',
    howItEnds: 'Starlight reflects across the spyglass lens.',
  },
  {
    camera: 'Low-angle dolly push',
    whatHappens: 'Pip in his tiny straw hat and copper goggles winds the mainspring key on the clockwork ship’s tailfin.',
    howItEnds: 'A gentle chime rings out across the hollow.',
  },
  {
    camera: 'Sweeping jib arc',
    whatHappens: 'Pip sits on the ship’s brass wing in his copper goggles, swinging his boots over the spongy glowing moss.',
    howItEnds: 'Warm golden dust settles around the hull.',
  },
  {
    camera: 'Wide final tableau shot',
    whatHappens: 'Wide 3D Pixar tableau of Pip in his straw hat and copper goggles resting beside the glowing clockwork ship and clover flag.',
    howItEnds: 'Quiet stillness over the glowing butter hills.',
  },
];

const BONUS_DANCE_TEMPLATES = [
  {
    camera: 'Low-angle hero tracking',
    whatHappens: '3D Animated Pixar Dance Prompt: Pip in his straw hat and copper goggles performs an upbeat electro-swing footwork shuffle on the glowing moss.',
    danceMove: 'Rhythmic 3D Pixar heel-toe shuffle, bouncy knee groove and joyful arm swing at 124 BPM.',
    howItEnds: 'Pip lands on the downbeat as golden pollen bursts upward.',
  },
  {
    camera: '360 rotational orbit shot',
    whatHappens: '3D Animated Pixar Dance Prompt: Pip twirls around the tiny clover flag in his copper goggles with fluid Pixar character physics and cloth motion.',
    danceMove: 'Expressive 360-degree spin, hat-tip flair, and syncopated hip-and-shoulder bounce.',
    howItEnds: 'He finishes with a cheerful thumbs-up toward the camera.',
  },
  {
    camera: 'Wide stage dolly in',
    whatHappens: '3D Animated Pixar Dance Prompt: Pip dances atop the brass clockwork wing in his straw hat and copper goggles as lantern lights pulse to the Suno beat.',
    danceMove: 'Moonwalk glide across the brass wing into a crisp celebratory jump-freeze.',
    howItEnds: 'Glowing flower dust swirls in rhythm around his boots.',
  },
  {
    camera: 'Medium dynamic steadicam',
    whatHappens: '3D Animated Pixar Dance Prompt: Pip in his copper goggles grooves with playful step-claps and ear twitches synced to the brass chorus.',
    danceMove: 'Tempo-locked step-clap groove, playful head bob, and expressive 3D Pixar squash-and-stretch motion.',
    howItEnds: 'He slides smoothly into a wide stance on the mossy crest.',
  },
  {
    camera: 'Crane swoop finale shot',
    whatHappens: '3D Animated Pixar Dance Prompt: Pip performs a grand finale showstopper spin in his straw hat and copper goggles beside the glowing ship.',
    danceMove: 'High-energy pirouette and jazz-hands finale pose with intact wardrobe and lighting continuity.',
    howItEnds: 'Pip bows with a warm smile under the twilight sky.',
  },
];

function formatTimeRange(startSec, endSec) {
  const sMin = String(Math.floor(startSec / 60)).padStart(2, '0');
  const sRem = String(startSec % 60).padStart(2, '0');
  const eMin = String(Math.floor(endSec / 60)).padStart(2, '0');
  const eRem = String(endSec % 60).padStart(2, '0');
  return `${sMin}:${sRem}–${eMin}:${eRem}`;
}

function buildShotList(totalDuration, shotDuration, bonusDanceCount) {
  const storyCount = Math.max(1, Math.floor(totalDuration / shotDuration));
  const danceCount = Math.max(0, bonusDanceCount);
  const result = [];

  for (let i = 0; i < storyCount; i++) {
    const tpl = BASE_STORY_TEMPLATES[i % BASE_STORY_TEMPLATES.length];
    const startSec = i * shotDuration;
    const endSec = (i + 1) * shotDuration;
    result.push({
      number: i + 1,
      isDance: false,
      timeRange: formatTimeRange(startSec, endSec),
      camera: tpl.camera,
      whatHappens: tpl.whatHappens,
      howItEnds: tpl.howItEnds,
    });
  }

  for (let d = 0; d < danceCount; d++) {
    const tpl = BONUS_DANCE_TEMPLATES[d % BONUS_DANCE_TEMPLATES.length];
    result.push({
      number: storyCount + d + 1,
      isDance: true,
      danceIndex: d + 1,
      timeRange: `${shotDuration}s Dance Cut`,
      camera: tpl.camera,
      whatHappens: tpl.whatHappens,
      danceMove: tpl.danceMove,
      howItEnds: tpl.howItEnds,
    });
  }

  return result;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('story'); // 'story' | 'sound' | 'shots' | 'check' | 'export'
  const [projectTitle, setProjectTitle] = useState('Dreamer Pip & The Velvet Meadow');
  const [modelUsed, setModelUsed] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // Duration & Prompt Count settings (Default: 2 mins = 120s, 6s per shot = 20 video prompts, +5 bonus dance prompts = 25 total)
  const [totalDuration, setTotalDuration] = useState(120);
  const [shotDuration, setShotDuration] = useState(6);
  const [bonusDanceCount, setBonusDanceCount] = useState(5);

  const storyShotCount = Math.max(1, Math.floor(totalDuration / shotDuration));

  // Step 1: Story
  const [gist, setGist] = useState('');
  const [storyPrompt, setStoryPrompt] = useState(DEMO_STORY_PROMPT);
  const [suggestedStoryPrompt, setSuggestedStoryPrompt] = useState(DEMO_STORY_PROMPT);
  const [isLoading, setIsLoading] = useState(false);

  // Step 2: Sound (Suno)
  const [audioPrompt, setAudioPrompt] = useState(() => buildDemoAudioPrompt(120, 20, 5));
  const [suggestedAudioPrompt, setSuggestedAudioPrompt] = useState(() => buildDemoAudioPrompt(120, 20, 5));
  const [sunoLyrics, setSunoLyrics] = useState(() => buildDemoSunoLyrics(120, 5));

  // Step 3: Shots & Locked Details
  const [locked, setLocked] = useState({ ...DEMO_LOCKED });
  const [shots, setShots] = useState(() => buildShotList(120, 6, 5));
  const [initialShots, setInitialShots] = useState(() => buildShotList(120, 6, 5));
  const [showAllShots, setShowAllShots] = useState(false);

  // Step 4: Continuity Check manual resolutions
  const [resolvedFlags, setResolvedFlags] = useState({});

  // Check backend health on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.status === 'ok') {
          setBackendOnline(true);
          if (data.active_model) {
            setModelUsed(data.active_model);
          }
        }
      })
      .catch(() => setBackendOnline(false));
  }, []);

  const syncTimingAndPrompts = (newTotal, newShotDur, newDanceCount) => {
    const newStoryCount = Math.max(1, Math.floor(newTotal / newShotDur));
    const newAudio = buildDemoAudioPrompt(newTotal, newStoryCount, newDanceCount);
    setAudioPrompt(newAudio);
    setSuggestedAudioPrompt(newAudio);
    setSunoLyrics(buildDemoSunoLyrics(newTotal, newDanceCount));

    const rebuilt = buildShotList(newTotal, newShotDur, newDanceCount);
    setShots(rebuilt);
    setInitialShots(rebuilt.map((s) => ({ ...s })));
    setResolvedFlags({});
  };

  const handleChangeTotalDuration = (val) => {
    setTotalDuration(val);
    syncTimingAndPrompts(val, shotDuration, bonusDanceCount);
  };

  const handleChangeShotDuration = (val) => {
    setShotDuration(val);
    syncTimingAndPrompts(totalDuration, val, bonusDanceCount);
  };

  const handleChangeBonusDanceCount = (val) => {
    setBonusDanceCount(val);
    syncTimingAndPrompts(totalDuration, shotDuration, val);
  };

  const handleChangeGist = (val) => {
    setGist(val);
    if (val.trim()) {
      const autoStory =
        val.trim() === DEMO_GIST
          ? DEMO_STORY_PROMPT
          : `3D Animated Pixar film treatment: ${val.trim()} Directed across ${storyShotCount} narrative shots (${totalDuration}s total) plus ${bonusDanceCount} expressive Pixar 3D character dance prompts with locked wardrobe and lighting.`;
      if (storyPrompt === suggestedStoryPrompt) {
        setStoryPrompt(autoStory);
      }
      setSuggestedStoryPrompt(autoStory);
    }
  };

  const handleTryDemo = () => {
    setProjectTitle('Dreamer Pip & The Velvet Meadow');
    setTotalDuration(120);
    setShotDuration(6);
    setBonusDanceCount(5);
    setGist(DEMO_GIST);
    setStoryPrompt(DEMO_STORY_PROMPT);
    setSuggestedStoryPrompt(DEMO_STORY_PROMPT);
    const demoAudio = buildDemoAudioPrompt(120, 20, 5);
    setAudioPrompt(demoAudio);
    setSuggestedAudioPrompt(demoAudio);
    setSunoLyrics(buildDemoSunoLyrics(120, 5));
    setLocked({ ...DEMO_LOCKED });
    const built = buildShotList(120, 6, 5);
    setShots(built);
    setInitialShots(built.map((s) => ({ ...s })));
    setResolvedFlags({});
  };

  const handleContinueFromStory = async () => {
    if (!gist.trim()) return;

    // Call live Go agent server with Google AI Studio Gemini
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story_gist: gist.trim(),
          total_duration: totalDuration,
          scene_duration: shotDuration,
          bonus_dance_prompts: bonusDanceCount,
          visual_style: locked.look,
          music_genre: audioPrompt,
          include_dance: bonusDanceCount > 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.model_used) {
          setModelUsed(data.model_used);
        }
        if (data.title) setProjectTitle(data.title);
        if (data.logline) {
          setStoryPrompt(data.logline);
          setSuggestedStoryPrompt(data.logline);
        }
        if (data.suno_master_prompt) {
          setAudioPrompt(data.suno_master_prompt);
          setSuggestedAudioPrompt(data.suno_master_prompt);
        }
        if (data.lyrics) {
          setSunoLyrics(data.lyrics);
        }
        if (data.character_anchor?.visual_dna) {
          setLocked((prev) => ({
            ...prev,
            character: `${data.character_anchor.name}: ${data.character_anchor.visual_dna}`,
            light: data.character_anchor.lighting_key || prev.light,
          }));
        }
        if (Array.isArray(data.scenes) && data.scenes.length > 0) {
          const mappedShots = data.scenes.map((sc, i) => {
            const isDance = i >= storyShotCount;
            return {
              number: i + 1,
              isDance,
              danceIndex: isDance ? i - storyShotCount + 1 : undefined,
              timeRange: isDance ? `${shotDuration}s Dance Cut` : (sc.time_range || formatTimeRange(i * shotDuration, (i + 1) * shotDuration)),
              camera: sc.camera_angle || 'Wide macro dolly',
              whatHappens: sc.visual_summary || `3D Animated Pixar shot ${i + 1} action beat.`,
              danceMove: sc.dance_action ? sc.dance_action.trim() : undefined,
              howItEnds: isDance
                ? 'Lands on the musical downbeat with full character continuity.'
                : `Transitions smoothly into shot ${Math.min(data.scenes.length, i + 2)}.`,
            };
          });
          setShots(mappedShots);
          setInitialShots(mappedShots.map((s) => ({ ...s })));
          setResolvedFlags({});
        }
      }
    } catch {
      // Offline fallback: if backend is unreachable, continue with generated local plan
    } finally {
      setIsLoading(false);
      setCurrentScreen('sound');
    }
  };

  const handleChangeLocked = (field, val) => {
    setLocked((prev) => ({ ...prev, [field]: val }));
  };

  const handleUpdateShot = (index, patch) => {
    setShots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleRevertShot = (index) => {
    setShots((prev) => {
      const next = [...prev];
      next[index] = { ...initialShots[index] };
      return next;
    });
  };

  // Continuity check across all generated story & dance prompts
  const flaggedItems = useMemo(() => {
    const items = [];
    const isDemo = projectTitle.includes('Pip');

    shots.forEach((shot, idx) => {
      const textLower = shot.whatHappens.toLowerCase();
      const prevShot = idx > 0 ? shots[idx - 1] : null;

      // Check 1: Character feature anchor check
      if (isDemo) {
        const hasGoggles = textLower.includes('goggles');
        if (shot.number === 7) {
          const isFixed = hasGoggles || resolvedFlags[7];
          items.push({
            shotNumber: 7,
            reason: 'The copper goggles are missing. Pip wears them in every other shot.',
            suggestion:
              "Close-up on Pip's face framed by his copper goggles and tiny straw hat in the glow of the butter hills, ears twitching.",
            suggestedCamera: null,
            resolved: !!isFixed,
          });
          return;
        }
      } else {
        // Custom story: check if character anchor name is missing in middle shot
        const charName = (locked.character.split(':')[0] || '').trim().toLowerCase();
        if (charName && idx === Math.floor(storyShotCount / 2) && !textLower.includes(charName)) {
          const isFixed = resolvedFlags[shot.number];
          items.push({
            shotNumber: shot.number,
            reason: `Protagonist [${charName}] is not mentioned in this key story beat.`,
            suggestion: `${locked.character.split(':')[0]} steps into frame with full wardrobe details intact.`,
            suggestedCamera: null,
            resolved: !!isFixed,
          });
          return;
        }
      }

      // Check 2: Neighbouring shots repeating the same camera move
      const sameCameraAsPrev =
        prevShot &&
        prevShot.camera.trim().toLowerCase() === shot.camera.trim().toLowerCase();

      if ((isDemo && shot.number === 11) || sameCameraAsPrev) {
        const prevNum = prevShot ? String(prevShot.number).padStart(2, '0') : '10';
        const isFixed = !sameCameraAsPrev || resolvedFlags[shot.number];
        items.push({
          shotNumber: shot.number,
          reason: `Same camera move as shot ${prevNum}. Vary it so the shots do not blur together.`,
          suggestion:
            'High crane arc rising above the clover flag as golden flower dust settles into the twilight moss.',
          suggestedCamera: 'High crane arc',
          resolved: !!isFixed,
        });
      }
    });

    return items;
  }, [shots, resolvedFlags, projectTitle, locked.character, storyShotCount]);

  const handleAcceptSuggestion = async (shotNumber) => {
    const flag = flaggedItems.find((f) => f.shotNumber === shotNumber);
    const idx = shots.findIndex((s) => s.number === shotNumber);
    if (!flag || idx === -1) return;

    setShots((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        whatHappens: flag.suggestion,
        camera: flag.suggestedCamera || next[idx].camera,
      };
      return next;
    });

    setResolvedFlags((prev) => ({ ...prev, [shotNumber]: true }));

    try {
      await fetch('http://localhost:8080/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          visual_style: locked.look,
          character_anchor: {
            id: 'char_01',
            name: (locked.character.split(':')[0] || 'Character').trim(),
            visual_dna: locked.character,
            lighting_key: locked.light,
          },
          scenes: shots.map((s) => ({
            scene_number: s.number,
            camera_angle: s.camera,
            visual_summary: s.whatHappens,
            veo_prompt: s.whatHappens,
          })),
        }),
      });
    } catch {
      // Non-blocking if backend is offline
    }
  };

  const handleKeepVersion = (shotNumber) => {
    setResolvedFlags((prev) => ({ ...prev, [shotNumber]: true }));
  };

  return (
    <div className="df-app">
      {/* Quiet Space Motifs: Star Field & Top-Right Orbital Rings */}
      <div className="deep-field-stars" aria-hidden="true" />
      <svg
        className="deep-field-orbits"
        viewBox="0 0 760 560"
        fill="none"
        aria-hidden="true"
      >
        <g transform="rotate(-24 380 280)" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1">
          <ellipse cx="380" cy="280" rx="340" ry="130" />
          <ellipse cx="380" cy="280" rx="260" ry="100" />
          <ellipse cx="380" cy="280" rx="180" ry="70" />
        </g>
        <circle cx="489.5" cy="108" r="3" fill="#ff7ab8" />
        <circle cx="379" cy="388" r="2.5" fill="#00f0ff" />
      </svg>

      {/* Top Header & Step Trail */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        modelUsed={modelUsed}
        backendOnline={backendOnline}
      />

      {/* Main Content Stage */}
      <main className="df-main">
        {currentScreen === 'story' && (
          <ConceptStudio
            gist={gist}
            onChangeGist={handleChangeGist}
            totalDuration={totalDuration}
            onChangeTotalDuration={handleChangeTotalDuration}
            shotDuration={shotDuration}
            onChangeShotDuration={handleChangeShotDuration}
            bonusDanceCount={bonusDanceCount}
            onChangeBonusDanceCount={handleChangeBonusDanceCount}
            storyPrompt={storyPrompt}
            suggestedStoryPrompt={suggestedStoryPrompt}
            onChangeStoryPrompt={setStoryPrompt}
            onResetStoryPrompt={() => setStoryPrompt(suggestedStoryPrompt)}
            onTryDemo={handleTryDemo}
            onContinue={handleContinueFromStory}
            isLoading={isLoading}
          />
        )}

        {currentScreen === 'sound' && (
          <LyricistLounge
            totalDuration={totalDuration}
            storyShotCount={storyShotCount}
            bonusDanceCount={bonusDanceCount}
            audioPrompt={audioPrompt}
            suggestedAudioPrompt={suggestedAudioPrompt}
            onChangeAudioPrompt={setAudioPrompt}
            onResetAudioPrompt={() => setAudioPrompt(suggestedAudioPrompt)}
            sunoLyrics={sunoLyrics}
            onChangeSunoLyrics={setSunoLyrics}
            onBack={() => setCurrentScreen('story')}
            onContinue={() => setCurrentScreen('shots')}
          />
        )}

        {currentScreen === 'shots' && (
          <TimelineDirector
            locked={locked}
            onChangeLocked={handleChangeLocked}
            shots={shots}
            initialShots={initialShots}
            storyShotCount={storyShotCount}
            bonusDanceCount={bonusDanceCount}
            onUpdateShot={handleUpdateShot}
            onRevertShot={handleRevertShot}
            showAllShots={showAllShots}
            onToggleShowAll={() => setShowAllShots((prev) => !prev)}
            onBack={() => setCurrentScreen('sound')}
            onCheckContinuity={() => setCurrentScreen('check')}
          />
        )}

        {currentScreen === 'check' && (
          <ContinuityAudit
            projectTitle={projectTitle}
            shots={shots}
            flaggedItems={flaggedItems}
            onUpdateShotPrompt={(idx, val) => handleUpdateShot(idx, { whatHappens: val })}
            onAcceptSuggestion={handleAcceptSuggestion}
            onKeepVersion={handleKeepVersion}
            onReviewAllShots={() => {
              setShowAllShots(true);
              setCurrentScreen('shots');
            }}
            onExportPrompts={() => setCurrentScreen('export')}
          />
        )}

        {currentScreen === 'export' && (
          <PromptDeck
            projectTitle={projectTitle}
            gist={gist || DEMO_GIST}
            storyPrompt={storyPrompt}
            audioPrompt={audioPrompt}
            locked={locked}
            shots={shots}
          />
        )}
      </main>
    </div>
  );
}
