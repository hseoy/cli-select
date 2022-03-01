module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).(ts|js)'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!ansi-escapes)',
    '<rootDir>/dist',
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        allowJs: true,
      },
    },
  },
};
