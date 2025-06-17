# 🚨 **FOOTY.YAML vs API.MD DISCREPANCY ANALYSIS**

## 📊 **COMPARISON RESULTS**

### ✅ **CORRECT ENDPOINTS IN FOOTY.YAML:**
1. `/league-list` → ✅ Matches `api.md`
2. `/country-list` → ✅ Matches `api.md` 
3. `/todays-matches` → ✅ Matches `api.md`
4. `/league-season` → ✅ Matches `api.md`
5. `/league-matches` → ✅ Matches `api.md`
6. `/league-teams` → ✅ Matches `api.md`
7. `/team` → ✅ Matches `api.md`
8. `/lastx` → ✅ Matches `api.md` (for team last X stats)
9. `/match` → ✅ Matches `api.md`
10. `/league-tables` → ✅ Matches `api.md`
11. `/player-stats` → ✅ Matches `api.md`
12. `/referee` → ✅ Matches `api.md`
13. `/stats-data-btts` → ✅ Matches `api.md`
14. `/stats-data-over25` → ✅ Matches `api.md`

### 🚨 **DUPLICATE/PROBLEMATIC ENDPOINTS IN FOOTY.YAML:**
15. `/leagues` → ❌ **DUPLICATE** of `/league-list`
16. `/countries` → ❌ **DUPLICATE** of `/country-list`
17. `/matches` → ❌ **DUPLICATE** of `/todays-matches`

### 🔍 **DETAILED ANALYSIS:**

#### ✅ **PROPER API.MD STRUCTURE:**
```markdown
League List: GET /league-list?key=xxx
Country List: GET /country-list?key=xxx  
Today's Matches: GET /todays-matches?key=xxx
League Stats: GET /league-season?key=xxx&season_id=xxx
League Matches: GET /league-matches?key=xxx&season_id=xxx
League Teams: GET /league-teams?key=xxx&season_id=xxx
Team Data: GET /team?key=xxx&team_id=xxx
Team Last X: GET /lastx?key=xxx&team_id=xxx
Match Details: GET /match?key=xxx&match_id=xxx
League Tables: GET /league-tables?key=xxx&season_id=xxx
Player Stats: GET /player-stats?key=xxx&player_id=xxx
Referee Stats: GET /referee?key=xxx&referee_id=xxx
BTTS Stats: GET /stats-data-btts?key=xxx
Over 2.5 Stats: GET /stats-data-over25?key=xxx
```

#### ❌ **PROBLEMATIC FOOTY.YAML STRUCTURE:**
```yaml
# CORRECT ENDPOINTS (matching api.md)
/league-list: ✅
/country-list: ✅
/todays-matches: ✅
# ... other correct endpoints

# DUPLICATE ENDPOINTS (NOT in api.md)
/leagues: ❌ SHOULD BE REMOVED
/countries: ❌ SHOULD BE REMOVED  
/matches: ❌ SHOULD BE REMOVED
```

### 🎯 **MCP SERVER IMPACT:**

Our MCP servers are parsing **ALL endpoints** including the duplicates:
- **Correct endpoints**: 14 working properly
- **Duplicate endpoints**: 3 causing confusion
- **Generated client**: Has incorrect method names due to duplicates

### 🔧 **REQUIRED FIXES:**

1. **Remove duplicate endpoints** from `footy.yaml`
2. **Regenerate API client** to have clean method names
3. **Update MCP servers** to only use correct endpoints
4. **Fix method naming** (e.g., `getBTTSStats` vs `getBttsStats`)

### 📋 **CURRENT STATUS:**
- **Foundation**: 85% Correct ✅
- **Duplicates**: Need removal ❌
- **MCP Servers**: Working but parsing extra endpoints ⚠️
- **API Client**: Generated correctly from schema ✅

## 🛠️ **IMMEDIATE ACTION REQUIRED:**
Remove duplicate endpoints and regenerate client for clean foundation