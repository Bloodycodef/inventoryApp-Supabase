import { Loading } from "@/components/shared/loading";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView } from "react-native";

import { AddStaffModal } from "@/components/profiles/addStaffModal";
import { ProfileActions } from "@/components/profiles/profileAction";
import { ProfileHeader } from "@/components/profiles/profileHeader";
import { ProfileInfoCard } from "@/components/profiles/profileInfoCard";
import { useProfile } from "../../hook/profiles/useProfiles";
import { useUser } from "../../hook/profiles/useUser";
import { authService } from "../../services/auth/authService";

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const {
    profile,
    location,
    loading: profileLoading,
    refreshProfile,
  } = useProfile(user);
  const router = useRouter();

  const [showAddStaff, setShowAddStaff] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Logout gagal", error.message);
    }
  };

  const handleStaffAdded = () => {
    refreshProfile();
  };

  if (authLoading || profileLoading) return <Loading />;
  if (!user || !profile) return null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ProfileHeader profile={profile} />
      <ProfileInfoCard profile={profile} location={location} />

      <ProfileActions
        isAdmin={profile.role === "admin"}
        onAddStaff={() => setShowAddStaff(true)}
        onLogout={handleLogout}
      />

      {/* Modal Tambah Staff */}
      {profile.role === "admin" && (
        <AddStaffModal
          visible={showAddStaff}
          onClose={() => setShowAddStaff(false)}
          onSuccess={handleStaffAdded}
          adminBranchId={user.branch_id}
          adminUserId={user.user_id}
        />
      )}
    </ScrollView>
  );
}
