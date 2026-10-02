import { getInfractions } from "@/app/actions/infractions";
import { getFleetVehicles } from "@/app/actions/fleet";
import { LegalClientPage } from "@/components/legal/legal-client-page";

export default async function LegalPage() {
  const { infractions } = await getInfractions();
  const { vehicles } = await getFleetVehicles();

  return <LegalClientPage initialInfractions={infractions} vehicles={vehicles} />;
}
