# Pantry Seed Data

## Overview
235 household items seeded from Ryan and Sabrina's actual inventory (November 2025).
This data is **embedded directly in app.js** as `const PANTRY_SEED = [...]`.

On first login for a new user, if `users/<uid>/ml/food/pantry` is empty:
1. Check old path `ml/food/pantry` for migrateable data
2. If nothing → seed from PANTRY_SEED

## Categories Used
| App Category | Source Categories |
|---|---|
| Grains | Baking Supplies, Dried Goods |
| Sauces | Condiments and Sauces, Oils |
| Spices | Spices |
| Frozen | Boxed Foods |
| Protein | Fresh Foods (meat/fish) |
| Produce | Fresh Foods (veg/bread) |
| Canned | Canned Goods, Jar Goods |
| Snacks | Dessert / Candy, Salty Snacks |
| Other | Cleaning Supplies, Kitchen Supplies, Household Supplies, Health & Beauty, Hosting Supplies, Drinks |

## Locations in the Home
- Cooking Area (spices, sauces, oils, baking)
- Freezer (main kitchen freezer)
- Garage Freezer
- Pantry
- Kitchen Sink
- Laundry Room
- Linen Closet
- Main Floor Closet
- Main Washroom
- Office Closet

## Item ID Format
Seed items use `seed000` through `seed234`.
User-added items use `p` + timestamp + random (e.g., `p1711234567890.123`).

## Updating the Seed
If Ryan updates his household inventory and wants a new baseline:
1. Export current pantry from the app (⬇ Export button)
2. Edit the exported JSON
3. Replace `PANTRY_SEED` array in app.js
4. Deploy

## Low Stock Logic
```javascript
function pantryStatus(item) {
  const qty = parseFloat(item.qty || 0);
  const minQty = parseFloat(item.minQty || 0);
  const expiry = item.expiry ? new Date(item.expiry + "-01") : null;
  const daysToExp = expiry ? Math.round((expiry - new Date()) / 86400000) : null;
  let status = "ok";
  if (qty === 0) status = "out";
  else if (minQty > 0 && qty <= minQty) status = "low";
  else if (daysToExp !== null && daysToExp < 0) status = "expired";
  else if (daysToExp !== null && daysToExp <= 7) status = "expiring";
  return { status, qty, minQty, daysToExp };
}
```
