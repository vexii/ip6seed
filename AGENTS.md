# AGENTS.md

## Build/Lint/Test Commands

- **Run the project**: `bun run index.ts`
- **Install dependencies**: `bun install`
- **Type checking**: `bunx tsc --noEmit` (for type checking only)
- **Run single test**: No test framework configured yet. Consider adding Vitest with `bun add -d vitest` and create test files.
- **Fix TypeScript errors**: Current code has BigInt type issues - use consistent `BigInt` vs `bigint` types and handle potential undefined values.

## Code Style Guidelines

### TypeScript Configuration
- Use strict TypeScript with all strict flags enabled
- Target ESNext with bundler module resolution
- Use `verbatimModuleSyntax` and `allowImportingTsExtensions`
- Enable `noFallthroughCasesInSwitch` and `noUncheckedIndexedAccess`

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `ip6ToBigInt`, `generateWords`)
- **Constants**: camelCase (e.g., `wordlist`, `Sha256`)
- **Types/Interfaces**: PascalCase (not extensively used in this codebase)

### Code Structure
- Use `const` for constants and immutable values
- Use arrow functions for utility functions and object methods
- Use `BigInt` for large integer operations
- Extend global interfaces for utility methods (e.g., `Number.prototype.toHex`)

### Error Handling
- Throw descriptive `Error` objects with clear messages
- Validate inputs early in functions

### Formatting
- No semicolons (modern JavaScript style)
- Use template literals for string interpolation
- Consistent indentation (2 spaces inferred from code)
- Group related functionality together

### Imports and Dependencies
- Use ES modules with `import`/`export`
- Check existing codebase before adding new dependencies
- Prefer built-in JavaScript features over external libraries

### Best Practices
- Use strict equality (`===`) and inequality (`!==`)
- Use `const` declarations by default, `let` only when reassignment is needed
- Use descriptive variable names that explain purpose
- Keep functions focused on single responsibilities
- Handle potential undefined values explicitly (current code has TypeScript strict null checks enabled)
- Use consistent BigInt literal syntax (`BigInt(123)` vs `123n`)
- Avoid deprecated methods like `unescape()` and `substr()` - use `decodeURIComponent()` and `substring()` instead