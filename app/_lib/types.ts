export type Unit = {
  id: string;
  name: string;
};

export type MeetingRoom = {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
};

export type Consumption = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
};

export type BookingConsumption = {
  id: string;
  consumptionId: string;
  consumption: Consumption;
};

export type Booking = {
  id: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  participantQty: number;
  consumptionFee: number;
  status: string;
  unit: Unit;
  room: MeetingRoom;
  consumptions: BookingConsumption[];
};
