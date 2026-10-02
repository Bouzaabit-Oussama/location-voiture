import { getFleetVehicles, getFleetCompliance } from "@/app/actions/fleet";
import { FleetClientPage } from "@/components/fleet/fleet-client-page";

export default async function FleetPage() {
  const [fleetData, compliance] = await Promise.all([
    getFleetVehicles(),
    getFleetCompliance(),
  ]);

  return (
    <FleetClientPage
      initialVehicles={fleetData.vehicles}
      compliance={compliance}
    />
  );
}
