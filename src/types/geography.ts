// Assuming other interfaces (District, Supporter, Event) are defined.

import { Supporter } from "./supporter";

export interface Region {
  id: number;
  name: string;
  latitude: number | null; // @db.Decimal(10, 7)
  longitude: number | null; // @db.Decimal(10, 7)
  boundary: object | null; // Json
  createdAt: Date;
  updatedAt: Date;

  // Relations
  districts: District[];
  supporters: Supporter[];
  Event: Event[]; // Note: Field name is 'Event' in the schema, which is unusual for a collection.
}

export interface District {
  id: number;
  regionId: number;
  name: string;
  latitude: number | null; // @db.Decimal(10, 7)
  longitude: number | null; // @db.Decimal(10, 7)
  boundary: object | null; // Json
  createdAt: Date;
  updatedAt: Date;

  // Relations
  region: Region;
  pollingStations: PollingStation[];
  supporters: Supporter[];
  events: Event[];
}

export interface PollingStation {
  id: number;
  districtId: number;
  name: string;
  latitude: number | null; // @db.Decimal(10, 7)
  longitude: number | null; // @db.Decimal(10, 7)
  createdAt: Date;
  updatedAt: Date;

  // Relations
  district: District;
  supporters: Supporter[];
}