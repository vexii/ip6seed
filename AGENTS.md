# AGENTS.md

## Build/Lint/Test Commands

 - **Run the project**: `bun start` - Runs the example with improved formatted output
 - **Install dependencies**: `bun install` - Install project dependencies
 - **Type checking**: `bun run typecheck` - TypeScript type checking only
 - **Run tests**: `bun test` - Run the comprehensive test suite (18 tests)
 - **Run single test**: `bun test tests/ipv6-converter.test.ts` - Run specific test file
 - **Fix TypeScript errors**: Code now uses proper `bigint` types and modern TypeScript features

## Code Style Guidelines

### TypeScript Configuration
- **Strict Mode**: Enabled with all strict flags for maximum type safety
- **Target**: ESNext with bundler module resolution
- **Features**: `verbatimModuleSyntax`, `allowImportingTsExtensions`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`

 ### Project Structure
 - **Modular Design**: Separated into `src/index.ts`, `src/ipv6.ts`, `src/wordlist.ts`, `src/types.ts`, and `tests/test.test.ts`
 - **Type Safety**: Comprehensive TypeScript types for all functions and data structures
 - **Error Handling**: Custom error classes (`IPv6ConversionError`, `InvalidBIP39Error`)

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `ip6ToBigInt`, `generateWords`)
- **Constants**: UPPER_CASE (e.g., `BIP39_WORDLIST`)
- **Types/Interfaces**: PascalCase (e.g., `IPv6Address`, `Entropy`)
- **Files**: kebab-case (e.g., `wordlist.ts`, `types.ts`)

### Code Structure
- **Functional Programming**: Pure functions with clear inputs/outputs
- **Immutability**: Use `const` for constants and immutable values
- **Modern JavaScript**: Arrow functions, template literals, destructuring
- **BigInt Operations**: Consistent use of `bigint` type for large integers

### Error Handling
- **Custom Errors**: Descriptive error classes with proper inheritance
- **Input Validation**: Early validation with clear error messages
- **Type Guards**: Proper type checking for runtime safety

### Formatting
- **No Semicolons**: Modern JavaScript style
- **Template Literals**: For string interpolation
- **Indentation**: 2 spaces (consistent throughout)
- **Line Length**: Reasonable limits for readability

### Imports and Dependencies
- **ES Modules**: Modern `import`/`export` syntax
- **Type Imports**: Separate type imports with `import type`
- **Minimal Dependencies**: Only TypeScript and Bun runtime
- **No External Libraries**: Self-contained implementation

### Best Practices
- **Single Responsibility**: Each function has one clear purpose
- **Descriptive Names**: Variable and function names explain their purpose
- **Consistent Types**: Use `bigint` consistently for large integers
- **Modern Methods**: Avoid deprecated methods (`substr`, `unescape`)
- **Documentation**: JSDoc comments for public functions
- **Testing**: Comprehensive test coverage for all functionality

 ### File Organization
 ```
 src/
 ├── index.ts          # Entry point with example output
 ├── ipv6.ts           # Main conversion logic and exports
 ├── wordlist.ts       # BIP39 wordlist constant
 └── types.ts          # TypeScript type definitions
 tests/
 └── ipv6-converter.test.ts      # Test suite
 ```

### Performance Considerations
- **Efficient Algorithms**: Optimized BigInt operations
- **Minimal Memory Usage**: Streamlined data structures
- **Fast Runtime**: Bun's performance optimizations