import BookingForm from "../../_components/bookingForm";
import {
  getApiBaseUrlForClient,
  getConsumptions,
  getMeetingRooms,
  getUnits,
} from "@/app/_lib/api";

export default async function BookingCreatePage() {
  const [units, meetingRooms, consumptions] = await Promise.all([
    getUnits(),
    getMeetingRooms(),
    getConsumptions(),
  ]);

  return (
    <BookingForm
      apiBaseUrl={getApiBaseUrlForClient()}
      consumptions={consumptions}
      meetingRooms={meetingRooms}
      units={units}
    />
  );
}
