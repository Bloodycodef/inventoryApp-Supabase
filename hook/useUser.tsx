// hook/useUser.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setLoading(false);

      const { data: userData } = await supabase
        .from("app_users")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      setUser(userData);
      setLoading(false);
    };
    load();
  }, []);

  return { user, loading };
}
