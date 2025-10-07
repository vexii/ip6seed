  import { BIP39_WORDLIST } from './wordlist';
  import type { IPv6Address, Sentence, ByteArray } from './types';

  /**
   * Simple SHA256 hash function for BIP39 checksum calculation
   * @param bytes - The byte array to hash
   * @returns The SHA256 hash as a hexadecimal string
   */
  function sha256Hash(bytes: Uint8Array): string {
    // Use Node.js crypto for SHA256
    const { createHash } = require('crypto');
    return createHash('sha256').update(bytes).digest('hex');
  }

  /**
   * Validates that entropy is exactly 128 bits (16 bytes)
   * @param entropy - The BigInt entropy value
   * @throws {Error} If entropy is not 128 bits
   */
  function validateEntropy(entropy: bigint): void {
    const bitLength = entropy.toString(2).length;
    if (bitLength > 128) {
      throw new Error(`Entropy too large: ${bitLength} bits, expected <= 128 bits`);
    }
  }

  /**
   * Calculates BIP39 checksum for entropy
   * @param entropyBytes - The entropy as byte array
   * @returns The 4-bit checksum
   */
  function calculateChecksum(entropyBytes: Uint8Array): number {
    const hashHex = sha256Hash(entropyBytes);
    const firstByte = parseInt(hashHex.substring(0, 2), 16);
    return firstByte & 0xf;
  }

  /**
   * Converts byte array back to BigInt in big-endian order
   * @param bytes - The byte array
   * @returns The BigInt value
   */
   function bytesToBigInt(bytes: Uint8Array): bigint {
     let result = BigInt(0);
     for (let i = 0; i < bytes.length; i++) {
       result = (result << 8n) | BigInt(bytes[i] as number);
     }
     return result;
   }

 declare global {
   interface Number {
     toHex(): string;
   }
 }

 Number.prototype.toHex = function () {
   return ('00000000' + (Number(this) >>> 0).toString(16)).slice(-8);
 };

 /**
  * Converts IPv6 address string to BigInt
  * @param ip - The IPv6 address string (e.g., "fe80::1")
  * @returns The IPv6 address as a BigInt value
  * @throws {IPv6ConversionError} If the IPv6 address is invalid
  */
  function ip6ToBigInt(ip: IPv6Address): bigint {
    if (!ip || typeof ip !== 'string') throw new Error('Invalid IPv6: must be a non-empty string');
    ip = ip.toLowerCase().trim();
    if (!ip) throw new Error('Invalid IPv6: empty string');
    const sections = ip.split('::');
    if (sections.length > 2) throw new Error('Invalid IPv6: multiple "::" not allowed');
    const left = sections[0] ? sections[0].split(':').filter(g => g) : [];
    const right = sections[1] ? sections[1].split(':').filter(g => g) : [];
    const zeros = 8 - left.length - right.length;
    if (zeros < 0) throw new Error('Invalid IPv6: too many groups');
    const groups = [...left, ...Array.from({ length: zeros }, () => '0'), ...right];
    if (groups.length !== 8) throw new Error('Invalid IPv6: incorrect number of groups');
    let num = 0n;
    for (const g of groups) {
      if (!/^[0-9a-f]{1,4}$/.test(g)) throw new Error(`Invalid IPv6: invalid group "${g}"`);
      num = (num << 16n) | BigInt(parseInt(g, 16));
    }
    return num;
  }

 /**
  * Converts BigInt back to IPv6 address string
  * @param big - The BigInt value representing the IPv6 address
  * @returns The IPv6 address as a string
  */
  function bigIntToIp6(big: bigint): string {
    const groups = Array.from({ length: 8 }, () => {
      const group = Number(big & 0xffffn).toString(16);
      big >>= 16n;
      return group;
    }).reverse();
    return groups.join(':');
  }

  /**
   * Converts BigInt to 16-byte Uint8Array in big-endian order
   * @param big - The BigInt value to convert
   * @returns A Uint8Array of 16 bytes representing the BigInt
   */
  function bigIntToBytes(big: bigint): ByteArray {
     const arr = Array.from({ length: 16 }, () => {
       const byte = Number(big & 0xffn);
       big >>= 8n;
       return byte;
     });
     return new Uint8Array(arr.reverse());
   }

 /**
  * Generates 12 BIP39 words from entropy with checksum validation
  * @param entropy - The BigInt entropy value
  * @returns An array of 12 BIP39 words
  */
  function generateWords(entropy: bigint): string[] {
    const entropyBytes = bigIntToBytes(entropy);
    const hashHex = sha256Hash(entropyBytes);
    const firstByte = parseInt(hashHex.substring(0, 2), 16);
    const checksum = firstByte & 0xf;
    let entropyWithChecksum = (entropy << 4n) | BigInt(checksum);
     const words: string[] = [];
     for (let i = 0; i < 12; i++) {
       const index = Number(entropyWithChecksum & 0x7ffn);
       const word = BIP39_WORDLIST[index];
       if (!word) {
         throw new Error(`Invalid BIP39 index: ${index}`);
       }
       words.push(word);
       entropyWithChecksum >>= 11n;
     }
      return words.reverse();
   }

  // Helper function to capitalize the first letter
 const capitalize = (str: string): string => (str && str.length > 0) ? str.charAt(0).toUpperCase() + str.slice(1) : str;

  /**
   * Formats BIP39 words into a readable sentence
   * @param words - Array of 12 BIP39 words
   * @returns A formatted sentence string
   */
  function formatSentence(words: string[]): Sentence {
    // Join the 12 BIP39 words with spaces for a simple sentence
    return words.join(' ');
  }

 /**
  * Converts IPv6 address to a memorable sentence
  * @param ip - The IPv6 address string
  * @returns A human-readable sentence representing the IPv6 address
  * @throws {IPv6ConversionError} If the IPv6 address is invalid
  */
  function ip6ToSentence(ip: IPv6Address): Sentence {
    if (!ip || typeof ip !== 'string') throw new Error('Invalid IPv6: must be a non-empty string');
    const entropy = ip6ToBigInt(ip);
    const words = generateWords(entropy);
    return formatSentence(words);
  }

  /**
   * Extracts BIP39 words from a formatted sentence
   * @param sentence - The formatted sentence string
   * @returns An array of extracted BIP39 words
   */
  function extractWords(sentence: Sentence): string[] {
     return sentence.trim().split(/\s+/).map(word => word.toLowerCase()).slice(0, 12);
  }

 /**
  * Validates BIP39 words and extracts entropy with checksum verification
  * @param words - Array of 12 BIP39 words
  * @returns The extracted entropy as BigInt
  * @throws {InvalidBIP39Error} If words are invalid or checksum fails
  */
  function getEntropyFromWords(words: string[]): bigint {
    if (words.length !== 12) throw new Error('Invalid sentence');
    const bitString = words.reduce((acc, w) => {
      const index = BIP39_WORDLIST.indexOf(w);
      if (index === -1) throw new Error('Invalid word');
      return (acc << 11n) | BigInt(index);
    }, 0n);
     const checksum = Number(bitString & 0xfn);
     const entropy = bitString >> 4n;
     const entropyBytes = bigIntToBytes(entropy);
    const hashHex = sha256Hash(entropyBytes);
    const computedChecksum = parseInt(hashHex.substring(0, 2), 16) & 0xf;
     if (checksum !== computedChecksum) throw new Error('Checksum invalid');
     return entropy;
  }

 /**
  * Converts a sentence back to the original IPv6 address
  * @param sentence - The formatted sentence string
  * @returns The original IPv6 address string
  * @throws {InvalidBIP39Error} If the sentence is invalid
  */
  function sentenceToIp6(sentence: Sentence): IPv6Address {
    if (!sentence || typeof sentence !== 'string') throw new Error('Invalid sentence: must be a non-empty string');
    const words = extractWords(sentence);
    const entropy = getEntropyFromWords(words);
    return bigIntToIp6(entropy);
  }

 // Export functions for testing
 export {
   ip6ToBigInt,
   bigIntToIp6,
   bigIntToBytes,
   generateWords,
   formatSentence,
   ip6ToSentence,
   extractWords,
   getEntropyFromWords,
   sentenceToIp6
 };