import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from("app_users")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      setUser({
        ...userData,
        user_id: data.user.id,
      });
      setLoading(false);
    };

    load();
  }, []);

  return { user, loading };
}
