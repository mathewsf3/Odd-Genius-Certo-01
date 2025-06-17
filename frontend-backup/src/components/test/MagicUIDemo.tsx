/**
 * 🎯 MAGIC UI DEMO COMPONENT
 * 
 * A simple demo to test MagicUI components without dependencies
 */

"use client";

import { motion } from 'framer-motion';
import { Activity, Sparkles, Star, Zap } from 'lucide-react';
import {
    AnimatedGradientText,
    BorderBeam,
    Floating,
    Glow,
    MagicCard,
    Pulse,
    ShineBorder
} from '../ui/magic-components';

// ✨ SAMPLE MATCH DATA FOR DEMO
const sampleMatch = {
  id: 1,
  timeCasa: {
    id: 1,
    nome: "Real Madrid",
    nomeAbreviado: "RMA",
    logo: "https://logoeps.com/wp-content/uploads/2013/03/real-madrid-vector-logo.png",
    golsEsperados: 2.1
  },
  timeVisitante: {
    id: 2,
    nome: "Barcelona",
    nomeAbreviado: "BAR",
    logo: "https://logoeps.com/wp-content/uploads/2014/09/barcelona-vector-logo.png",
    golsEsperados: 1.8
  },
  placarCasa: 2,
  placarVisitante: 1,
  status: 'ao-vivo' as const,
  tempo: "67'",
  dataHora: new Date().toISOString(),
  horario: "15:30",
  estadio: {
    nome: "Santiago Bernabéu",
    cidade: "Madrid"
  },
  liga: {
    id: 1,
    nome: "La Liga",
    logo: "",
    pais: "Espanha",
    rodada: "Rodada 15"
  },
  golsEsperadosTotal: 3.9,
  publico: 75000,
  odds: {
    casa: 2.10,
    empate: 3.40,
    visitante: 3.20
  },
  estatisticas: {
    posseBola: [58, 42] as [number, number],
    finalizacoes: [12, 8] as [number, number],
    escanteios: [6, 4] as [number, number],
    cartoes: [2, 3] as [number, number]
  }
};

export default function MagicUIDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ✨ HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Glow color="#10B981" size={10}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </Glow>
          
          <AnimatedGradientText 
            colors={['#10B981', '#22C55E', '#059669']}
            className="text-4xl font-bold"
          >
            MagicUI Demo
          </AnimatedGradientText>
          
          <p className="text-gray-600 dark:text-gray-400">
            Testing beautiful animated components
          </p>
        </motion.div>

        {/* ✨ COMPONENT SHOWCASE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Magic Card Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <MagicCard className="p-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4">
                <BorderBeam size={60} duration={4} />
                
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Magic Card</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400">
                  Interactive hover effects with gradient backgrounds
                </p>
                
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
              </div>
            </MagicCard>
          </motion.div>

          {/* Glow Effects Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
              <ShineBorder shineColor="#10B981" duration={8} />
              
              <div className="flex items-center space-x-3">
                <Glow color="#10B981" size={6}>
                  <Zap className="w-6 h-6 text-green-500" />
                </Glow>
                <h3 className="text-lg font-semibold">Glow Effects</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                Beautiful glowing elements with shine borders
              </p>
              
              <div className="flex space-x-2">
                <Glow color="#EF4444" size={4}>
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                </Glow>
                <Glow color="#10B981" size={4}>
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                </Glow>
                <Glow color="#3B82F6" size={4}>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </Glow>
              </div>
            </div>
          </motion.div>

          {/* Animations Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold">Animations</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400">
              Smooth floating and pulsing animations
            </p>
            
            <div className="flex items-center justify-around">
              <Floating distance={8} duration={2}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
              </Floating>
              
              <Pulse duration={1.5}>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
              </Pulse>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"
              >
                <span className="text-white font-bold">R</span>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* ✨ SAMPLE MATCH CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <AnimatedGradientText 
            colors={['#10B981', '#22C55E', '#059669']}
            className="text-2xl font-bold text-center"
          >
            Sample Enhanced Match Card
          </AnimatedGradientText>
          
          <div className="max-w-md mx-auto">
            <MagicCard className="p-0">
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                <BorderBeam size={100} duration={6} colorFrom="#10B981" colorTo="#22C55E" />
                
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Glow color="#10B981" size={4}>
                        <Star className="w-5 h-5 text-green-600" />
                      </Glow>
                      <AnimatedGradientText colors={['#10B981', '#22C55E', '#059669']}>
                        {sampleMatch.liga.nome}
                      </AnimatedGradientText>
                    </div>
                    
                    <Pulse duration={1.5}>
                      <Glow color="#EF4444" size={6}>
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <span>🔴</span>
                          <span>AO VIVO</span>
                        </div>
                      </Glow>
                    </Pulse>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Floating duration={4}>
                        <Glow color="#10B981" size={3}>
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            RMA
                          </div>
                        </Glow>
                      </Floating>
                      <div>
                        <p className="font-semibold">{sampleMatch.timeCasa.nome}</p>
                        <p className="text-xs text-gray-500">xG: {sampleMatch.timeCasa.golsEsperados}</p>
                      </div>
                    </div>

                    <Glow color="#10B981" size={6}>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
                        {sampleMatch.placarCasa} - {sampleMatch.placarVisitante}
                      </div>
                    </Glow>

                    <div className="flex items-center space-x-3 flex-row-reverse">
                      <Floating duration={4.5}>
                        <Glow color="#10B981" size={3}>
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                            BAR
                          </div>
                        </Glow>
                      </Floating>
                      <div className="text-right">
                        <p className="font-semibold">{sampleMatch.timeVisitante.nome}</p>
                        <p className="text-xs text-gray-500">xG: {sampleMatch.timeVisitante.golsEsperados}</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Time */}
                  <Pulse>
                    <div className="text-center">
                      <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">
                        {sampleMatch.tempo}
                      </span>
                    </div>
                  </Pulse>
                </div>
              </div>
            </MagicCard>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
