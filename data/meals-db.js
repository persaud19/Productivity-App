// Mission Log — Meals Database
// Static meal seed data (20 built-in meals)
// Loaded before app.js — exposes window.MEALS_DB globally
window.MEALS_DB = [
// ══════════════════════════════════════════════════════════════
// BREAKFASTS
// ══════════════════════════════════════════════════════════════
{
  id: "b01",
  name: "Overnight Oats with Berries",
  cat: "B",
  cal: 380,
  prot: 18,
  carbs: 58,
  fat: 9,
  prep: 5,
  cook: 0,
  cad: 2.20,
  tags: ["meal-prep", "high-fiber", "budget", "no-cook", "couples-easy"],
  ing: ["1 cup rolled oats", "2 tbsp chia seeds", "1 cup low-fat milk", "½ cup mixed berries (fresh or frozen)", "1 tbsp honey", "¼ cup plain Greek yogurt (0%)"],
  steps: ["Add oats and chia seeds to a jar or container with a lid.", "Pour in milk and stir well — make sure all oats are wet.", "Stir in honey. Top with Greek yogurt.", "Cover and refrigerate overnight (minimum 6 hours).", "In the morning, top with berries and eat cold. No heating needed.", "Tip: Make 2 jars at once — one for each of you. Keeps 3 days in the fridge."]
}, {
  id: "b02",
  name: "Veggie Scrambled Eggs",
  cat: "B",
  cal: 310,
  prot: 22,
  carbs: 12,
  fat: 18,
  prep: 5,
  cook: 8,
  cad: 2.50,
  tags: ["high-protein", "low-carb", "quick"],
  ing: ["4 large eggs", "½ cup diced bell pepper (any colour)", "½ cup baby spinach", "¼ cup diced white onion", "1 tsp olive oil", "Salt & black pepper to taste"],
  steps: ["Crack eggs into a bowl, add a pinch of salt and pepper, and whisk until combined.", "Heat olive oil in a non-stick pan over medium heat.", "Add onion and bell pepper. Cook 3–4 minutes until softened, stirring occasionally.", "Add spinach and stir for 30 seconds until just wilted.", "Pour eggs over the veggies. Let sit 10 seconds, then gently fold with a spatula every 15–20 seconds.", "Remove from heat when eggs are just set but still slightly glossy — they continue cooking off heat.", "Serve immediately. Optional: add hot sauce or a slice of whole grain toast."]
}, {
  id: "b03",
  name: "Greek Yogurt Parfait",
  cat: "B",
  cal: 340,
  prot: 24,
  carbs: 44,
  fat: 8,
  prep: 5,
  cook: 0,
  cad: 3.00,
  tags: ["quick", "high-protein", "no-cook", "couples-easy"],
  ing: ["1½ cups plain Greek yogurt (0%)", "¾ cup low-sugar granola", "½ cup fresh blueberries (or mixed berries)", "1 tbsp honey", "2 tbsp sliced almonds"],
  steps: ["Spoon half the yogurt into a glass or bowl.", "Add half the granola in an even layer.", "Add half the berries.", "Repeat layers: yogurt, granola, berries.", "Drizzle honey over top and scatter almonds.", "Eat immediately — or pack the yogurt and toppings separately if taking to go.", "Tip: Buy a large tub of 0% Greek yogurt from Costco for best value."]
}, {
  id: "b04",
  name: "Cottage Cheese Protein Pancakes",
  cat: "B",
  cal: 350,
  prot: 28,
  carbs: 32,
  fat: 10,
  prep: 5,
  cook: 12,
  cad: 2.80,
  tags: ["high-protein", "meal-prep", "filling"],
  ing: ["1 cup cottage cheese (2%)", "2 large eggs", "½ cup rolled oats", "1 tsp vanilla extract", "½ tsp cinnamon", "1 tsp coconut oil (for pan)", "½ cup mixed berries (topping)", "1 tbsp maple syrup (topping)"],
  steps: ["Blend cottage cheese, eggs, oats, vanilla, and cinnamon in a blender for 30 seconds until smooth.", "Let batter rest 2 minutes — it will thicken slightly.", "Heat coconut oil in a non-stick pan over medium-low heat.", "Pour small rounds of batter (~¼ cup each). Don't spread — they'll spread themselves.", "Cook 2–3 minutes until bubbles form on surface and edges look set. Flip gently.", "Cook 1–2 more minutes on second side until golden.", "Serve topped with berries and a small drizzle of maple syrup.", "Note: These are denser than regular pancakes — that's normal and intentional for the protein hit."]
}, {
  id: "b05",
  name: "Turkey & Veggie Omelette",
  cat: "B",
  cal: 290,
  prot: 26,
  carbs: 8,
  fat: 16,
  prep: 5,
  cook: 8,
  cad: 3.20,
  tags: ["high-protein", "low-carb", "quick"],
  ing: ["3 large eggs", "50g sliced turkey breast (deli style)", "¼ cup sliced mushrooms", "¼ cup diced tomato", "1 tbsp olive oil", "Salt, pepper, dried herbs (thyme or oregano)"],
  steps: ["Whisk eggs with a pinch of salt, pepper, and herbs in a bowl.", "Heat olive oil in an 8-inch non-stick pan over medium heat.", "Add mushrooms and cook 2 minutes until lightly browned.", "Pour eggs over mushrooms. Tilt pan to spread evenly.", "Let cook undisturbed 1 minute until edges start setting.", "Add turkey and tomato to one half of the omelette.", "When eggs are set (no longer jiggly), fold empty half over the filled half.", "Slide onto plate and serve immediately."]
},
// ══════════════════════════════════════════════════════════════
// LUNCHES
// ══════════════════════════════════════════════════════════════
{
  id: "l01",
  name: "Chicken & Quinoa Power Bowl",
  cat: "L",
  cal: 490,
  prot: 40,
  carbs: 46,
  fat: 12,
  prep: 10,
  cook: 20,
  cad: 5.50,
  tags: ["high-protein", "meal-prep", "balanced", "mediterranean"],
  ing: ["2 chicken breasts (approx 300g total)", "1 cup dry quinoa", "2 cups arugula or mixed greens", "½ cup canned chickpeas (drained and rinsed)", "½ cup cucumber (diced)", "2 tbsp tahini", "1 tbsp lemon juice", "1 tbsp water", "Salt, pepper, garlic powder, olive oil"],
  steps: ["Cook quinoa: rinse well, add to pot with 2 cups water and a pinch of salt. Bring to boil, reduce heat, cover and simmer 15 minutes. Remove from heat and let sit 5 minutes covered. Fluff with fork.", "While quinoa cooks, season chicken with olive oil, garlic powder, salt and pepper.", "Heat a pan over medium-high. Cook chicken 6–7 minutes per side until internal temp reaches 74°C (165°F). Let rest 3 minutes before slicing.", "Make tahini dressing: whisk tahini, lemon juice, and water until smooth. Season with salt.", "Build bowls: add greens, then quinoa, sliced chicken, chickpeas, and cucumber.", "Drizzle tahini dressing over everything and serve.", "Meal prep tip: Make a double batch of quinoa and chicken on Sunday for 3 days of lunches."]
}, {
  id: "l02",
  name: "Turkey Lettuce Wraps",
  cat: "L",
  cal: 320,
  prot: 28,
  carbs: 14,
  fat: 12,
  prep: 10,
  cook: 10,
  cad: 4.00,
  tags: ["low-carb", "quick", "high-protein"],
  ing: ["300g lean ground turkey", "8–10 large butter lettuce leaves", "½ cup water chestnuts (canned, diced small)", "2 tbsp hoisin sauce", "1 tbsp low-sodium soy sauce", "1 tsp sesame oil", "3 cloves garlic (minced)", "1 tsp fresh ginger (grated)", "Green onions for garnish"],
  steps: ["Mix hoisin, soy sauce, and sesame oil together in a small bowl. Set aside.", "Heat a non-stick pan over medium-high heat. Add turkey and break apart immediately.", "Cook turkey 5–6 minutes, stirring, until no longer pink.", "Push turkey to the sides. Add garlic and ginger to the center and cook 30 seconds until fragrant.", "Stir in sauce mixture and water chestnuts. Cook 2 more minutes until everything is coated and sauce thickens slightly.", "Separate lettuce leaves and lay flat on a plate.", "Spoon turkey filling into each lettuce cup.", "Garnish with sliced green onions and serve immediately."]
}, {
  id: "l03",
  name: "Red Lentil Soup",
  cat: "L",
  cal: 380,
  prot: 22,
  carbs: 58,
  fat: 8,
  prep: 10,
  cook: 25,
  cad: 2.20,
  tags: ["budget", "high-fiber", "meal-prep", "plant-based"],
  ing: ["1 cup dry red lentils", "1 can (400ml) diced tomatoes", "1 medium onion (diced)", "3 cloves garlic (minced)", "1 tsp ground cumin", "1 tsp turmeric", "½ tsp smoked paprika", "2 cups low-sodium vegetable broth", "2 cups baby spinach", "1 tbsp olive oil", "Salt, pepper, lemon juice"],
  steps: ["Rinse lentils in cold water until water runs clear. Set aside.", "Heat olive oil in a large pot over medium heat. Add onion and cook 4–5 minutes until softened.", "Add garlic, cumin, turmeric, and paprika. Stir and cook 1 minute until fragrant.", "Add diced tomatoes (with liquid), lentils, and vegetable broth. Stir to combine.", "Bring to a boil, then reduce heat to medium-low. Simmer 20 minutes uncovered, stirring occasionally, until lentils are completely soft.", "Use a hand blender to partially blend (leave some texture) — or blend half and stir back in.", "Stir in spinach until wilted (about 1 minute).", "Season with salt, pepper, and a squeeze of lemon juice. Serve with crusty bread.", "Stores well: refrigerate up to 5 days or freeze in portions."]
}, {
  id: "l04",
  name: "Mediterranean Chicken Wrap",
  cat: "L",
  cal: 450,
  prot: 36,
  carbs: 38,
  fat: 14,
  prep: 10,
  cook: 15,
  cad: 4.80,
  tags: ["high-protein", "portable", "mediterranean"],
  ing: ["2 chicken breasts (approx 280g total)", "2 large whole wheat wraps", "4 tbsp hummus", "½ cup cucumber (sliced)", "½ cup cherry tomatoes (halved)", "¼ red onion (thinly sliced)", "1 cup mixed greens", "4 tbsp tzatziki", "3 tbsp feta crumbles", "1 tsp Greek seasoning", "1 tbsp olive oil"],
  steps: ["Rub chicken with olive oil and Greek seasoning.", "Cook in a pan over medium-high heat, 6–7 minutes per side, until cooked through (74°C internal). Rest 3 minutes, then slice thin.", "Warm wraps in a dry pan or microwave for 20 seconds to make them pliable.", "Spread 2 tbsp hummus across each wrap, leaving a 1-inch border.", "Layer greens, chicken slices, cucumber, tomatoes, and red onion down the centre.", "Add a spoon of tzatziki and scatter feta over top.", "Fold in the sides, then roll tightly from the bottom up.", "Cut in half diagonally. Wrap in foil if taking to go — stays fresh 4 hours."]
}, {
  id: "l05",
  name: "Black Bean Burrito Bowl",
  cat: "L",
  cal: 460,
  prot: 22,
  carbs: 68,
  fat: 12,
  prep: 10,
  cook: 15,
  cad: 3.00,
  tags: ["plant-based", "budget", "high-fiber"],
  ing: ["1 cup dry brown rice (or 2 cups cooked)", "1 can (400ml) black beans (drained and rinsed)", "½ cup frozen corn (thawed)", "½ cup fresh salsa", "½ avocado (sliced)", "¼ cup plain Greek yogurt (sour cream substitute)", "Juice of 1 lime", "Fresh cilantro", "½ tsp cumin, salt, garlic powder"],
  steps: ["Cook rice according to package directions (about 15 minutes for instant brown rice).", "While rice cooks, warm black beans in a small pot with cumin, garlic powder, and a pinch of salt. Cook on medium-low 5 minutes.", "Warm corn in a pan or microwave for 2 minutes.", "Build the bowl: rice on the bottom, then beans and corn.", "Top with salsa, avocado slices, and a spoon of Greek yogurt.", "Squeeze lime juice over everything and top with fresh cilantro.", "Optional heat: add hot sauce or jalapeño slices."]
}, {
  id: "l06",
  name: "Asian Chicken Salad",
  cat: "L",
  cal: 400,
  prot: 34,
  carbs: 28,
  fat: 14,
  prep: 15,
  cook: 15,
  cad: 4.50,
  tags: ["high-protein", "meal-prep", "fresh"],
  ing: ["2 chicken breasts", "3 cups green cabbage (shredded)", "1 cup purple cabbage (shredded)", "1 cup shredded carrots", "¼ cup frozen edamame (thawed)", "3 tbsp rice vinegar", "2 tbsp soy sauce", "1 tbsp sesame oil", "1 tbsp honey", "1 tsp fresh ginger (grated)", "¼ cup sliced almonds", "2 mandarin orange segments (from can, drained)"],
  steps: ["Season chicken with salt and pepper. Cook in a pan over medium-high, 6–7 minutes per side until done. Let rest, then shred or slice thin.", "Make dressing: whisk rice vinegar, soy sauce, sesame oil, honey, and ginger together.", "In a large bowl, combine both cabbages, carrots, and edamame.", "Pour dressing over vegetables and toss well to coat.", "Top with chicken, mandarin segments, and sliced almonds.", "Serve immediately or refrigerate up to 2 days (keep dressing separate if making ahead)."]
}, {
  id: "l07",
  name: "Cottage Cheese Power Bowl",
  cat: "L",
  cal: 310,
  prot: 28,
  carbs: 28,
  fat: 8,
  prep: 8,
  cook: 0,
  cad: 3.00,
  tags: ["high-protein", "no-cook", "budget", "quick"],
  ing: ["1 cup cottage cheese (2%)", "½ cup cherry tomatoes (halved)", "½ cucumber (diced)", "¼ cup radishes (sliced)", "1 tbsp olive oil", "1 tsp everything bagel seasoning", "Salt, black pepper", "Whole grain crackers on the side (optional)"],
  steps: ["Spoon cottage cheese into a bowl and spread slightly.", "Arrange cherry tomatoes, cucumber, and radishes on top.", "Drizzle olive oil evenly over everything.", "Sprinkle everything bagel seasoning, a pinch of salt, and black pepper.", "Serve immediately with crackers on the side for dipping.", "Note: This is a no-cook, 8-minute lunch that's surprisingly filling. Great for busy weekdays."]
},
// ══════════════════════════════════════════════════════════════
// DINNERS
// ══════════════════════════════════════════════════════════════
{
  id: "d01",
  name: "Lemon Herb Baked Salmon",
  cat: "D",
  cal: 520,
  prot: 46,
  carbs: 18,
  fat: 24,
  prep: 10,
  cook: 20,
  cad: 8.00,
  tags: ["omega-3", "high-protein", "sheet-pan", "couples-easy"],
  ing: ["2 salmon fillets (approx 200g each)", "1 lemon (half sliced, half for juice)", "2 tbsp fresh dill (or 1 tsp dried)", "2 tbsp fresh parsley", "2 cloves garlic (minced)", "1 tbsp olive oil", "1 bunch asparagus (trimmed)", "Salt & black pepper"],
  steps: ["Preheat oven to 400°F (200°C). Line a baking sheet with foil.", "Place asparagus on one half of the sheet. Drizzle with olive oil, season with salt and pepper.", "Place salmon fillets on the other half of the sheet, skin side down.", "Mix garlic, dill, parsley, and a drizzle of olive oil. Spread evenly over the salmon tops.", "Place lemon slices over the salmon. Squeeze the other lemon half over asparagus.", "Bake 15–18 minutes until salmon flakes easily with a fork and asparagus is tender-crisp.", "Salmon is done when it turns from translucent to opaque in the centre.", "Serve directly from the sheet — minimal cleanup."]
}, {
  id: "d02",
  name: "Chicken & Broccoli Stir Fry",
  cat: "D",
  cal: 480,
  prot: 44,
  carbs: 36,
  fat: 14,
  prep: 10,
  cook: 15,
  cad: 5.00,
  tags: ["high-protein", "quick", "budget"],
  ing: ["2 chicken breasts (sliced thin, against the grain)", "3 cups broccoli florets", "1 cup brown rice (cooked)", "2 tbsp low-sodium soy sauce", "1 tbsp oyster sauce", "1 tsp sesame oil", "3 cloves garlic (minced)", "1 tsp fresh ginger (grated)", "1 tsp cornstarch", "1 tbsp vegetable oil", "Sesame seeds to garnish"],
  steps: ["Mix soy sauce, oyster sauce, sesame oil, and cornstarch in a bowl. Set aside as the stir fry sauce.", "Toss sliced chicken with a pinch of salt and pepper.", "Heat vegetable oil in a wok or large pan over high heat until smoking hot.", "Add chicken in a single layer. Don't stir for 90 seconds — let it sear and develop colour.", "Stir and cook another 2 minutes until chicken is cooked through. Remove to a plate.", "In the same pan, add broccoli. Stir fry 3–4 minutes until bright green and tender-crisp.", "Add garlic and ginger. Cook 30 seconds.", "Return chicken to pan. Pour sauce over everything and toss to coat. Cook 1 more minute until sauce thickens.", "Serve over brown rice and garnish with sesame seeds."]
}, {
  id: "d03",
  name: "Turkey Meatballs & Zucchini Noodles",
  cat: "D",
  cal: 460,
  prot: 40,
  carbs: 24,
  fat: 18,
  prep: 15,
  cook: 25,
  cad: 5.50,
  tags: ["low-carb", "high-protein", "italian"],
  ing: ["400g lean ground turkey", "1 large egg", "¼ cup breadcrumbs (or almond flour for lower carb)", "¼ cup grated parmesan", "2 tsp Italian seasoning", "1 tsp garlic powder", "½ tsp onion powder", "3 medium zucchini", "1 cup good quality marinara sauce", "1 tbsp olive oil", "Salt & pepper"],
  steps: ["Preheat oven to 400°F (200°C).", "Combine turkey, egg, breadcrumbs, parmesan, Italian seasoning, garlic powder, onion powder, salt and pepper. Mix gently — overworking makes tough meatballs.", "Roll into 16 equal balls (about the size of a golf ball).", "Place on a lined baking sheet and bake 18–20 minutes until cooked through and lightly browned.", "While meatballs bake, spiralize zucchini into noodles (or use a vegetable peeler for ribbons).", "Heat olive oil in a pan over medium heat. Add zucchini noodles and toss for 2–3 minutes. Season lightly — don't overcook or they go mushy.", "Warm marinara in a small pot.", "Plate zucchini noodles, top with meatballs and marinara, and extra parmesan."]
}, {
  id: "d04",
  name: "Sheet Pan Chicken & Vegetables",
  cat: "D",
  cal: 510,
  prot: 46,
  carbs: 28,
  fat: 16,
  prep: 10,
  cook: 30,
  cad: 5.50,
  tags: ["meal-prep", "sheet-pan", "high-protein", "couples-easy"],
  ing: ["2 chicken breasts", "1 cup broccoli florets", "1 red bell pepper (sliced)", "1 medium onion (sliced)", "2 small sweet potatoes (cubed, 1 inch pieces)", "2 tbsp olive oil", "1 tsp smoked paprika", "1 tsp garlic powder", "1 tsp Italian seasoning", "Salt & pepper"],
  steps: ["Preheat oven to 425°F (220°C). Line a large baking sheet with foil.", "Place sweet potato cubes on the sheet. Toss with 1 tbsp olive oil, paprika, salt and pepper. Roast 10 minutes first (they take longer).", "While sweet potatoes start cooking, rub chicken with remaining olive oil, garlic powder, Italian seasoning, salt and pepper.", "After 10 minutes, move sweet potatoes to one side. Add chicken to centre and broccoli, pepper, and onion to the other side.", "Roast everything together for 20 more minutes.", "Chicken is done when internal temp reaches 74°C (165°F) and juices run clear.", "Vegetables should be tender with slight caramelised edges.", "Serve directly from the pan. Great for batch cooking — doubles easily."]
}, {
  id: "d05",
  name: "Ground Turkey Taco Skillet",
  cat: "D",
  cal: 490,
  prot: 38,
  carbs: 40,
  fat: 16,
  prep: 10,
  cook: 20,
  cad: 4.50,
  tags: ["high-protein", "one-pan", "budget", "crowd-pleaser"],
  ing: ["400g lean ground turkey", "1 can (400ml) black beans (drained)", "1 can (340ml) corn (drained)", "1 can (400ml) diced tomatoes", "2 tbsp taco seasoning", "¼ cup shredded low-fat cheddar", "½ cup plain Greek yogurt", "Juice of 1 lime", "Fresh cilantro", "Hot sauce", "1 tsp olive oil"],
  steps: ["Heat olive oil in a large pan over medium-high. Add turkey, breaking it apart as it cooks.", "Cook 6–8 minutes until browned and no longer pink.", "Add taco seasoning and stir to coat. Cook 1 minute.", "Add diced tomatoes (with liquid), black beans, and corn. Stir to combine.", "Reduce heat to medium. Simmer 8–10 minutes until liquid reduces slightly and everything is heated through.", "Taste and adjust seasoning with salt, lime juice, and hot sauce.", "Serve directly from the skillet topped with shredded cheese, Greek yogurt, and cilantro.", "Optional: serve with brown rice or warm tortillas on the side."]
}, {
  id: "d06",
  name: "Greek Chicken Bowl",
  cat: "D",
  cal: 530,
  prot: 44,
  carbs: 40,
  fat: 16,
  prep: 10,
  cook: 20,
  cad: 5.50,
  tags: ["mediterranean", "high-protein", "meal-prep"],
  ing: ["2 chicken breasts", "1 cup dry quinoa", "½ cup cucumber (diced)", "1 cup cherry tomatoes (halved)", "¼ red onion (thinly sliced)", "¼ cup kalamata olives", "½ cup tzatziki", "3 tbsp feta crumbles", "1 tbsp olive oil", "1½ tsp Greek seasoning (or oregano + garlic + paprika)", "Juice of ½ lemon"],
  steps: ["Cook quinoa: rinse well, add to pot with 2 cups water. Bring to boil, reduce heat, cover and simmer 15 minutes. Fluff with fork.", "Rub chicken with olive oil, Greek seasoning, salt, pepper, and lemon juice.", "Cook chicken in a pan over medium-high, 6–7 minutes per side until cooked through. Rest 3 minutes, then slice.", "While chicken rests, prepare toppings: dice cucumber, halve tomatoes, slice red onion thin.", "Build bowls: quinoa base, then sliced chicken, cucumber, tomatoes, olives, and red onion.", "Spoon tzatziki over top and crumble feta.", "Finish with a squeeze of lemon and drizzle of olive oil."]
}, {
  id: "d07",
  name: "Black Bean & Beef Chili",
  cat: "D",
  cal: 530,
  prot: 40,
  carbs: 48,
  fat: 14,
  prep: 10,
  cook: 35,
  cad: 5.00,
  tags: ["high-protein", "high-fiber", "batch-cooking", "budget"],
  ing: ["300g lean ground beef (90/10)", "2 cans (400ml each) black beans (drained)", "1 can (400ml) diced tomatoes", "1 medium onion (diced)", "3 cloves garlic (minced)", "1 red bell pepper (diced)", "2 tbsp chili powder", "1 tsp cumin", "1 tsp smoked paprika", "½ tsp cayenne (optional for heat)", "1 cup low-sodium beef broth", "Plain Greek yogurt and green onions for topping", "1 tsp olive oil"],
  steps: ["Heat olive oil in a large pot over medium-high. Add beef, breaking apart. Cook 5–6 minutes until browned.", "Add onion and bell pepper. Cook 4 minutes until softened.", "Add garlic, chili powder, cumin, paprika, and cayenne. Stir and cook 1 minute until fragrant.", "Add diced tomatoes, black beans, and broth. Stir to combine.", "Bring to a boil, then reduce heat to low. Simmer uncovered 25–30 minutes, stirring occasionally, until thickened.", "Taste and season with salt and pepper.", "Serve topped with a spoon of Greek yogurt (instead of sour cream — more protein, same creaminess) and sliced green onions.", "Best the next day. Freezes perfectly in portions for up to 3 months."]
}, {
  id: "d08",
  name: "One-Pot Chicken & Rice",
  cat: "D",
  cal: 530,
  prot: 44,
  carbs: 52,
  fat: 12,
  prep: 10,
  cook: 30,
  cad: 4.50,
  tags: ["budget", "one-pot", "high-protein", "comfort", "couples-easy"],
  ing: ["2 chicken breasts", "1 cup dry brown rice", "2 cups low-sodium chicken broth", "1 cup frozen peas", "1 medium onion (diced)", "3 cloves garlic (minced)", "1 tsp smoked paprika", "1 tsp cumin", "Juice of ½ lemon", "Fresh parsley", "1 tbsp olive oil", "Salt & pepper"],
  steps: ["Season chicken on both sides with paprika, cumin, salt, and pepper.", "Heat olive oil in a large pot or Dutch oven over medium-high heat. Sear chicken 3 minutes per side until golden. Remove and set aside — it won't be cooked through yet.", "In the same pot, add onion. Cook 3 minutes until softened.", "Add garlic and cook 30 seconds.", "Add dry rice and stir to coat in the oil for 1 minute.", "Pour in chicken broth. Stir and scrape any bits from the bottom.", "Nestle chicken breasts on top of the rice. Bring to a boil.", "Reduce heat to low, cover tightly, and cook 25 minutes without lifting the lid.", "After 25 minutes, check rice is tender and chicken is cooked through. Add peas, cover 3 more minutes.", "Squeeze lemon over top, scatter fresh parsley, and serve from the pot."]
}

// ══════════════════════════════════════════════════════════════
// ── ADD MORE MEALS HERE ──────────────────────────────────────
//
// Template:
// {
//   id:"d09", name:"Your Meal Name", cat:"D",
//   cal:000, prot:00, carbs:00, fat:00, prep:0, cook:0, cad:0.00,
//   tags:["tag1","tag2"],
//   ing:[
//     "ingredient 1",
//     "ingredient 2"
//   ],
//   steps:[
//     "Step 1 instruction.",
//     "Step 2 instruction.",
//     "Step 3 instruction."
//   ]
// },
// ══════════════════════════════════════════════════════════════
];
