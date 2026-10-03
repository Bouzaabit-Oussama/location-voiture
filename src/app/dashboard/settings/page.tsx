import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { SettingsClientPage } from "@/components/dashboard/settings-client-page";

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.profile) {
    redirect("/login");
  }

  const { profile } = currentUser;
  const tenant = profile.tenant || {
    id: "default",
    name: "Mon Agence",
    city: "Tanger",
    email: profile.email,
  };

  return <SettingsClientPage tenant={tenant} profile={profile} />;
}
