# ip6prase

A TypeScript utility that converts IPv6 addresses into memorable, structured sentences using the BIP39 wordlist, and can reverse the process to recover the original IPv6 address.

## Features

- **IPv6 to Sentence**: Convert any IPv6 address into a unique, human-readable sentence
- **Sentence to IPv6**: Reverse the process to recover the original IPv6 address
- **BIP39 Wordlist**: Uses the standard 2048-word BIP39 vocabulary for compatibility
- **SHA256 Checksum**: Includes checksum validation for data integrity
- **Structured Format**: Generates sentences in groups of 4 phrases with 4 words each

## Example

```typescript
// Convert IPv6 to sentence
const sentence = ip6ToSentence('fe80::2fb4:5866:4c4d:b951');
// Output: "The abandon young abandons the abandon. A abandon abandon that sauces mention, while Green hours with give permit."

// Convert sentence back to IPv6
const ipv6 = sentenceToIp6('The abandon young abandons the abandon. A abandon abandon that sauces mention, while Green hours with give permit.');
// Output: "fe80::2fb4:5866:4c4d:b951"
```

## Installation

```bash
bun install
```

## Usage

```bash
bun run index.ts
```

## How it Works

1. **IPv6 → BigInt**: Converts IPv6 address to a 128-bit BigInt
2. **Entropy Generation**: Uses the BigInt as entropy source
3. **Checksum Calculation**: Computes SHA256 hash and extracts 4-bit checksum
4. **Word Selection**: Selects 12 words from BIP39 wordlist using entropy + checksum
5. **Sentence Formatting**: Structures words into readable 4-phrase sentences

The process is reversible and includes validation to ensure data integrity.

## Dependencies

- TypeScript
- Bun runtime

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
