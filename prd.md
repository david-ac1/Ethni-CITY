📄 Product Requirement Document (PRD)
1. Executive Summary
Ethni-CITY is a multimodal AI agent that promotes Ethical Tourism by connecting travelers' visuals with hyper-local, niche music. It transforms static vacation photos into "Sonic Story-Zines" that credit and promote local artists from the Global South.

2. Problem & Opportunity
The Problem: Social media algorithms over-reward "trending" mainstream tracks, leading travelers to use the same 5 songs for every location, erasing local musical diversity.

The Opportunity: Use Gemini's spatial and cultural reasoning to bypass the charts and highlight "un-mapped" local talent.

3. Core Features (The "One-Wonder")
Multimodal Vision-to-Vibe: Gemini analyzes uploaded photos to identify specific cultural and geographical markers (e.g., specific Lagos neighborhood architecture).

The Sonic Zoom (Spatial UI): A 3D map interface that cinematically "flies" the user to their photo's location to "tune in" to local frequencies.

Agentic DJ: A Gemini Live-powered voice agent that narrates the history of the discovered niche music.

Interleaved Storyboard: Automated generation of a "Zine-style" social post containing enhanced photos, captions, and streamable local music links.

4. Technical Stack (GCP Mandatory)
AI Models: gemini-live-2.5-flash-native-audio (for the Live Agent) and Gemini 1.5 Pro (for high-fidelity image/cultural analysis).

Framework: Agent Development Kit (ADK) for real-time bidi-streaming.

Maps: Google Maps Photorealistic 3D Tiles API (rendered via CesiumJS).

Cloud Infrastructure: Google Cloud Run for backend hosting and Vertex AI for model orchestration.

🛠️ Implementation Plan (48-Hour Sprint)
Phase 1: The "Brain" (Backend Setup) - Day 1, Morning
Task 1: Initialize a Google Cloud Project and enable Vertex AI and Map Tiles API.

Task 2: Deploy a Python FastAPI backend on Cloud Run.

Task 3: Implement the ADK root_agent. Define tools for Google Search (to find niche artists) and Geocoding (to convert photo data to map coordinates).

Phase 2: The "Ear & Voice" (Live API) - Day 1, Afternoon
Task 1: Integrate the Gemini Live API via the ADK.

Task 2: Set up the Bidi-streaming WebSocket. Configure the agent with the "Global South Radio DJ" persona.

Task 3: Test "Barge-in" capabilities—ensure the user can say "Show me something more folk-oriented" and the agent updates the search.

Phase 3: The "Eyes" (3D Map & UI) - Day 2, Morning
Task 1: Set up the CesiumJS viewer in the React frontend.

Task 2: Hook the backend location output to the camera.flyTo() function to execute the "Sonic Zoom."

Task 3: Apply the Pop-Maximalist CSS (thick black borders, clashing earth tones) to the dashboard.

Phase 4: The "Final Reel" (Output & Submission) - Day 2, Evening
Task 1: Build the "Zine" component that renders the interleaved output (Photo + Caption + Music Widget).

Task 2: Record the 4-minute demo video. Ensure you show:

User uploading a photo.

Agent identifying the culture verbally.

The 3D Map zooming in.

The final "Story-Zine" result.

Task 3: Finalize the Architecture Diagram and README.md with spin-up instructions.

🎯 Hackathon Checklist (For 30% Bonus)
[ ] Cloud Deployment Proof: Recorded clip of the Google Cloud Console logs during the demo.

[ ] Architecture Diagram: Visualizing the flow from ADK -> Vertex AI -> Cloud Run.

[ ] GDG Profile: Ensure all team members have signed up for a Google Developer Group.