import { supabase } from "@/lib/supabase";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1️⃣ cek session awal
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && !pathname.startsWith("/auth")) {
        router.replace("/auth/login");
      }
      setReady(true);
    });

    // 2️⃣ listen auth change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AUTH CHANGE:", session);

      if (!session && !pathname.startsWith("/auth")) {
        router.replace("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
