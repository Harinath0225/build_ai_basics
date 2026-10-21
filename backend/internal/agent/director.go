package agent

import (
	"fmt"
	"strings"

	"continuity-studio/internal/models"
)

// StudioBinderShots defines industry standard camera shot types
var StudioBinderShots = []struct {
	Name        string
	Category    string
	Description string
}{
	{
		Name:        "Wide Establishing Shot",
		Category:    "Framing",
		Description: "Expansive wide-angle frame establishing setting, environmental atmosphere, and subject scale.",
	},
	{
		Name:        "Low-Angle Hero Shot",
		Category:    "Perspective",
		Description: "Upward camera tilt from a low perspective to emphasize grandeur, stature, and dynamic power.",
	},
	{
		Name:        "Dolly In Tracking Shot",
		Category:    "Camera Movement",
		Description: "Smooth forward dolly tracking movement closing the distance between camera and protagonist with rich parallax.",
	},
	{
		Name:        "Tracking Shot",
		Category:    "Camera Movement",
		Description: "Lateral side-tracking camera traveling in parallel with subject movement, maintaining constant velocity.",
	},
	{
		Name:        "Crane / High-Angle Dynamic Shot",
		Category:    "Perspective",
		Description: "Sweeping overhead jib/crane shot revealing spatial geometry and scene layout from an elevated angle.",
	},
	{
		Name:        "Close-Up Expression Shot",
		Category:    "Framing",
		Description: "Tight shot capturing nuanced facial micro-expressions, eye reflections, and emotional intensity.",
	},
	{
		Name:        "Over-The-Shoulder Dynamic Shot",
		Category:    "Framing",
		Description: "Framing past the protagonist's shoulder to anchor visual perspective within the narrative space.",
	},
}

// UpdateSceneDirection updates a scene's prompt when the creator changes the camera angle or dance step
func (a *Agent) UpdateSceneDirection(scene *models.ScenePrompt, char models.CharacterAnchor, visualStyle string, includeDance bool) {
	danceClause := ""
	if includeDance && scene.DanceAction != "" {
		danceClause = fmt.Sprintf(" Choreography: %s.", strings.TrimSpace(scene.DanceAction))
	}

	scene.VeoPrompt = fmt.Sprintf("Google Veo Prompt: [%s] %s style. %s (%s). Lighting: %s. Action: %s.%s Cinematic 4K render, realistic human anatomy, continuous visual fidelity.",
		scene.CameraAngle, visualStyle, char.Name, char.VisualDNA, char.LightingKey, scene.VisualSummary, danceClause)
}
