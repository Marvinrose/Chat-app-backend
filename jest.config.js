module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // include your tests folder
  modulePathIgnorePatterns: ['<rootDir>/dist/'], // ignore compiled files
};
