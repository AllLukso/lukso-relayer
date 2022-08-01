"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv").config();
const Queue = require("bull");
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const ethers = require("ethers");
const transactionQueue = new Queue("transaction-execution", process.env.REDIS_URL);
const controllingAccountPrivateKey = process.env.PK;
const rpcURL = process.env.RPC_URL;
transactionQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(controllingAccountPrivateKey, provider);
    const { keyManagerAddress, transaction } = job.data;
    const keyManager = new ethers.Contract(keyManagerAddress, KeyManagerContract.abi, wallet);
    console.log("about to executeRelayCall");
    console.time("executeRelayCall");
    const executeRelayCallTransaction = yield keyManager.executeRelayCall(transaction.signature, transaction.nonce, transaction.abi);
    console.time("executeRelayCall");
    console.log("finished executeRelayCall");
    console.log(executeRelayCallTransaction);
    // TODO: Use the gasLimit returned here to immediately decrement the "pending gas limit", if sending another transaction takes their pending limit down too low reject the transaction.
    // Wait until their "pending gas limit" equals their actual "gas remaining" we can sync these values when the transaction confirms. We need to start a job to monitor this transaction and wait until it confirms?
}));
//# sourceMappingURL=execute.js.map