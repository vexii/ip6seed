# AGENTS.md

## Build/Lint/Test Commands
- **Run project**: `bun start` - Execute with formatted output
- **Install deps**: `bun install` - Install dependencies
- **Type check**: `bun run typecheck` - TypeScript checking
- **Run tests**: `bun test` - Full test suite (18 tests)
- **Run single test**: `bun test tests/ipv6-converter.test.ts` - Specific test file

## Code Style Guidelines
- **TypeScript**: Strict mode, ESNext target, features like `verbatimModuleSyntax`, `allowImportingTsExtensions`
- **Project Structure**: Modular (src/, tests/), type-safe, custom errors (`IPv6ConversionError`, `InvalidBIP39Error`)
- **Naming**: camelCase for vars/functions, UPPER_CASE for constants, PascalCase for types, kebab-case for files
- **Code Structure**: Functional, immutable (`const`), modern JS (arrows, templates, destructuring), `bigint` for large ints
- **Error Handling**: Custom classes, input validation, type guards
- **Formatting**: No semicolons, 2-space indentation, template literals, reasonable line length
- **Imports**: ES modules, `import type` for types, minimal deps (Bun/TypeScript only)
- **Best Practices**: Single responsibility, descriptive names, consistent `bigint`, avoid deprecated methods, JSDoc, full test coverage
- **File Organization**: src/ (index.ts, ipv6.ts, wordlist.ts, types.ts), tests/ (ipv6-converter.test.ts)
- **Performance**: Optimized BigInt ops, minimal memory, Bun runtime speed