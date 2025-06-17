# GitHub Copilot Instructions for Football API Backend

## 🎯 Core Principles - ALWAYS FOLLOW

### Always do this in this repo

1. **API Client Usage**: For every football-data call, use the generated client in `src/apis/footy`.
2. **No Raw HTTP**: Never hand-write URLs or Axios inside controllers.
3. **Type Safety**: Import DTOs (e.g. `MatchStatsDTO`) from `src/models`, not ad-hoc types.
4. **MCP Ecosystem**: Always leverage our comprehensive MCP server ecosystem for all development tasks.

## 🚀 MCP Server Ecosystem - 4 Specialized Servers Available

# 🧠 PROJECT MEMORY

## 🔌 MCP SERVERS TO ALWAYS USE

1. **SequentialThinking**

   URL  : https://mcp.so/server/sequentialthinking/modelcontextprotocol  
   ROLE : Step-by-step planner and code-context analyser.  
   RULE : Run this first on every non-trivial ticket to generate the thought list and the recommended MCP tool chain.

2. **Context7 (Upstash)**

   URL  : https://mcp.so/server/context7/upstash  
   ROLE : Live documentation + high-speed Redis cache for code snippets, library docs, and dependency optimisation.  
   RULE : Whenever SequentialThinking (or the dev) needs authoritative docs/examples, call `resolve-library-id` ➜ `get-library-docs`, then pipe the returned markdown directly into the next generation step.

> **Workflow:** **SequentialThinking ➜ Context7 (if docs needed) ➜ specialised MCP tools ➜ tests ➜ tick task in plan.**

---

## 📗 BACKEND TASK TRACKING

All features, refactors, and bug-fixes are listed in **`BACKEND_STRUCTURE_PLAN.md`**.  
Move a checkbox to ✓ only after:

1. Code is generated via MCP tools.
2. Tests (MCP-generated) pass locally & in CI.
3. Lint and type-check are clean.

---

## 🎯 CORE PRINCIPLES – ALWAYS FOLLOW

- **API Client Usage**: For every football-data call, use the generated client in `src/apis/footy`.
- **No Raw HTTP**: Never hand-write URLs or Axios inside controllers.
- **Type Safety**: Import DTOs (e.g. `MatchStatsDTO`) from `src/models`, not ad-hoc types.
- **MCP Ecosystem**: Always leverage our comprehensive MCP server ecosystem for all development tasks.
- **Backend Reliability**: Backend must support comprehensive football analytics (match/league/H2H/corner/goal/betting/player/referee analysis), always use the FootyStats API client from `src/apis/footy` (never raw HTTP), follow TypeScript best practices with proper error handling, use package managers for dependencies, and test each component before proceeding to ensure system reliability.
