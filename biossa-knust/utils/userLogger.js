import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const isUserLoggedIn = async () => {
  const router = useRouter();
  const token = await AsyncStorage.getItem("jwt");
  // console.log(token);

  if (!token) {
    router.replace("/auth");
  } else {
    router.replace("/home");
  }
};
