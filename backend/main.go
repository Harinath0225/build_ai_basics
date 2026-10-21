package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"continuity-studio/internal/agent"
	"continuity-studio/internal/models"

	"github.com/joho/godotenv"
)

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {
	// 1. Load environment variables if .env exists
	_ = godotenv.Load()

	// 2. Initialize persistent storage for rules
	dataPath := "data"
	if envData := os.Getenv("DATA_PATH"); envData != "" {
		dataPath = envData
	}

	rulesMgr, err := agent.NewRulesManager(dataPath)
	if err != nil {
		log.Fatalf("Failed to initialize rules manager: %v", err)
	}

	// 3. Initialize Agent engine
	studioAgent := agent.NewAgent(rulesMgr)

	// 4. Setup HTTP routes
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/api/health", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "ok",
			"service": "ContinuityStudio Agent Server",
			"rules":   len(rulesMgr.GetRules()),
		})
	}))

	// Step 1: Expand story gist and compute scene breakdown
	mux.HandleFunc("/api/expand", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req models.ProjectRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, fmt.Sprintf("Invalid JSON: %v", err), http.StatusBadRequest)
			return
		}

		if req.StoryGist == "" {
			http.Error(w, "story_gist is required", http.StatusBadRequest)
			return
		}

		concept, err := studioAgent.ExpandConcept(req)
		if err != nil {
			http.Error(w, fmt.Sprintf("Expansion failed: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(concept)
	}))

	// Rules inspection endpoint
	mux.HandleFunc("/api/rules", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(rulesMgr.GetRules())
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🎬 ContinuityStudio Agent Server running on http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Server stopped: %v", err)
	}
}
