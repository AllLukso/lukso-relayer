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
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const UniversalProfileContract = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const ethers = require("ethers");
const Queue = require("bull");
const CHAIN_ID = process.env.CHAIN_ID;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PK;
const transactionQueue = new Queue("transaction-execution", process.env.REDIS_URL);
function execute(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
            const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
            const { address, transaction } = req.body;
            const universalProfileContract = new ethers.Contract(address, UniversalProfileContract.abi, wallet);
            console.time("owner");
            const keyManagerAddress = yield universalProfileContract.owner();
            console.timeEnd("owner");
            // TODO: may need to extract the channelId and nonce from the transaction.nonce, then check to make sure I don't try to submit out of order nonces on the same channel?
            // First 128 bits of the nonce are the channelId and last 128 bits are the actual nonce.
            const message = ethers.utils.solidityKeccak256(["uint", "address", "uint", "bytes"], [CHAIN_ID, keyManagerAddress, transaction.nonce, transaction.abi]);
            const signerAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(message), transaction.signature);
            console.time("database");
            const signer = yield db.task((t) => __awaiter(this, void 0, void 0, function* () {
                const signer = yield t.oneOrNone("SELECT * FROM signers WHERE address = $1", signerAddress);
                if (!signer)
                    throw "signer was not approved";
                const universalProfile = yield t.oneOrNone("SELECT * FROM universal_profiles WHERE user_id = $1 AND address = $2", [signer.user_id, req.body.address]);
                if (!universalProfile)
                    throw "universal profile not approved please approve for your account and try again";
                const transactionQuota = yield db.oneOrNone("SELECT monthly_gas, gas_used FROM transaction_quotas WHERE user_id = $1", signer.user_id);
                if (!transactionQuota)
                    throw "transaction quota not found";
                if (transactionQuota.gas_used > transactionQuota.monthly_gas)
                    throw "over gas limit";
                return signer;
            }));
            console.timeEnd("database");
            const keyManager = new ethers.Contract(keyManagerAddress, KeyManagerContract.abi, wallet);
            console.time("gas");
            const estimatedGas = yield keyManager.estimateGas.executeRelayCall(transaction.signature, transaction.nonce, transaction.abi);
            console.timeEnd("gas");
            console.log("estimatedGas: ", estimatedGas.toNumber());
            yield db.none("UPDATE transaction_quotas SET gas_used = gas_used + $1 WHERE user_id = $2", [estimatedGas.toNumber(), signer.user_id]);
            // TODO: This takes about 5 seconds, if we can stick this in a job that would be great, but need to figure out how to calculate the correct transaction hash AND ensure it is still the same
            // When this actually executes.
            console.time("call");
            const executeRelayCallTransaction = yield keyManager.executeRelayCall(transaction.signature, transaction.nonce, transaction.abi);
            console.timeEnd("call");
            console.log(executeRelayCallTransaction);
            // Enqueue a job here that will get the transaction receipt for this transaction and upate the actual gas used.
            res.json({ transactionHash: executeRelayCallTransaction.hash });
        }
        catch (err) {
            console.log(err);
            return next("failed to execute transaction");
        }
    });
}
function quota(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const { address, timestamp, signature } = req.body;
            const now = new Date().getTime();
            const timeDiff = now - timestamp;
            if (timeDiff > 5000 || timeDiff < -5000)
                throw "timestamp must be +/- 5 seconds";
            const message = ethers.utils.solidityKeccak256(["address", "uint"], [address, timestamp]);
            const signerAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(message), signature);
            const transactionQuota = yield db.task((t) => __awaiter(this, void 0, void 0, function* () {
                let transactionQuota;
                transactionQuota = yield t.oneOrNone("SELECT * FROM transaction_quotas WHERE owner_address = $1", address);
                if (!transactionQuota) {
                    transactionQuota = yield t.one("INSERT INTO transaction_quotas(owner_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *", [address, 650000, 0]);
                }
                if (signerAddress === address)
                    return transactionQuota;
                const signerQuota = yield t.oneOrNone("SELECT * FROM transaction_quotas WHERE owner_address = $1", signerAddress);
                return {
                    gas_used: transactionQuota.gas_used + signerQuota.gas_used,
                    monthly_gas: transactionQuota.monthly_gas + signerQuota.monthly_gas,
                };
            }));
            const date = new Date();
            const firstOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            res.json({
                quota: transactionQuota.gas_used,
                unit: "gas",
                totalQuota: transactionQuota.monthly_gas,
                resetDate: firstOfNextMonth.getTime(),
            });
        }
        catch (err) {
            console.log(err);
            return next("failed to get quota");
        }
    });
}
function execute_v2(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { address, transaction: { nonce, abi, signature }, } = req.body;
            validateExecuteParams(address, nonce, abi, signature);
            const db = req.app.get("db");
            const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
            const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
            const universalProfileContract = new ethers.Contract(address, UniversalProfileContract.abi, wallet);
            const keyManagerAddress = yield universalProfileContract.owner();
            const keyManager = new ethers.Contract(keyManagerAddress, KeyManagerContract.abi, wallet);
            const estimatedGasBN = yield keyManager.estimateGas.executeRelayCall(signature, nonce, abi);
            const estimatedGas = estimatedGasBN.toNumber();
            yield db.task((t) => ensureRemainingQuota(t, estimatedGas, address, keyManagerAddress, nonce, abi, signature));
            // TODO: Doing all this extra work to populate X2, sign, and parse, the transaction almost equals the amount of time to just submit and wait for it to come back...
            // const unsignedTx = await keyManager.populateTransaction.executeRelayCall(
            //   signature,
            //   nonce,
            //   abi
            // );
            // const populatedUnsignedTx = await wallet.populateTransaction(unsignedTx);
            // const signedTx = await keyManager.signer.signTransaction(
            //   populatedUnsignedTx
            // );
            // const parsedTx = ethers.utils.parseTransaction(signedTx);
            // console.log("parsedTx: ", parsedTx);
            // TODO: I think I can use a KeyManager to submit my transactions, then I would be able to create a nonce and assign it to the transaction to be used and it won't conflict with any other transactions going out.
            // 1. Create a UP for the relayer to use
            // 2. Store the signers private key
            // 3. Store "pending transactions" in the database with a random nonce assigned to them.
            // 4. When executing these transactions they won't conflict with each other on my UP.
            const tx = yield keyManager.executeRelayCall(signature, nonce, abi);
            res.json({ transactionHash: tx.hash });
        }
        catch (err) {
            console.log(err);
            return next(err);
        }
    });
}
function validateExecuteParams(address, nonce, abi, signature) {
    if (address === undefined || address === "")
        throw "address must be present";
    if (nonce === undefined)
        throw "nonce must be present";
    if (abi === undefined || abi === "")
        throw "abi must be present";
    if (signature === undefined || signature === "")
        throw "signature must be present";
}
function ensureRemainingQuota(t, estimatedGas, address, keyManagerAddress, nonce, abi, signature) {
    return __awaiter(this, void 0, void 0, function* () {
        let usingSignerQuota = false;
        let signerAddress;
        let tq;
        tq = yield t.oneOrNone("SELECT * FROM transaction_quotas WHERE owner_address = $1", address);
        if (!tq) {
            tq = yield t.one("INSERT INTO transaction_quotas(owner_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *", [address, 650000, 0]);
        }
        if (tq.gas_used + estimatedGas > tq.monthly_gas) {
            // The UP has run out of gas, check if they have a signer with gas available.
            const message = ethers.utils.solidityKeccak256(["uint", "address", "uint", "bytes"], [CHAIN_ID, keyManagerAddress, nonce, abi]);
            signerAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(message), signature);
            // If this UP is over the gas limit then see if there is a signer registered to it that does have available gas.
            tq = yield t.oneOrNone("SELECT * FROM transaction_quotas WHERE owner_address = $1", signerAddress);
            if (!tq)
                throw "out of gas, upgrade to a pro plan to increase gas limit";
            usingSignerQuota = true;
        }
        if (tq.gas_used + estimatedGas > tq.monthly_gas)
            throw "transaction would exceed gas limit, upgrade to a pro plan to increase gas limit";
        const updateAddress = usingSignerQuota ? signerAddress : address;
        yield t.none("UPDATE transaction_quotas SET gas_used = gas_used + $1 WHERE owner_address = $2", [estimatedGas, updateAddress]);
    });
}
module.exports = { execute, quota, execute_v2 };
//# sourceMappingURL=transaction.js.map