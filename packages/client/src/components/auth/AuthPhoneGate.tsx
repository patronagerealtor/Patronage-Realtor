import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { PhoneRequiredModal } from "./PhoneRequiredModal";

type AuthPhoneGateProps = {
  children: React.ReactNode;
};

/**
 * When the user is signed in but has no phone in user_profiles, shows a modal
 * to collect phone (with name and email). After they save, the modal closes.
 */
export function AuthPhoneGate({ children }: AuthPhoneGateProps) {
  const { user } = useAuth();
  const { needsPhone, refetch } = useProfile(user?.id ?? undefined);

  return (
    <>
      {children}
      <PhoneRequiredModal
        open={!!user && needsPhone}
        user={user ?? null}
        onComplete={() => refetch()}
      />
    </>
  );
}
