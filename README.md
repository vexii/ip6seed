 # IPv6 to Sentence Converter

 Okay, so IPv6 addresses are a nightmare to remember, right? Those colon-filled monsters like fe80::2fb4:5866:4c4d:b951 – yeah, good luck with that. I built this thing to turn them into actual sentences you can jot down or tell someone, using that BIP39 wordlist everyone's familiar with. And the cool part? It goes both ways perfectly – no data loss, promise.

 ## What This Thing Does

 - **Back-and-forth magic**: Converts IPv6 to a sentence and back again, spot-on every time.
 - **BIP39 vibes**: Grabs words from the standard 2048-word list, so it's legit.
 - **Safety first**: Throws in SHA256 checksums to make sure nothing gets corrupted.
 - **Readable chunks**: Breaks the 12 words into 4-word groups for easy scanning.
 - **Snappy and slim**: Runs quick on TypeScript and Bun, without dragging in a bunch of extras.

 ## A Quick Demo

 Check this out – here's how it handles an example:

 ```
 🔗 IPv6 to Sentence Converter
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📥 Original IPv6: fe80::2fb4:5866:4c4d:b951
 📝 Generated Sentence: You abandon abandon abandon. Abandon abandon satisfy merit. Grocery glass human piece.
 📤 Recovered IPv6: fe80:0:0:0:2fb4:5866:4c4d:b951
 ✅ Round-trip successful: Yes
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ```

 ## Getting It Running

 Grab the dependencies first:

 ```bash
 bun install
 ```

 Then fire it up:

 ```bash
 bun start
 ```

 Or plug it into your own code like this:

 ```typescript
 import { ip6ToSentence, sentenceToIp6 } from './src/ipv6';

 const sentence = ip6ToSentence('fe80::2fb4:5866:4c4d:b951');
 const ipv6 = sentenceToIp6(sentence);
 ```

 ## The Guts of It

 Here's the rundown: It grabs your IPv6, turns it into a massive number (we're talking BigInt here), then uses that to shuffle through the BIP39 words, adds a quick checksum for good measure, and spits out a sentence. Flip it around, and boom – back to the original IP. Simple, but it works.

 ## What's Where

 ```
 src/
 ├── index.ts          # Where the demo runs from
 ├── ipv6.ts           # All the conversion smarts
 ├── wordlist.ts       # The BIP39 word stash
 └── types.ts          # TypeScript type stuff
 tests/
 └── ipv6-converter.test.ts      # Tests to keep it honest
 ```

 ## Testing

 Wanna make sure it's solid? Run the tests:

 ```bash
 bun test
 ```

 ## Stuff It Needs

 - **TypeScript**: Keeps the types in check and lets us use modern JS.
 - **Bun**: Handles running and bundling everything smoothly.

 ## Got Ideas?

 If you wanna tweak something or add a feature, here's the drill:

 1. Fork this repo.
 2. Branch off for your changes.
 3. Hack away – and yeah, throw in tests for anything new.
 4. Run the tests to catch any slip-ups.
 5. Shoot over a pull request.

 ## License

 MIT – do what you want with it!

 ---

 Threw this together with Bun and TypeScript. Hope it saves you from IPv6 headaches!
