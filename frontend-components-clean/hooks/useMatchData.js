"use strict";
/**
 * 🎯 REAL DATA HOOKS - 100% API INTEGRATION
 *
 * ✅ ZERO fallback data
 * ✅ Real-time updates
 * ✅ Error handling without mock data
 * ✅ TypeScript safety
 * ✅ Portuguese-BR error messages
 */
"use client";
/**
 * 🎯 REAL DATA HOOKS - 100% API INTEGRATION
 *
 * ✅ ZERO fallback data
 * ✅ Real-time updates
 * ✅ Error handling without mock data
 * ✅ TypeScript safety
 * ✅ Portuguese-BR error messages
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMatchDetails = exports.useTodaysMatches = exports.useUpcomingMatches = exports.useLiveMatches = void 0;
const react_1 = require("react");
// ✅ ENVIRONMENT CONFIGURATION
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// ✅ HOOK FOR LIVE MATCHES - REAL DATA ONLY
const useLiveMatches = () => {
    const [matches, setMatches] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [lastUpdated, setLastUpdated] = (0, react_1.useState)(null);
    const fetchLiveMatches = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield fetch(`${API_BASE_URL}/api/v1/matches/live`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar partidas ao vivo`);
            }
            const result = yield response.json();
            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido ao buscar partidas');
            }
            // ✅ SET REAL DATA - NO FALLBACKS
            setMatches(result.data);
            setLastUpdated(new Date());
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('Erro ao buscar partidas ao vivo:', err);
            // ❌ DO NOT SET FALLBACK DATA HERE
            // setMatches([]); // This is OK - empty array is not fallback data
        }
        finally {
            setLoading(false);
        }
    }), []);
    (0, react_1.useEffect)(() => {
        fetchLiveMatches();
        // ✅ AUTO-REFRESH FOR LIVE DATA
        const interval = setInterval(fetchLiveMatches, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, [fetchLiveMatches]);
    return {
        matches,
        loading,
        error,
        refetch: fetchLiveMatches,
        lastUpdated
    };
};
exports.useLiveMatches = useLiveMatches;
// ✅ HOOK FOR UPCOMING MATCHES - REAL DATA ONLY
const useUpcomingMatches = (limit = 6) => {
    const [matches, setMatches] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [lastUpdated, setLastUpdated] = (0, react_1.useState)(null);
    const fetchUpcomingMatches = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield fetch(`${API_BASE_URL}/api/v1/matches/upcoming?limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar próximas partidas`);
            }
            const result = yield response.json();
            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido ao buscar próximas partidas');
            }
            // ✅ SET REAL DATA - NO FALLBACKS
            setMatches(result.data);
            setLastUpdated(new Date());
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('Erro ao buscar próximas partidas:', err);
            // ❌ DO NOT SET FALLBACK DATA HERE
        }
        finally {
            setLoading(false);
        }
    }), [limit]);
    (0, react_1.useEffect)(() => {
        fetchUpcomingMatches();
        // ✅ REFRESH EVERY 5 MINUTES FOR UPCOMING MATCHES
        const interval = setInterval(fetchUpcomingMatches, 300000); // 5 minutes
        return () => clearInterval(interval);
    }, [fetchUpcomingMatches]);
    return {
        matches,
        loading,
        error,
        refetch: fetchUpcomingMatches,
        lastUpdated
    };
};
exports.useUpcomingMatches = useUpcomingMatches;
// ✅ HOOK FOR TODAY'S MATCHES - REAL DATA ONLY
const useTodaysMatches = () => {
    const [matches, setMatches] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [lastUpdated, setLastUpdated] = (0, react_1.useState)(null);
    const fetchTodaysMatches = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield fetch(`${API_BASE_URL}/api/v1/matches/today`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar partidas de hoje`);
            }
            const result = yield response.json();
            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido ao buscar partidas de hoje');
            }
            // ✅ SET REAL DATA - NO FALLBACKS
            setMatches(result.data);
            setLastUpdated(new Date());
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('Erro ao buscar partidas de hoje:', err);
            // ❌ DO NOT SET FALLBACK DATA HERE
        }
        finally {
            setLoading(false);
        }
    }), []);
    (0, react_1.useEffect)(() => {
        fetchTodaysMatches();
        // ✅ REFRESH EVERY 2 MINUTES FOR TODAY'S MATCHES
        const interval = setInterval(fetchTodaysMatches, 120000); // 2 minutes
        return () => clearInterval(interval);
    }, [fetchTodaysMatches]);
    return {
        matches,
        loading,
        error,
        refetch: fetchTodaysMatches,
        lastUpdated
    };
};
exports.useTodaysMatches = useTodaysMatches;
// ✅ HOOK FOR SINGLE MATCH DETAILS - REAL DATA ONLY
const useMatchDetails = (matchId) => {
    const [match, setMatch] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchMatchDetails = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!matchId)
            return;
        try {
            setError(null);
            setLoading(true);
            const response = yield fetch(`${API_BASE_URL}/api/v1/matches/${matchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar detalhes da partida`);
            }
            const result = yield response.json();
            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido ao buscar detalhes da partida');
            }
            // ✅ SET REAL DATA - NO FALLBACKS
            setMatch(result.data);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('Erro ao buscar detalhes da partida:', err);
            // ❌ DO NOT SET FALLBACK DATA HERE
        }
        finally {
            setLoading(false);
        }
    }), [matchId]);
    (0, react_1.useEffect)(() => {
        fetchMatchDetails();
    }, [fetchMatchDetails]);
    return {
        match,
        loading,
        error,
        refetch: fetchMatchDetails
    };
};
exports.useMatchDetails = useMatchDetails;
