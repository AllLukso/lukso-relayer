import { ethers } from "ethers";
import KeyManagerContract from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";

const CHAIN_ID = process.env.CHAIN_ID;

export async function setUpKeyManager(address: string, wallet: ethers.Wallet) {
  const universalProfileContract = new ethers.Contract(
    address,
    UniversalProfileContract.abi,
    wallet
  );
  const kmAddress = await universalProfileContract.owner();
  const keyManager = new ethers.Contract(
    kmAddress,
    KeyManagerContract.abi,
    wallet
  );
  return { kmAddress, keyManager };
}

export function getSignerAddress(
  kmAddress: any,
  nonce: string,
  abi: string,
  signature: string
) {
  const message = ethers.utils.solidityKeccak256(
    ["uint", "address", "uint", "bytes"],
    [CHAIN_ID, kmAddress, nonce, abi]
  );

  // Need to arrayify here to get correct address.
  const signerAddress = ethers.utils.verifyMessage(
    ethers.utils.arrayify(message),
    signature
  );
  return signerAddress;
}

export async function estimateGas(
  keyManager: ethers.Contract,
  signature: string,
  nonce: string,
  abi: string
) {
  const estimatedGasBN = await keyManager.estimateGas.executeRelayCall(
    signature,
    nonce,
    abi
  );
  const estimatedGas = estimatedGasBN.toNumber();
  return estimatedGas;
}

export async function getWalletNonce(db: any, wallet: ethers.Wallet) {
  const pendingWalletTransaction = await db.oneOrNone(
    "SELECT * FROM transactions WHERE relayer_address = $1 AND status = 'PENDING' ORDER BY relayer_nonce DESC LIMIT 1",
    [wallet.address]
  );
  let walletNonce: number;
  if (pendingWalletTransaction) {
    walletNonce = Number(pendingWalletTransaction.relayer_nonce) + 1;
  } else {
    walletNonce = await wallet.getTransactionCount();
  }
  return walletNonce;
}

export async function calcHash(
  keyManager: ethers.Contract,
  signature: string,
  nonce: string,
  abi: string,
  walletNonce: number,
  wallet: ethers.Wallet
) {
  const unsignedTx = await keyManager.populateTransaction.executeRelayCall(
    signature,
    nonce,
    abi
  );
  const populatedUnsignedTx = await wallet.populateTransaction(unsignedTx);
  populatedUnsignedTx.nonce = walletNonce;
  const signedTx = await keyManager.signer.signTransaction(populatedUnsignedTx);
  const parsedTx = ethers.utils.parseTransaction(signedTx);
  return parsedTx.hash;
}
