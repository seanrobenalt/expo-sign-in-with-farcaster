import * as ed from "@noble/ed25519";
import { mnemonicToAccount } from "viem/accounts";
import axios from "axios";
import { FID, MNEMONIC } from "@env";
import { sha512 } from "@noble/hashes/sha512";
import { Buffer } from "buffer";
import { Linking } from "react-native";

global.Buffer = Buffer;

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

const warpcastApi = "https://api.warpcast.com";

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000FC700472606ED4fA22623Acf62c60553",
};

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
];

export const generateKey = async () => {
  const privateKey = ed.utils.randomPrivateKey();
  const publicKeyBytes = ed.getPublicKey(privateKey);

  const key = "0x" + Buffer.from(publicKeyBytes).toString("hex");

  const appFid = FID;
  const account = mnemonicToAccount(MNEMONIC);

  const deadline = Math.floor(Date.now() / 1000) + 86400;
  const signature = await account.signTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: "SignedKeyRequest",
    message: {
      requestFid: BigInt(appFid),
      key,
      deadline: BigInt(deadline),
    },
  });

  const { token, deeplinkUrl } = await axios
    .post(`${warpcastApi}/v2/signed-key-requests`, {
      key,
      requestFid: appFid,
      signature,
      deadline,
      redirectUrl: "exp://10.0.0.171:8081",
    })
    .then((response) => response.data.result.signedKeyRequest);

  Linking.openURL(deeplinkUrl);

  const poll = async (token) => {
    let signedKeyRequest = await axios
      .get(`${warpcastApi}/v2/signed-key-request`, {
        params: {
          token,
        },
      })
      .then((response) => response.data.result.signedKeyRequest);

    while (signedKeyRequest.state !== "completed") {
      signedKeyRequest = await axios
        .get(`${warpcastApi}/v2/signed-key-request`, {
          params: {
            token,
          },
        })
        .then((response) => response.data.result.signedKeyRequest);
    }

    /* 
      Object contains a userFid. 
      You can save the private key securely with the userFid to use for writing messages later.
      
      const userFid = signedKeyRequest.userFid;
    */

    return signedKeyRequest;
  };

  await poll(token);
};
