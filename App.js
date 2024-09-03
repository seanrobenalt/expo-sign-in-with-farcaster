import "fastestsmallesttextencoderdecoder";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Linking } from "react-native";
import { AuthKitProvider, useSignIn } from "@farcaster/auth-kit";
import { useEffect, useCallback } from "react";

const config = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "sean07.com",
  siweUri: "https://sean07.com",
  redirectUrl: "exp://10.0.0.171:8081",
};

export default function App() {
  return (
    <AuthKitProvider config={config}>
      <Content />
      <StatusBar style="auto" />
    </AuthKitProvider>
  );
}

function Content() {
  const {
    signIn,
    url,
    isError,
    isSuccess,
    connect,
    reconnect,
    channelToken,
    data,
    validSignature,
  } = useSignIn();

  const onClick = useCallback(() => {
    if (isError) {
      reconnect();
    }
    signIn();

    if (url) {
      Linking.openURL(url);
    }
  }, [isError, reconnect, signIn, url]);

  useEffect(() => {
    if (!channelToken) {
      connect();
    }
  }, [channelToken, connect]);

  const authenticated = isSuccess && validSignature;

  return (
    <View style={styles.container}>
      {authenticated ? (
        <View>
          <Text>Signed in!</Text>
          <Text>{data?.username}</Text>
        </View>
      ) : (
        <View>
          <Button onPress={onClick} title="Sign in">
            Sign in
          </Button>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
