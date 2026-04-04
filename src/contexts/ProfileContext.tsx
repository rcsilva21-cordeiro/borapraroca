import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
type ActiveProfile = "turista" | "hospedeiro" | "admin";

interface ProfileContextType {
  activeProfile: ActiveProfile;
  setActiveProfile: (p: ActiveProfile) => void;
  availableProfiles: ActiveProfile[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { roles } = useAuth();
  const [activeProfile, setActiveProfile] = useState<ActiveProfile>("turista");

  const availableProfiles: ActiveProfile[] = roles.length > 0
    ? (roles as ActiveProfile[])
    : ["turista"];

  useEffect(() => {
    const saved = localStorage.getItem("bpr-active-profile") as ActiveProfile | null;
    if (saved && availableProfiles.includes(saved)) {
      setActiveProfile(saved);
    } else if (availableProfiles.length > 0) {
      setActiveProfile(availableProfiles[0]);
    }
  }, [roles]);

  const handleSetProfile = (p: ActiveProfile) => {
    setActiveProfile(p);
    localStorage.setItem("bpr-active-profile", p);
  };

  return (
    <ProfileContext.Provider value={{ activeProfile, setActiveProfile: handleSetProfile, availableProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
