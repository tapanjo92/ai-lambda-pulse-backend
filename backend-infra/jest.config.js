module.exports = {
  // Use ts-jest to handle TypeScript
  preset: 'ts-jest',

  // Run in Node.js environment
  testEnvironment: 'node',

  // Look for any .test.ts or .spec.ts files anywhere in the project
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

  // Recognize these file extensions
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
