import { Gender, SupporterStatus } from './enums'; 
import { District, PollingStation, Region } from './geography';
import { Operator } from './operator';
import { User } from './users';
// Assuming enums are imported from an enums file


// Other interfaces (User, PollingStation, District, Region, OperatorSupporter) must also be defined.

export interface Supporter {
  id: number;
  firstname: string;
  middlename: string | null;
  lastname: string;
  fourthname: string | null;
  birthdate: Date | null; // @db.Date
  gender: Gender;
  language: string | null;
  specialNeeds: string | null;
  email: string | null;
  address: string | null;
  latitude: number | null; // Decimal
  longitude: number | null; // Decimal
  voterId: string | null;
  photoVerification: string | null;
  favParty: string | null;
  status: SupporterStatus;
  pollingStationId: number | null;
  districtId: number | null;
  regionId: number | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  pollingStation: PollingStation | null;
  district: District | null;
  region: Region | null;
  createdByUser: User | null;
  updatedByUser: User | null;
  phones: SupporterPhone[];
  emergencyContacts: SupporterEmergencyContact[];
  operatorSupporters: OperatorSupporter[];
}

// Supporting Supporter Models
export enum SupporterPhoneType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}
export interface SupporterPhone {
  id: number;
  supporterId: number;
  phone: string;
  type: SupporterPhoneType; // Defaults to "mobile"
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  supporter: Supporter;
}

export interface SupporterEmergencyContact {
  id: number;
  supporterId: number;
  name: string;
  relationship: string;
  phone: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  supporter: Supporter;
}

export interface OperatorSupporter {
  id: number;
  operatorId: number;
  supporterId: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  operator: Operator;
  supporter: Supporter;
}