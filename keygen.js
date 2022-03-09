const { generateSeed, deriveKeypair, deriveAddress } = require('ripple-keypairs')

const seed = generateSeed();
const keypair = deriveKeypair(seed);
const accountAddress = deriveAddress(keypair.publicKey);

console.log("Account address : ", accountAddress)
console.log("Prvate key      : ", keypair.privateKey)
console.log("Public key      : ", keypair.publicKey)