module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/apis/**/*.ts', // Exclude generated API client from coverage
    '!src/test-*.ts', // Exclude test files
    '!src/demo-*.ts', // Exclude demo files
  ],
  testTimeout: 30000, // 30 seconds for API tests
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};
