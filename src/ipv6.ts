 import { BIP39_WORDLIST } from './wordlist';
 import type { IPv6Address, Sentence, ByteArray } from './types';
 import { IPv6ConversionError, InvalidBIP39Error } from './types';

 /**
  * Simple SHA256 hash function for BIP39 checksum calculation
  * @param message - The string message to hash
  * @returns The SHA256 hash as a hexadecimal string
  */
 function sha256Hash(message: string): string {
   // Simple SHA256 implementation for BIP39 checksum
   // This is a basic implementation - in production, use a proper crypto library
   const crypto = require('crypto');
   return crypto.createHash('sha256').update(message, 'utf8').digest('hex');
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
   if (!ip || typeof ip !== 'string') throw new IPv6ConversionError('Invalid IPv6: must be a non-empty string');
   ip = ip.toLowerCase().trim();
   if (!ip) throw new IPv6ConversionError('Invalid IPv6: empty string');
   const sections = ip.split('::');
   if (sections.length > 2) throw new IPv6ConversionError('Invalid IPv6: multiple "::" not allowed');
   const left = sections[0] ? sections[0].split(':').filter(g => g) : [];
   const right = sections[1] ? sections[1].split(':').filter(g => g) : [];
   const zeros = 8 - left.length - right.length;
   if (zeros < 0) throw new IPv6ConversionError('Invalid IPv6: too many groups');
   let groups = left;
   for (let i = 0; i < zeros; i++) groups.push('0');
   groups = groups.concat(right);
   if (groups.length !== 8) throw new IPv6ConversionError('Invalid IPv6: incorrect number of groups');
   let num = 0n;
   for (const g of groups) {
     if (!/^[0-9a-f]{1,4}$/.test(g)) throw new IPv6ConversionError(`Invalid IPv6: invalid group "${g}"`);
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
   const groups: string[] = [];
   for (let i = 7; i >= 0; i--) {
     const group = Number(big & 0xffffn).toString(16);
     groups.unshift(group);
     big >>= 16n;
   }
   return groups.join(':');
 }

 /**
  * Converts BigInt to 16-byte Uint8Array
  * @param big - The BigInt value to convert
  * @returns A Uint8Array of 16 bytes representing the BigInt
  */
 function bigIntToBytes(big: bigint): ByteArray {
   const bytes = new Uint8Array(16);
   for (let i = 0; i < 16; i++) {
     bytes[i] = Number(big & 0xffn);
     big >>= 8n;
   }
   return bytes;
 }

 /**
  * Generates 12 BIP39 words from entropy with checksum validation
  * @param entropy - The BigInt entropy value
  * @returns An array of 12 BIP39 words
  */
 function generateWords(entropy: bigint): string[] {
   const entropyBytes = bigIntToBytes(entropy);
   const msg = String.fromCharCode(...entropyBytes);
   const hashHex = sha256Hash(msg);
   const firstByte = parseInt(hashHex.substring(0, 2), 16);
   const checksum = firstByte >> 4;
   let entropyWithChecksum = (entropy << 4n) | BigInt(checksum);
   const words: string[] = [];
   for (let i = 0; i < 12; i++) {
     const index = Number(entropyWithChecksum & 0x7ffn);
      words.unshift(BIP39_WORDLIST[index as number]!);
     entropyWithChecksum >>= 11n;
   }
   return words;
 }

 // Helper function to capitalize the first letter
 const capitalize = (str: string): string => (str && str.length > 0) ? str.charAt(0).toUpperCase() + str.slice(1) : str;

 /**
  * Formats BIP39 words into a readable sentence
  * @param words - Array of 12 BIP39 words
  * @returns A formatted sentence string
  */
 function formatSentence(words: string[]): Sentence {
   // Use words in their original order, just format them into a simple sentence
   // This preserves the order for round-trip conversion
   const phrases: string[] = [];
   for (let i = 0; i < 12; i += 4) {
     const w1 = words[i]!;
     const w2 = words[i + 1]!;
     const w3 = words[i + 2]!;
     const w4 = words[i + 3]!;
     phrases.push(`${capitalize(w1)} ${w2} ${w3} ${w4}`);
   }
   return phrases.join('. ') + '.';
 }

 /**
  * Converts IPv6 address to a memorable sentence
  * @param ip - The IPv6 address string
  * @returns A human-readable sentence representing the IPv6 address
  * @throws {IPv6ConversionError} If the IPv6 address is invalid
  */
 function ip6ToSentence(ip: IPv6Address): Sentence {
   if (!ip || typeof ip !== 'string') throw new IPv6ConversionError('Invalid IPv6: must be a non-empty string');
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
   const allWords = sentence.replace(/\./g, '').trim().split(/\s+/).map(word => word.toLowerCase());
   const bip39Words: string[] = [];

   for (const word of allWords) {
     // Check if word is directly in wordlist
     if (BIP39_WORDLIST.includes(word)) {
       bip39Words.push(word);
     }
     // Check if word without 's' suffix is in wordlist (for verbs)
     else if (word.endsWith('s') && BIP39_WORDLIST.includes(word.slice(0, -1))) {
       bip39Words.push(word.slice(0, -1));
     }
   }

   return bip39Words;
 }

 /**
  * Validates BIP39 words and extracts entropy with checksum verification
  * @param words - Array of 12 BIP39 words
  * @returns The extracted entropy as BigInt
  * @throws {InvalidBIP39Error} If words are invalid or checksum fails
  */
 function getEntropyFromWords(words: string[]): bigint {
   if (words.length !== 12) throw new InvalidBIP39Error('Invalid sentence');
   let bitString = 0n;
   for (const w of words) {
     const index = BIP39_WORDLIST.indexOf(w);
     if (index === -1) throw new InvalidBIP39Error('Invalid word');
     bitString = (bitString << 11n) | BigInt(index);
   }
   const checksum = Number(bitString & 0xfn);
   const entropy = bitString >> 4n;
   const entropyBytes = bigIntToBytes(entropy);
   const msg = String.fromCharCode(...entropyBytes);
   const hashHex = sha256Hash(msg);
   const computedChecksum = parseInt(hashHex.substring(0, 2), 16) >> 4;
   if (checksum !== computedChecksum) throw new InvalidBIP39Error('Checksum invalid');
   return entropy;
 }

 /**
  * Converts a sentence back to the original IPv6 address
  * @param sentence - The formatted sentence string
  * @returns The original IPv6 address string
  * @throws {InvalidBIP39Error} If the sentence is invalid
  */
 function sentenceToIp6(sentence: Sentence): IPv6Address {
   if (!sentence || typeof sentence !== 'string') throw new InvalidBIP39Error('Invalid sentence: must be a non-empty string');
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