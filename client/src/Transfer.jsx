import * as secp from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";
import {utf8ToBytes} from "ethereum-cryptography/utils";

import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const tx = {
      from: address,
      data: "",
      value: parseInt(sendAmount),
      to: recipient
    }

    const hashedTx = keccak256(utf8ToBytes(JSON.stringify(tx)));
    const [signature, recoveryBit] = await secp.sign(hashedTx, privateKey, {recovered: true});
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature,
        recoveryBit,
        hashedTx,
        tx: tx
      });
      setBalance(balance);
    } catch (ex) {
      console.log("ex:", ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
