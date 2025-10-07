# IPv6 to BIP39 Sentence Converter

A TypeScript/Bun tool that converts IPv6 addresses to memorable BIP39 mnemonic sentences and back, ensuring perfect reversibility with SHA256 checksum validation.

## Features

- **Bidirectional Conversion**: Seamlessly converts IPv6 addresses to 12-word BIP39 sentences and vice versa.
- **BIP39 Compliance**: Uses the standard 2048-word BIP39 wordlist for security and memorability.
- **Checksum Validation**: Implements SHA256-based checksums to detect corruption or errors.
- **Type Safety**: Full TypeScript support with strict type checking.
- **Performance Optimized**: Fast execution using Bun runtime and efficient BigInt operations.
- **Comprehensive Testing**: Over 40 tests covering edge cases, error handling, and round-trip validation.
- **Zero Dependencies**: Self-contained implementation with no external libraries beyond TypeScript and Bun.

## Installation

Install dependencies using Bun:

```bash
bun install
```

## Usage

### Command Line

Run the example with formatted output:

```bash
bun start
```

### Programmatic API

Import and use the core functions in your TypeScript code:

```typescript
import { ip6ToSentence, sentenceToIp6 } from './src/ipv6';

// Convert IPv6 to sentence
const sentence = ip6ToSentence('fe80::2fb4:5866:4c4d:b951');
console.log(sentence); // e.g., "abandon ability able about above absent absorb abstract absurd abuse access accident"

// Convert sentence back to IPv6
const ipv6 = sentenceToIp6(sentence);
console.log(ipv6); // fe80:0:0:0:2fb4:5866:4c4d:b951
```

### API Reference

#### `ip6ToSentence(ip: string): string`

Converts an IPv6 address string to a BIP39 mnemonic sentence.

- **Parameters**:
  - `ip` (string): The IPv6 address (e.g., "fe80::1" or "2001:db8::1").
- **Returns**: A string of 12 BIP39 words separated by spaces.
- **Throws**: Error if the IPv6 address is invalid.

#### `sentenceToIp6(sentence: string): string`

Converts a BIP39 mnemonic sentence back to the original IPv6 address.

- **Parameters**:
  - `sentence` (string): The 12-word BIP39 sentence.
- **Returns**: The original IPv6 address string.
- **Throws**: Error if the sentence is invalid, has wrong word count, invalid words, or checksum mismatch.

#### `ip6ToBigInt(ip: string): bigint`

Converts an IPv6 address to a BigInt value.

#### `bigIntToIp6(big: bigint): string`

Converts a BigInt back to an IPv6 address string.

#### `generateWords(entropy: bigint): string[]`

Generates 12 BIP39 words from entropy with checksum.

#### `getEntropyFromWords(words: string[]): bigint`

Extracts entropy from BIP39 words with checksum validation.

## Examples

### Basic Round-Trip

```typescript
const ipv6 = '2001:db8::1';
const sentence = ip6ToSentence(ipv6);
const recovered = sentenceToIp6(sentence);
console.log(recovered === ipv6); // true
```

### Compressed IPv6

```typescript
const ipv6 = 'fe80::1%lo0'; // Note: Interface identifiers are not supported
// Use 'fe80::1' instead
const sentence = ip6ToSentence('fe80::1');
console.log(sentence); // e.g., "abandon ability able about above absent absorb abstract absurd abuse access accident"
```

### Error Handling

```typescript
try {
  const sentence = ip6ToSentence('invalid:ip');
} catch (error) {
  console.log(error.message); // "Invalid IPv6: invalid group "invalid""
}

try {
  const ipv6 = sentenceToIp6('invalid sentence');
} catch (error) {
  console.log(error.message); // "Invalid sentence" or "Invalid word" or "Checksum invalid"
}
```

## Implementation Details

The tool works by:

1. Parsing the IPv6 address into a 128-bit BigInt value.
2. Converting the BigInt to a 16-byte array in big-endian order.
3. Computing a SHA256 hash of the bytes and extracting the first 4 bits as a checksum.
4. Appending the checksum to the entropy bits to form a 132-bit value.
5. Dividing the 132 bits into 12 groups of 11 bits each, mapping each to a BIP39 word index.
6. Generating the sentence as space-separated words.
7. For reversal: Extracting words, reconstructing the bit string, validating the checksum, and extracting the original entropy.

All operations use BigInt for precision and include comprehensive error checking.

## Project Structure

```
src/
├── index.ts          # Entry point with example usage and formatted output
├── ipv6.ts           # Core conversion logic and exports
├── wordlist.ts       # BIP39 wordlist constant
└── types.ts          # TypeScript type definitions
tests/
└── ipv6-converter.test.ts  # Comprehensive test suite (40+ tests)
```

## Testing

Run the full test suite to verify functionality:

```bash
bun test
```

Run a specific test file:

```bash
bun test tests/ipv6-converter.test.ts
```

The tests cover:
- Basic conversions and round-trips
- Edge cases (all zeros, all ones, compressed notation)
- Error handling (invalid inputs, checksum mismatches)
- Performance benchmarks
- Wordlist boundary conditions

## Performance

- **Conversion Speed**: Typically <1ms per round-trip on modern hardware.
- **Memory Usage**: Minimal, using only BigInt and string operations.
- **Scalability**: Handles any valid IPv6 address without performance degradation.

## Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-enhancement`).
3. Make your changes and add tests for new functionality.
4. Run the test suite (`bun test`) to ensure no regressions.
5. Commit your changes (`git commit -m 'Add amazing enhancement'`).
6. Push to the branch (`git push origin feature/amazing-enhancement`).
7. Open a Pull Request.

Please ensure all tests pass and follow the existing code style (2-space indentation, no semicolons, functional programming patterns).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Bun and TypeScript. Say goodbye to unmemorable IPv6 addresses!
