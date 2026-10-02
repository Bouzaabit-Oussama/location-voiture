import { getInspections } from "@/app/actions/inspections";
import { InspectionsClientPage } from "@/components/inspections/inspections-client-page";

import { getFleetVehicles } from "@/app/actions/fleet";
import { getBookings } from "@/app/actions/bookings";

export default async function InspectionsPage() {
  const { inspections } = await getInspections();
  const { vehicles } = await getFleetVehicles();
  const { bookings } = await getBookings();

  return <InspectionsClientPage initialInspections={inspections} vehicles={vehicles} bookings={bookings} />;
}
