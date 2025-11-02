import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Arahkan otomatis ke halaman login
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 1000); // jeda 1 detik untuk loading singkat

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator size="large" color="green" />
    </View>
  );
}
