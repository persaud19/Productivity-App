// Mission Log — Training Data
// STRENGTH_POOL: exercise library grouped by equipment type
// EQUIP_COLORS: colour map for equipment badges
// Loaded before app.js — exposes window.STRENGTH_POOL and window.EQUIP_COLORS globally
window.STRENGTH_POOL = {
  chest_tri: [{
    id: "bp_floor",
    name: "Dumbbell Floor Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "DBs at chest, press up, elbows at 45°."
  }, {
    id: "pushup",
    name: "Push-Ups",
    sets: "3×max",
    equip: "bodyweight",
    tip: "Chest touches floor, full range every rep."
  }, {
    id: "diamond",
    name: "Diamond Push-Ups",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Hands form triangle. Hits triceps hard."
  }, {
    id: "tri_push",
    name: "Band Tricep Pushdown",
    sets: "3×15",
    equip: "band",
    tip: "Elbows tucked, push to full extension."
  }, {
    id: "tri_oh",
    name: "Band Overhead Tricep Extension",
    sets: "3×12",
    equip: "band",
    tip: "Stand on band, extend overhead."
  }, {
    id: "chest_fly",
    name: "Dumbbell Chest Fly",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Wide arc, squeeze at top."
  }, {
    id: "band_chest",
    name: "Band Chest Press",
    sets: "3×15",
    equip: "band",
    tip: "Anchor behind, press forward."
  }, {
    id: "mb_pushup",
    name: "Med Ball Push-Up",
    sets: "3×10",
    equip: "med ball",
    tip: "Both hands on ball, extra stability."
  }, {
    id: "close_press",
    name: "Close-Grip DB Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "DBs touching throughout."
  }, {
    id: "tri_kick",
    name: "Tricep Kickback",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Hinge forward, kick DB back."
  }],
  back_bi: [{
    id: "db_row",
    name: "Dumbbell Row",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Flat back, drive elbow up and back."
  }, {
    id: "band_row",
    name: "Band Seated Row",
    sets: "3×15",
    equip: "band",
    tip: "Row to ribs, squeeze shoulder blades."
  }, {
    id: "face_pull",
    name: "Band Face Pulls",
    sets: "3×15",
    equip: "band",
    tip: "Anchor eye level, pull to face, elbows high."
  }, {
    id: "lat_pull",
    name: "Band Lat Pulldown",
    sets: "3×12",
    equip: "band",
    tip: "Anchor overhead, pull to upper chest."
  }, {
    id: "pull_apart",
    name: "Band Pull-Aparts",
    sets: "3×15",
    equip: "band",
    tip: "Arms straight, pull apart to chest."
  }, {
    id: "rev_fly",
    name: "Band Reverse Fly",
    sets: "3×12",
    equip: "band",
    tip: "Hinge forward, arms out like wings."
  }, {
    id: "band_curl",
    name: "Band Bicep Curls",
    sets: "3×15",
    equip: "band",
    tip: "Elbows pinned to sides."
  }, {
    id: "db_curl",
    name: "Dumbbell Bicep Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Supinate at top."
  }, {
    id: "hammer",
    name: "Hammer Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Neutral grip, hits brachialis."
  }, {
    id: "conc_curl",
    name: "Concentration Curls",
    sets: "3×10",
    equip: "dumbbells",
    tip: "Elbow on thigh, one arm at a time."
  }],
  legs_glutes: [{
    id: "band_squat",
    name: "Band Squats",
    sets: "3×15",
    equip: "band",
    tip: "Stand on band, hold at shoulders."
  }, {
    id: "goblet",
    name: "Med Ball Goblet Squat",
    sets: "3×12",
    equip: "med ball",
    tip: "Hold at chest, deep squat."
  }, {
    id: "rdl",
    name: "Dumbbell RDL",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Hinge at hips, feel hamstrings load."
  }, {
    id: "split_squat",
    name: "Rear-Foot Elevated Split Squat",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Back foot on couch."
  }, {
    id: "rev_lunge",
    name: "Reverse Lunges",
    sets: "3×10",
    equip: "dumbbells",
    tip: "Step back, lower knee to floor."
  }, {
    id: "band_abduct",
    name: "Band Hip Abductions",
    sets: "3×15",
    equip: "band",
    tip: "Band at ankles, kick out to side."
  }, {
    id: "band_lat",
    name: "Band Lateral Walks",
    sets: "3×20",
    equip: "band",
    tip: "10 steps each direction."
  }, {
    id: "glute_kick",
    name: "Band Glute Kickbacks",
    sets: "3×15",
    equip: "band",
    tip: "Drive heel back and squeeze."
  }, {
    id: "sumo",
    name: "Sumo Squat",
    sets: "3×12",
    equip: "med ball",
    tip: "Wide stance, hold ball between legs."
  }, {
    id: "clamshell_b",
    name: "Band Clamshells",
    sets: "3×20",
    equip: "band",
    tip: "Side-lying, rotate knee up."
  }],
  shoulders_core: [{
    id: "db_press",
    name: "DB Shoulder Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "DBs at ear level, press overhead."
  }, {
    id: "lat_raise",
    name: "Lateral Raises",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Lead with elbows, shoulder height."
  }, {
    id: "ab_roller",
    name: "Ab Roller Rollouts",
    sets: "3×8",
    equip: "ab roller",
    tip: "Roll forward, pull back with abs — no hip sag."
  }, {
    id: "mb_twist",
    name: "Med Ball Russian Twists",
    sets: "3×20",
    equip: "med ball",
    tip: "Feet off floor, twist side to side."
  }, {
    id: "plank",
    name: "Plank Hold",
    sets: "3×30s",
    equip: "bodyweight",
    tip: "Squeeze everything."
  }, {
    id: "mb_slam",
    name: "Med Ball Slam",
    sets: "3×10",
    equip: "med ball",
    tip: "Slam hard, catch the bounce."
  }, {
    id: "band_press",
    name: "Band Overhead Press",
    sets: "3×15",
    equip: "band",
    tip: "Stand on band, press overhead."
  }, {
    id: "front_raise",
    name: "Front Raises",
    sets: "3×12",
    equip: "band",
    tip: "One arm at a time."
  }, {
    id: "upright_row",
    name: "Band Upright Row",
    sets: "3×12",
    equip: "band",
    tip: "Pull to chin, elbows flare out."
  }, {
    id: "roller_pike",
    name: "Ab Roller Pike",
    sets: "3×8",
    equip: "ab roller",
    tip: "Start in plank, pike hips up."
  }],
  push_pull: [{
    id: "pp_pushup",
    name: "Push-Ups (controlled)",
    sets: "3×12",
    equip: "bodyweight",
    tip: "3 sec down, explode up."
  }, {
    id: "pp_row",
    name: "Band Row (wide grip)",
    sets: "3×15",
    equip: "band",
    tip: "Elbows wide for upper back."
  }, {
    id: "pp_floor",
    name: "DB Floor Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Full range of motion."
  }, {
    id: "pp_revfly",
    name: "Band Reverse Fly",
    sets: "3×12",
    equip: "band",
    tip: "Pull arms wide, rear delts."
  }, {
    id: "pp_mbpush",
    name: "Med Ball Push-Up",
    sets: "3×10",
    equip: "med ball",
    tip: "Extra stabilizers."
  }, {
    id: "pp_facepull",
    name: "Face Pulls",
    sets: "3×15",
    equip: "band",
    tip: "Non-negotiable for shoulder health."
  }, {
    id: "pp_bandchest",
    name: "Band Chest Fly",
    sets: "3×12",
    equip: "band",
    tip: "Bring hands together."
  }, {
    id: "pp_latpull",
    name: "Band Lat Pulldown",
    sets: "3×12",
    equip: "band",
    tip: "Pull to upper chest."
  }, {
    id: "pp_pike",
    name: "Pike Push-Up",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Hips high."
  }, {
    id: "pp_apart",
    name: "Band Pull-Aparts",
    sets: "3×20",
    equip: "band",
    tip: "Every. Single. Day."
  }],
  arms_core: [{
    id: "ac_curl",
    name: "DB Bicep Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Full range."
  }, {
    id: "ac_dip",
    name: "Tricep Dips",
    sets: "3×12",
    equip: "bodyweight",
    tip: "Lower to 90°."
  }, {
    id: "ac_hammer",
    name: "Hammer Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Neutral grip."
  }, {
    id: "ac_band_tri",
    name: "Band Tricep Pushdown",
    sets: "3×15",
    equip: "band",
    tip: "Elbows glued to sides."
  }, {
    id: "ac_roll",
    name: "Ab Roller Rollouts",
    sets: "3×8",
    equip: "ab roller",
    tip: "Hips must not sag."
  }, {
    id: "ac_twist",
    name: "Med Ball Russian Twists",
    sets: "3×20",
    equip: "med ball",
    tip: "Feet off floor."
  }, {
    id: "ac_conc",
    name: "Concentration Curls",
    sets: "3×10",
    equip: "dumbbells",
    tip: "Squeeze at peak."
  }, {
    id: "ac_oh_ext",
    name: "Band Overhead Extension",
    sets: "3×12",
    equip: "band",
    tip: "Stand on band, elbows close."
  }, {
    id: "ac_deadbug",
    name: "Dead Bug",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Back flat throughout."
  }, {
    id: "ac_hollow",
    name: "Hollow Body Hold",
    sets: "3×20s",
    equip: "bodyweight",
    tip: "Press lower back to floor."
  }]
};
window.EQUIP_COLORS = {
  dumbbells: "#60a5fa",
  band: "#4ade80",
  bodyweight: "#9ca3af",
  "med ball": "#fb923c",
  "ab roller": "#f472b6"
};
