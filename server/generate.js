const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = toHex(secp.utils.randomPrivateKey());

console.log("privateKey:", privateKey);

const publicKey = secp.getPublicKey(privateKey);
const publicKeyHashed = toHex(publicKey);
const walletAddress = toHex(keccak256(publicKey.slice(1)).slice(-20));

console.log("publicKeyHashed:", publicKeyHashed);
console.log("wallet address:", walletAddress);

// 1. PrivateKey: 17f46ab0ef0ee3729fd0d42556c4b130b687ce09f46c07d2bd80a009975ed144
// 1. publicKey : 0418145195b580bbfa23c6c653ec3e5869390cc1260ef185a11c287dc95d4847017986e7b44927b4d875e78661f3fcf72ff0c7caba83446416d4485b9929ae3eba
// 1. walletAddress: 8b82cb6940faeefd3b327e4ee04f9e89176b8d37

// 2. PrivateKey: e7df67a6c1a77220c57da6df088b34b9ac39a91dbc73b8228f11367eb3e592e1
// 2. publicKey : 0452ebb22ac171369cbf7851f5f88eab3e9e7492cf95f6dcafd81f03f4bfe68a1fb96d31d6101fc1e286c3b29511105c8c064ad89ef57b1c88b625feeb3ef28e84
// 2. walletAddress: b5e65ec06840732302fff5a1b858eb8ba3f0bf78

// 3. PrivateKey: 1b9b4d1808fdd28b8789dd389c55924c64d448f2b001d245cdf4406cd6c2c933
// 3. publicKey : 049bd244ff7a45200e7769f8428be8496892385682ae6b9eb48d84e6f67c27a47fb801cf61a3be7e70bf36dc902c0a78e885cf4e4002bbc16f4a1329265d55340c
// 3. walletAddress: 2a960d66b09406e56826fe50d545d0b72144be29
