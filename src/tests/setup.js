"use strict";
/**
 * Jest test setup file
 * Global test configuration and mocks
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
// Extend Jest matchers
expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false,
            };
        }
    },
});
// Global test timeout
jest.setTimeout(30000);
// Mock console.log in tests unless specifically needed
const originalConsoleLog = console.log;
beforeEach(() => {
    console.log = jest.fn();
});
afterEach(() => {
    console.log = originalConsoleLog;
});
// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Clean up after tests
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Close any open handles
    yield new Promise(resolve => setTimeout(resolve, 100));
}));
