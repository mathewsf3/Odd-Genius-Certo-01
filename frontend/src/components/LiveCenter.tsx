/**
 * 🎮 ULTIMATE LIVE CENTER
 * 
 * ✅ Componente mestre para explorar 100% dos dados "in-play"
 * ✅ Lista de jogos em andamento
 * ✅ Painel de estatísticas em tempo real
 * ✅ Odds atualizadas minuto a minuto
 * ✅ Interface em português-BR
 */

import { useState } from 'react';
import { useAllLiveMatches } from '../hooks/useMatchData';

interface LiveCenterProps {
  onAnalyzeMatch?: (matchId: number) => void;
}

/**
 * 🎯 LIVE CENTER COMPONENT
 * Centro de controle para partidas ao vivo
 */
export default function LiveCenter({ onAnalyzeMatch }: LiveCenterProps) {
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  // ✅ HOOKS FOR LIVE DATA - Using existing backend
  const { matches, loading: matchesLoading, error: matchesError, lastUpdated } = useAllLiveMatches();

  if (matchesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando partidas ao vivo...</p>
        </div>
      </div>
    );
  }

  if (matchesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar partidas</h3>
        <p className="text-red-600">{matchesError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 📊 HEADER */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔴 Centro Ao Vivo</h1>
            <p className="text-gray-600 mt-1">
              {matches.length} partidas em andamento • Atualização automática
            </p>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Última atualização</p>
              <p className="text-sm font-medium text-gray-700">
                {lastUpdated.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">⚽</div>
          <h3 className="text-gray-700 font-semibold mb-2">Nenhuma partida ao vivo</h3>
          <p className="text-gray-500">Não há jogos em andamento no momento.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 🟢 LISTA DE JOGOS EM ANDAMENTO */}
          <aside className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Partidas Ao Vivo ({matches.length})
            </h2>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full text-left p-4 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                    selectedMatch?.id === match.id
                      ? 'bg-green-50 border-green-200 ring-2 ring-green-100'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      AO VIVO
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {match.homeGoalCount || 0} - {match.awayGoalCount || 0}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {match.homeName || match.home_name || 'Casa'}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {match.awayName || match.away_name || 'Visitante'}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mt-2 truncate">
                    {match.leagueName || match.league_name || 'Liga'}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          {/* 📊 PAINEL AO VIVO */}
          <section className="lg:col-span-2">
            {selectedMatch ? (
              <LiveMatchPanel match={selectedMatch} onAnalyzeMatch={onAnalyzeMatch} />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">👆</div>
                <h3 className="text-gray-700 font-semibold mb-2">Selecione uma partida</h3>
                <p className="text-gray-500">
                  Clique em uma partida ao lado para ver estatísticas detalhadas em tempo real.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * 📊 LIVE MATCH PANEL
 * Painel detalhado de uma partida ao vivo
 */
interface LiveMatchPanelProps {
  match: any;
  onAnalyzeMatch?: (matchId: number) => void;
}

function LiveMatchPanel({ match, onAnalyzeMatch }: LiveMatchPanelProps) {

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      {/* 🏆 HEADER DA PARTIDA */}
      <div className="text-center border-b pb-4">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
            AO VIVO
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {match.homeName || match.home_name || 'Casa'} vs {match.awayName || match.away_name || 'Visitante'}
        </h2>

        <div className="text-3xl font-bold text-gray-900 mb-2">
          {match.homeGoalCount || 0} - {match.awayGoalCount || 0}
        </div>

        <p className="text-sm text-gray-600">{match.leagueName || match.league_name || 'Liga'}</p>

        {onAnalyzeMatch && (
          <button
            onClick={() => onAnalyzeMatch(match.id)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Analisar Partida
          </button>
        )}
      </div>

      {/* 📈 ESTATÍSTICAS EM TEMPO REAL */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat
          label="Escanteios"
          homeValue={(match as any).team_a_corners}
          awayValue={(match as any).team_b_corners}
        />
        <Stat
          label="Chutes no Alvo"
          homeValue={(match as any).team_a_shotsOnTarget}
          awayValue={(match as any).team_b_shotsOnTarget}
        />
        <Stat
          label="Total de Chutes"
          homeValue={(match as any).team_a_shots}
          awayValue={(match as any).team_b_shots}
        />
        <Stat
          label="Cartões"
          homeValue={(match as any).team_a_cards_num}
          awayValue={(match as any).team_b_cards_num}
        />
        <Stat
          label="Posse de Bola"
          homeValue={(match as any).team_a_possession}
          awayValue={(match as any).team_b_possession}
          suffix="%"
        />
        <Stat
          label="Faltas"
          homeValue={(match as any).team_a_fouls}
          awayValue={(match as any).team_b_fouls}
        />
      </div>

      {/* 🎲 ODDS EM TEMPO REAL */}
      {((match as any).odds_ft_1 || (match as any).odds_ft_x || (match as any).odds_ft_2) && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Odds Tempo Integral</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Casa</p>
              <p className="font-bold text-gray-900">{(match as any).odds_ft_1?.toFixed(2) || '-'}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Empate</p>
              <p className="font-bold text-gray-900">{(match as any).odds_ft_x?.toFixed(2) || '-'}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Visitante</p>
              <p className="font-bold text-gray-900">{(match as any).odds_ft_2?.toFixed(2) || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 📊 STAT COMPONENT
 * Componente para exibir estatísticas comparativas
 */
interface StatProps {
  label: string;
  homeValue?: number | null;
  awayValue?: number | null;
  suffix?: string;
}

function Stat({ label, homeValue, awayValue, suffix = '' }: StatProps) {
  const home = homeValue ?? 0;
  const away = awayValue ?? 0;
  
  return (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <p className="text-xs uppercase text-gray-500 mb-2">{label}</p>
      <p className="font-mono text-sm font-semibold text-gray-900">
        {home}{suffix} • {away}{suffix}
      </p>
    </div>
  );
}
