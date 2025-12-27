import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface Profile {
  username: string;
  role: "admin" | "staf-gudang" | "staf-kasir";
  branch_name: string;
  branch_id?: number;
  email?: string;
}

export const useProfile = (user: any) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Akses lokasi ditolak");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(
        `${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`
      );
    } catch {
      setLocation("Tidak dapat mengambil lokasi");
    }
  };

  const fetchProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("app_users")
        .select(
          `
          username,
          role,
          email,
          branch_id,
          branches!inner(branch_name)
        `
        )
        .eq("user_id", user.user_id)
        .single();

      if (error) throw error;

      setProfile({
        username: data.username,
        role: data.role,
        email: data.email,
        branch_id: data.branch_id,
        branch_name: (data.branches as { branch_name: string }).branch_name,
      });

      fetchLocation();
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      Alert.alert("Error", err.message || "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, location, loading, refreshProfile: fetchProfile };
};
