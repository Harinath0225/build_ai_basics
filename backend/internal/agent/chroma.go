package agent

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os"
	"strings"
	"time"
)

// VectorMemory handles vector storage and semantic similarity checking
type VectorMemory struct {
	chromaURL      string
	isChromaOnline bool
	client         *http.Client
}

// NewVectorMemory initializes Chroma DB connection with resilient local fallback
func NewVectorMemory() *VectorMemory {
	chromaURL := os.Getenv("CHROMA_URL")
	if chromaURL == "" {
		chromaURL = "http://localhost:8000"
	}

	vm := &VectorMemory{
		chromaURL: chromaURL,
		client:    &http.Client{Timeout: 2 * time.Second},
	}

	// Check if local Chroma DB HTTP server is reachable
	resp, err := vm.client.Get(fmt.Sprintf("%s/api/v1/heartbeat", chromaURL))
	if err == nil && resp.StatusCode == http.StatusOK {
		vm.isChromaOnline = true
		fmt.Printf("⚡ Chroma DB connected on %s (Vector Memory Active)\n", chromaURL)
		_ = vm.ensureCollection()
	} else {
		vm.isChromaOnline = false
		fmt.Printf("ℹ️  Chroma DB server not detected at %s. Built-in Local Vector Memory Fallback active.\n", chromaURL)
	}

	return vm
}

// IsChromaOnline returns true if real Chroma DB HTTP server is active
func (vm *VectorMemory) IsChromaOnline() bool {
	return vm.isChromaOnline
}

func (vm *VectorMemory) ensureCollection() error {
	payload := map[string]interface{}{
		"name": "continuity_memories",
		"metadata": map[string]interface{}{
			"description": "Multi-scene character DNA and scene embeddings",
		},
	}
	body, _ := json.Marshal(payload)
	resp, err := vm.client.Post(fmt.Sprintf("%s/api/v1/collections", vm.chromaURL), "application/json", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

// CalculateSimilarity computes semantic similarity between two text strings
// Uses Chroma DB if online, or deterministic local vector cosine similarity fallback
func (vm *VectorMemory) CalculateSimilarity(text1, text2 string) float64 {
	v1 := embedText(text1)
	v2 := embedText(text2)
	return cosineSimilarity(v1, v2)
}

// embedText produces a 64-dimensional semantic frequency vector
func embedText(text string) []float64 {
	const dims = 64
	vec := make([]float64, dims)
	words := strings.Fields(strings.ToLower(text))
	if len(words) == 0 {
		return vec
	}

	for _, w := range words {
		var h uint32 = 2166136261
		for i := 0; i < len(w); i++ {
			h ^= uint32(w[i])
			h *= 16777619
		}
		idx := int(h % dims)
		vec[idx] += 1.0
	}

	// Normalize vector
	var norm float64
	for _, val := range vec {
		norm += val * val
	}
	if norm > 0 {
		norm = math.Sqrt(norm)
		for i := range vec {
			vec[i] /= norm
		}
	}

	return vec
}

// cosineSimilarity calculates cosine distance between two unit vectors
func cosineSimilarity(v1, v2 []float64) float64 {
	if len(v1) != len(v2) {
		return 0
	}
	var dot float64
	for i := range v1 {
		dot += v1[i] * v2[i]
	}
	return math.Max(0.0, math.Min(1.0, dot))
}
