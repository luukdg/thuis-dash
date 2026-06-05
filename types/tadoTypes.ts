export type RoomTemp = {
  id: number;
  name: string;
  temperature: number;
  isHeating: boolean;
  setting: number;
};

export type DeviceType = {
  id: number;
  name: string;
  atHome: boolean;
};
