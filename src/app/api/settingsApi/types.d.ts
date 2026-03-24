/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface GetSettingsResponse {
  _id: string;
  name: string;
  media: string[];
  socials: Socials[];
  createdAt: string;
  updatedAt: string;
  about: string;
  color: string;
  logo: string;
}

export interface GetSettingsRequest {}

export interface Socials {
  _id: string;
  url: string;
}

export interface UpdateSettingsResponse {}
export interface UpdateSettingsRequest {
  name: string;
  logo: string;
  about: string;
  color: string;
  media: string[];
  socials: Socials;
}

export interface GetSettingsDashboardResponse {
  activeLeads: number;
  activeStudents: number;
  paidThisMonth: number;
  leftStudents: number;
}
export interface GetSettingsDashboardRequest {
  branch: string;
}
