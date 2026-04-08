// Mission Log — Cardio Sessions
// CARDIO_SESSIONS: treadmill interval programs for indoor cardio
// Loaded before app.js — exposes window.CARDIO_SESSIONS globally
window.CARDIO_SESSIONS = {
  rower_intervals: {
    title: "Rower Intervals",
    equipment: "Water Rower",
    totalMin: 20,
    summary: "6 rounds · 2 min hard / 1 min easy",
    blocks: [{
      label: "Warmup",
      duration: 300,
      color: "#34d399",
      instruction: "Easy ~18 spm"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Push 26-28 spm"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 2 — drive through heels"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 3"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 4"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 5"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Final round"
    }, {
      label: "Cooldown",
      duration: 240,
      color: "#60a5fa",
      instruction: "Very easy, heart rate down"
    }]
  },
  rower_steady: {
    title: "Rower Steady State",
    equipment: "Water Rower",
    totalMin: 22,
    summary: "22 min zone 2 · 20-22 spm",
    blocks: [{
      label: "Warmup",
      duration: 180,
      color: "#34d399",
      instruction: "Easy 18 spm"
    }, {
      label: "Zone 2",
      duration: 1080,
      color: "#60a5fa",
      instruction: "Sustainable pace. Talk test. 20-22 spm."
    }, {
      label: "Cooldown",
      duration: 180,
      color: "#34d399",
      instruction: "Slow down"
    }]
  },
  walk_intervals: {
    title: "Walking Pad Intervals",
    equipment: "Walking Pad",
    totalMin: 20,
    summary: "5 rounds · 2 min fast / 2 min recovery",
    blocks: [{
      label: "Warmup",
      duration: 180,
      color: "#34d399",
      instruction: "Flat 3.5 km/h"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "5.5-6 km/h"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "3.5 km/h"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 2"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 3"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 4"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Final"
    }, {
      label: "Cooldown",
      duration: 180,
      color: "#60a5fa",
      instruction: "Flat slow"
    }]
  }
};
