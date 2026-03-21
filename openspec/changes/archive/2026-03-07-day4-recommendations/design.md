## Context

Meals, inventory, and auth are all in place. The recommendation engine is the connective tissue. Key constraint: keep the algorithm simple and deterministic for MVP — no ML, no caching infrastructure, just score on demand.

## Goals / Non-Goals

**Goals:**
- Surface 2-3 high-scoring meals on Home screen
- "Choose This Meal" completes the core loop (recommend → choose → log → deduct)
- Inventory deduction tracks depletion over multiple uses without deleting items
- Recommendations persist across tab switches; refresh on pull-to-refresh

**Non-Goals:**
- Recommendation caching to disk / AsyncStorage (React state is sufficient)
- Healthy Eating Plate scoring (Day 6)
- Time-of-day filtering (user decides)
- Receipt OCR, advanced ML scoring

## Decisions

**Scoring algorithm (from spec)**
`score = (matchPercent × 100) + (daysSinceLastMade × 2)`. Filter at 50. Meals with no ingredients get score = daysSince × 2 only (can surface rarely-made meals). Never-made meals get daysSince = 999.

**Numeric level scale (0–6) for inventory depletion**
Quantity stored as text number "0"–"6". Display labels: 6-5 = Stocked, 4-3 = Some, 2-1 = Low, 0 = Out of stock. Each meal use decrements by 1 → exactly 2 uses at each display level. Items at level 0 are excluded from inventory matching.

Non-numeric/null quantities are treated as level 4 ("Some") on first deduction and decremented from there. This avoids a migration and handles any free-text quantities already entered.

**Deduction is best-effort**
`logMeal` never throws on deduction failure. Meal log always succeeds; inventory update is a side effect. This avoids confusing errors if an ingredient has no inventory match.

**React Navigation tab caching**
Bottom tab screens remain mounted when switching tabs — React state naturally persists. No explicit cache layer needed. On initial mount: fetch recommendations. On pull-to-refresh: re-fetch.

**Supabase nested select for meals + ingredients**
`supabase.from('meals').select('*, meal_ingredients(*)')` fetches both in one round-trip. More efficient than N+1 queries.

## Risks / Trade-offs

- **Score threshold = 50 may return 0 results** → Empty state shown with nudge to update inventory or add meals
- **Fuzzy match (substring) causes false positives** → Acceptable for MVP; e.g., "oil" would match "olive oil" which is correct behavior
- **Numeric quantity scale overwrites free text** → On first deduction, free text becomes numeric. Acceptable since text quantities have no deduction logic. User can re-set via level chips in edit modal.
