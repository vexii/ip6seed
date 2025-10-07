 import { ip6ToSentence, sentenceToIp6, ip6ToBigInt } from './ipv6';

 /**
  * Generates a random IPv6 address for demonstration
  * @returns A random IPv6 address string
  */
 function generateRandomIPv6(): string {
   const groups: string[] = [];
   for (let i = 0; i < 8; i++) {
     groups.push(Math.floor(Math.random() * 65536).toString(16).padStart(4, '0'));
   }
   return groups.join(':');
 }

 // Example usage with improved formatting and multiple examples
 const examples = [
   'fe80::2fb4:5866:4c4d:b951',
   '::1',
   '2001:db8::1',
   generateRandomIPv6(),
   generateRandomIPv6()
 ];

 console.log('🔗 IPv6 to Sentence Converter');
 console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
 console.log('🚀 Converting multiple IPv6 addresses to memorable sentences...\n');

 examples.forEach((ipv6, index) => {
   try {
     const sentence = ip6ToSentence(ipv6);
     const recoveredIPv6 = sentenceToIp6(sentence);
     const originalBigInt = ip6ToBigInt(ipv6);
     const recoveredBigInt = ip6ToBigInt(recoveredIPv6);
     const success = originalBigInt === recoveredBigInt;

     console.log(`📍 Example ${index + 1}:`);
     console.log(`   📥 Original IPv6: ${ipv6}`);
     console.log(`   📝 Generated Sentence: ${sentence}`);
     console.log(`   📤 Recovered IPv6: ${recoveredIPv6}`);
     console.log(`   ✅ Round-trip successful: ${success ? 'Yes' : 'No'}`);
     console.log('');
   } catch (error) {
     console.log(`❌ Error with example ${index + 1} (${ipv6}): ${error instanceof Error ? error.message : String(error)}`);
     console.log('');
   }
 });

 console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
 console.log('💡 Tip: Use this tool to create human-readable backups of IPv6 addresses!');
 console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

 // Export for potential use
 export { examples };