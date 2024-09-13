import "fastestsmallesttextencoderdecoder";
import "react-native-get-random-values";

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  TouchableOpacity,
} from "react-native";
import { AuthKitProvider, useSignIn } from "@farcaster/auth-kit";
import { useEffect, useCallback, useState } from "react";
import { generateKey } from "./utils/key";
import { apiCreateUser, apiUpdateUser } from "./api/user";

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
  const [userCreated, setUserCreated] = useState(false);

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

  useEffect(() => {
    if (data && data.state === "completed" && !data.error && !userCreated) {
      apiCreateUser({ fid: data.fid })
        .then(() => {
          setUserCreated(true);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    }
  }, [data]);

  const authenticated = isSuccess && validSignature;

  const handlePlusPress = async () => {
    generateKey().then((result) => {
      apiUpdateUser(result.userFid, { signerKey: result.privateKey });
    });
  };

  return (
    <View style={styles.container}>
      {authenticated ? (
        <View>
          <Text style={styles.mb}>Signed in as {data?.username}</Text>

          <TouchableOpacity onPress={handlePlusPress} style={styles.plusButton}>
            <Text style={styles.plusSign}>Grant Write Access ➕</Text>
          </TouchableOpacity>
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
  plusButton: {
    marginLeft: 10,
  },
  plusSign: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  mb: {
    marginBottom: 10,
  },
});
