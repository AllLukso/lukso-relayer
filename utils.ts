import { ERC725 } from "@erc725/erc725.js";
import LSP6Schema from "@erc725/erc725.js/schemas/LSP6KeyManager.json";
import Web3 from "web3";

const RPC_URL = process.env.RPC_URL;
const web3 = new Web3(RPC_URL!);

export async function checkSignerPermissions(
  address: string,
  signerAddress: string
) {
  // @ts-ignore
  const erc725 = new ERC725(LSP6Schema, address, web3.currentProvider);
  const addressPermission = await erc725.getData({
    keyName: "AddressPermissions:Permissions:<address>",
    dynamicKeyParts: signerAddress,
  });

  console.log("signerAddress: ", signerAddress);
  console.log("address: ", address);
  // @ts-ignore
  const decodedPermission = erc725.decodePermissions(addressPermission.value);
  console.log("decoded: ", decodedPermission);
  if (!decodedPermission["SIGN"]) throw "signer missing sign permissions";
}
