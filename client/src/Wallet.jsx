import * as secp from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";
import {toHex} from "ethereum-cryptography/utils";

import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    setBalance(0);
    setAddress("");
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp.getPublicKey(privateKey);
    const walletAddress = toHex(keccak256(publicKey.slice(1)).slice(-20));
    setAddress(walletAddress);
    if (walletAddress) {
      const {
        data: { balance },
      } = await server.get(`balance/${walletAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a Private Key, For Example: 0x1er32..." value={privateKey} onChange={onChange}></input>
      </label>
      {address.length > 0 && <div>Wallet Address: 0x{address.slice(0, 5)}...{address.slice(-6)}</div>}
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
