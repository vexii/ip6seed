 /**
  * Type definitions for the IPv6 to sentence converter
  */

 /**
  * Represents an IPv6 address as a string
  */
 export type IPv6Address = string;

 /**
  * Represents entropy as a BigInt value
  */
 export type Entropy = bigint;

 /**
  * Represents a 12-word BIP39 mnemonic phrase
  */
 export type BIP39Words = readonly [string, string, string, string, string, string, string, string, string, string, string, string];

 /**
  * Represents a formatted sentence string
  */
 export type Sentence = string;

 /**
  * Represents a byte array (Uint8Array)
  */
 export type ByteArray = Uint8Array;

 /**
  * Error class for IPv6 conversion errors
  */
 export class IPv6ConversionError extends Error {
   constructor(message: string) {
     super(message);
     this.name = 'IPv6ConversionError';
   }
 }

 /**
  * Error class for invalid BIP39 words
  */
 export class InvalidBIP39Error extends Error {
   constructor(message: string) {
     super(message);
     this.name = 'InvalidBIP39Error';
   }
 }