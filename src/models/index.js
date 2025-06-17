"use strict";
/**
 * Models Index - Export all DTO types
 * Centralized export for all data type definitions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Match DTOs
__exportStar(require("./Match.dto"), exports);
// Team DTOs
__exportStar(require("./Team.dto"), exports);
// Player DTOs
__exportStar(require("./Player.dto"), exports);
// League DTOs
__exportStar(require("./League.dto"), exports);
// Referee DTOs
__exportStar(require("./Referee.dto"), exports);
// Analytics DTOs
__exportStar(require("./Analytics.dto"), exports);
