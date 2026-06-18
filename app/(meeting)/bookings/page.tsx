import BookingTable from "../_components/bookingTable";
import { getApiBaseUrlForClient, getBookings } from "@/app/_lib/api";

export default async function BookingListPage() {
  const bookings = await getBookings();

  return <BookingTable apiBaseUrl={getApiBaseUrlForClient()} bookings={bookings} />;
}
