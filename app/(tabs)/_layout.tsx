import { supabase } from "@/lib/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/login");
      }
    };

    checkSession();
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: true, // ✅ tampilkan header
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        headerTintColor: "#1E293B",
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="HomePage"
        options={{
          title: "Home",
          headerTitle: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Items"
        options={{
          title: "Items",
          headerTitle: "Daftar Item",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Transaction"
        options={{
          title: "Transaction",
          headerTitle: "Transaksi",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerTitle: "Profil Saya",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
