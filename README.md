# ip6prase

A TypeScript utility that converts IPv6 addresses into memorable, structured sentences using the BIP39 wordlist, and can reverse the process to recover the original IPv6 address.

## Features

- **IPv6 to Sentence**: Convert any IPv6 address into a unique, human-readable sentence
- **Sentence to IPv6**: Reverse the process to recover the original IPv6 address
- **BIP39 Wordlist**: Uses the standard 2048-word BIP39 vocabulary for compatibility
- **SHA256 Checksum**: Includes checksum validation for data integrity
- **Simple Format**: Generates clean sentences with 12 BIP39 words in groups of 4

## Example

```typescript
// Convert IPv6 to sentence
const sentence = ip6ToSentence('fe80::2fb4:5866:4c4d:b951');
// Output: "young abandon abandon abandon. abandon abandon sauce mention. green give hour permit."

// Convert sentence back to IPv6
const ipv6 = sentenceToIp6('young abandon abandon abandon. abandon abandon sauce mention. green give hour permit.');
// Output: "fe80:0:0:0:2fb4:5866:4c4d:b951"
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
5. **Sentence Formatting**: Groups words into simple sentences for readability

The process is reversible and includes validation to ensure data integrity.

## Dependencies

- TypeScript
- Bun runtime

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
