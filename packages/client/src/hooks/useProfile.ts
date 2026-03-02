import { useState, useEffect, useCallback } from "react";
import type { UserProfileRow } from "@/services/profile";
import { profileService } from "@/services/profile";

export type ProfileState = {
  profile: UserProfileRow | null;
  loading: boolean;
  /** True when user is signed in but profile is missing or phone is empty */
  needsPhone: boolean;
  refetch: () => Promise<void>;
};

/**
 * Fetches the user profile from user_profiles. When userId is set, needsPhone is true
 * if there is no profile or profile.phone is null/empty.
 */
export function useProfile(userId: string | undefined): ProfileState {
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [loading, setLoading] = useState(!!userId);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const p = await profileService.getProfile(userId);
    setProfile(p);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const needsPhone =
    !!userId &&
    !loading &&
    (!profile || !profile.phone || profile.phone.trim() === "");

  return { profile, loading, needsPhone, refetch: fetchProfile };
}
