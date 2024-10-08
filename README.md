#### Expo Sign in With Farcaster Starter

Expo app implementing [Sign in With Farcaster](https://github.com/farcasterxyz/protocol/discussions/110) for quickstarting Farcaster mobile clients. Copied from [expo demo here](https://github.com/farcasterxyz/auth-monorepo/tree/main/examples/authkit-expo-demo).

Additionally, you can let users grant write access to the Farcaster protocol. Follow the logic in the Farcaster docs [here](https://docs.farcaster.xyz/reference/warpcast/signer-requests) to read about the code in [utils/key.js](./utils/key.js).

Designed to work with a backend that securely stores the keys for users. See example node backend [here](https://github.com/seanrobenalt/farcaster-node-starter).