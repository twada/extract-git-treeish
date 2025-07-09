# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`extract-git-treeish` is a Node.js library that extracts git tree-ish objects (commits, branches, or tags) into target directories. It provides two main functions:
- `exists()` - Check if a git tree-ish exists
- `extract()` - Extract contents of a git tree-ish into a directory

The library is written in TypeScript and distributed as a pure ESM package requiring Node.js v22.12.0+.

## Development Commands

```bash
# Install dependencies
npm install

# Run tests (linting + unit tests on TypeScript source)
npm test

# Run only unit tests on TypeScript source
npm run test:unit

# Build the project (TypeScript → JavaScript)
npm run compile

# Full rebuild (clean + lint + compile + test distribution)
npm run rebuild

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Test compiled distribution files
npm run test:dist

# Clean build artifacts
npm run clean
```

## Testing Strategy

The project uses Node.js built-in test runner with two approaches:
1. **Development testing**: Run TypeScript tests directly with `--experimental-strip-types`
2. **Distribution testing**: Test the compiled JavaScript output

To run a single test file:
```bash
# TypeScript source
node --experimental-strip-types --enable-source-maps --import @power-assert/node --test "./src/__tests__/exists_test.mts"

# Compiled JavaScript
node --enable-source-maps --import @power-assert/node --test "./dist/__tests__/exists_test.mjs"
```

## Architecture

The codebase follows a simple, focused architecture:
- Single module (`src/index.mts`) exports two async functions
- Uses child_process to spawn git commands (`git rev-parse` and `git archive`)
- Uses the `tar` package to extract git archives
- Automatically finds git project root by traversing up directories
- Comprehensive input validation and error handling
- All functions return Promises and use async/await internally

## TypeScript Configuration

- Target: ESNext with NodeNext module system
- Strict mode with additional safety flags (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Uses `rewriteRelativeImportExtensions` for proper ESM imports
- Generates source maps and declaration files
- Output directory: `dist/`
