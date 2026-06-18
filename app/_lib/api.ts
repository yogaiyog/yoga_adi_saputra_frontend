import "server-only";
import type {
  Booking,
  Consumption,
  MeetingRoom,
  Unit,
} from "./types";

function getApiBaseUrl() {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3001"
  );
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrlForClient() {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:3001"
  );
}

export function getBookings() {
  return apiFetch<Booking[]>("/api/bookings");
}

export function getUnits() {
  return apiFetch<Unit[]>("/api/units");
}

export async function getMeetingRooms() {
  const rooms = await apiFetch<MeetingRoom[]>("/api/meeting-rooms");
  return rooms.filter((room) => room.isActive);
}

export async function getConsumptions() {
  const consumptions = await apiFetch<Consumption[]>("/api/consumptions");
  return consumptions.filter((item) => item.isActive);
}
