/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { esModuleInterop: true, allowJs: true } }]
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};