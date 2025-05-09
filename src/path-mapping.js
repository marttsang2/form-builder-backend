// This file helps resolve TypeScript path aliases in production
const tsConfigPaths = require('tsconfig-paths');
const { compilerOptions } = require('../tsconfig.json');

// Register path aliases for compiled JavaScript
tsConfigPaths.register({
  baseUrl: 'dist',
  paths: compilerOptions.paths,
});
