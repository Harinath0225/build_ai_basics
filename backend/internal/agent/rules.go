package agent

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"continuity-studio/internal/models"
)

// RulesManager manages persistent continuity rules on disk and in memory
type RulesManager struct {
	filePath string
	mu       sync.RWMutex
	rules    []models.ContinuityRule
}

// NewRulesManager initializes and loads the rules from disk
func NewRulesManager(dataPath string) (*RulesManager, error) {
	if err := os.MkdirAll(dataPath, 0755); err != nil {
		return nil, fmt.Errorf("failed to create data dir: %w", err)
	}

	ruleFile := filepath.Join(dataPath, "rules.json")
	rm := &RulesManager{
		filePath: ruleFile,
		rules:    []models.ContinuityRule{},
	}

	if err := rm.load(); err != nil {
		// Initialize default continuity rules
		rm.rules = []models.ContinuityRule{
			{
				ID:          "rule_char_01",
				Category:    "character",
				Constraint:  "Protagonist costume details (cobalt-blue leather aviator jacket, brass buckles, dark denim) must remain unchanged across all scene cuts.",
				Version:     1,
				LastPatched: time.Now().Format(time.RFC3339),
			},
			{
				ID:          "rule_light_01",
				Category:    "lighting",
				Constraint:  "Lighting key must maintain neon-cyan rim light and golden-amber fill across day/night transitions.",
				Version:     1,
				LastPatched: time.Now().Format(time.RFC3339),
			},
			{
				ID:          "rule_dance_01",
				Category:    "motion",
				Constraint:  "Choreography and human dance moves must preserve realistic anatomy and outfit physics without morphing fabric or limb geometry.",
				Version:     1,
				LastPatched: time.Now().Format(time.RFC3339),
			},
		}
		_ = rm.save()
	}

	return rm, nil
}

func (rm *RulesManager) load() error {
	rm.mu.Lock()
	defer rm.mu.Unlock()

	data, err := os.ReadFile(rm.filePath)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, &rm.rules)
}

func (rm *RulesManager) save() error {
	data, err := json.MarshalIndent(rm.rules, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(rm.filePath, data, 0644)
}

// GetRules returns all active in-memory continuity rules
func (rm *RulesManager) GetRules() []models.ContinuityRule {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	copied := make([]models.ContinuityRule, len(rm.rules))
	copy(copied, rm.rules)
	return copied
}

// PatchRule autonomously appends or updates a rule on disk and reloads it into memory
func (rm *RulesManager) PatchRule(category, constraint string) (*models.ContinuityRule, error) {
	rm.mu.Lock()
	defer rm.mu.Unlock()

	newRule := models.ContinuityRule{
		ID:          fmt.Sprintf("rule_patch_%d", time.Now().UnixNano()%10000),
		Category:    category,
		Constraint:  constraint,
		Version:     1,
		LastPatched: time.Now().Format(time.RFC3339),
	}

	rm.rules = append(rm.rules, newRule)

	// Persist to disk immediately
	data, err := json.MarshalIndent(rm.rules, "", "  ")
	if err != nil {
		return nil, err
	}

	if err := os.WriteFile(rm.filePath, data, 0644); err != nil {
		return nil, fmt.Errorf("failed to save patched rules to %s: %w", rm.filePath, err)
	}

	return &newRule, nil
}
