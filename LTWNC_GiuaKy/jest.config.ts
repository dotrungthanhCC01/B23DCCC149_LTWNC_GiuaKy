import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    // Dùng tsconfig riêng cho test (CommonJS) vì tsconfig.app.json dành cho Vite (ESM, noEmit)
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/styleMock.ts',
  },
};

export default config;
