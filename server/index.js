const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "8b82cb6940faeefd3b327e4ee04f9e89176b8d37": 100,
  b5e65ec06840732302fff5a1b858eb8ba3f0bf78: 50,
  "2a960d66b09406e56826fe50d545d0b72144be29": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recoveryBit, hashedTx, tx } = req.body;

  const signatureArray = [];
  for (const [, value] of Object.entries(signature)) {
    signatureArray.push(value);
  }

  const hashedTxArray = [];
  for (const [, value] of Object.entries(hashedTx)) {
    hashedTxArray.push(value);
  }

  const simplifiedSignature = new Uint8Array(signatureArray);
  const simplifiedHashedTx = new Uint8Array(hashedTxArray);

  const publicKey = secp.recoverPublicKey(simplifiedHashedTx, simplifiedSignature, recoveryBit);
  const sender = toHex(keccak256(publicKey.slice(1)).slice(-20));
  const recipient = tx.to;
  const amount = tx.value;

  const txForVerification = keccak256(utf8ToBytes(JSON.stringify(tx)));

  if (!secp.verify(simplifiedSignature, txForVerification, publicKey)) {
    res.status(403).send({ message: "Signature Verification Failed!" });
    return;
  }

  if (sender != tx.from) {
    res.status(403).send({ message: "Please Send your own signed Transaction!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (sender === recipient) {
    res.status(400).send({ message: "Wastage of Gas not Allowed!" });
  } else if (amount === 0) {
    res.status(400).send({ message: "Could not transact 0 Amount!" });
  } else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
