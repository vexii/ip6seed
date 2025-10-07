  import { BIP39_WORDLIST } from './wordlist';
  import type { IPv6Address, Sentence, ByteArray } from './types';

 /**
  * Simple SHA256 hash function for BIP39 checksum calculation
  * @param message - The string message to hash
  * @returns The SHA256 hash as a hexadecimal string
  */
  function sha256Hash(message: string): string {
    // Use Node.js crypto for SHA256
    const { createHash } = require('crypto');
    return createHash('sha256').update(message, 'utf8').digest('hex');
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
  * Converts BigInt to 16-byte Uint8Array
  * @param big - The BigInt value to convert
  * @returns A Uint8Array of 16 bytes representing the BigInt
  */
  function bigIntToBytes(big: bigint): ByteArray {
    return new Uint8Array(Array.from({ length: 16 }, () => {
      const byte = Number(big & 0xffn);
      big >>= 8n;
      return byte;
    }));
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
      words.push(BIP39_WORDLIST[index as number]!);
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
   // Create a more natural sentence using the 12 BIP39 words in order
   // Add connector words for better flow while preserving reversibility
   const w1 = capitalize(words[0]!);
   const w2 = words[1]!;
   const w3 = words[2]!;
   const w4 = words[3]!;
   const w5 = words[4]!;
   const w6 = words[5]!;
   const w7 = words[6]!;
   const w8 = words[7]!;
   const w9 = words[8]!;
   const w10 = words[9]!;
   const w11 = words[10]!;
   const w12 = words[11]!;

   // Build a narrative sentence with connectors
   return `${w1} ${w2} the forgotten path, ${w3} old doubts, and ${w4} hidden treasures. ${capitalize(w5)} ${w6} and ${w7} with ${w8}, ${w9}, ${w10}, and ${w11} ${w12}.`;
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
    const allWords = sentence.replace(/\./g, '').trim().split(/\s+/).map(word => word.replace(/[^a-z]/gi, '').toLowerCase());
    const bip39Words = allWords
      .filter(word => word) // Skip empty strings after cleaning
      .map(word => {
        // Check if word is directly in wordlist
        if (BIP39_WORDLIST.includes(word)) {
          return word;
        }
        // Check if word without 's' suffix is in wordlist (for verbs)
        if (word.endsWith('s') && BIP39_WORDLIST.includes(word.slice(0, -1))) {
          return word.slice(0, -1);
        }
        return null;
      })
      .filter(word => word !== null) as string[];

    return bip39Words.slice(0, 12);
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
    const msg = String.fromCharCode(...entropyBytes);
    const hashHex = sha256Hash(msg);
    const computedChecksum = parseInt(hashHex.substring(0, 2), 16) >> 4;
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