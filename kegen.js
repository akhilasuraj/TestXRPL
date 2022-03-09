const { generateSeed, deriveKeypair, deriveAddress } = require('ripple-keypairs')

const seed = generateSeed();
const keypair = deriveKeypair(seed);
const secret = deriveAddress(keypair.privateKey);
const pubKey = deriveAddress(keypair.publicKey);

console.log("privte key : ", secret)
console.log("public key : ", pubKey)