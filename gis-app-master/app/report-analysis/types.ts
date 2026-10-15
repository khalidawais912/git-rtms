import type { StaffTracking } from "@/app/staff-tracking/components/StaffTracking";

export type OptionType = { value: string; label: string };

export interface IssuedVsPendingReport {
  officerName: string;
  designation: string;
  profilePicture: string;
  scheduled: number;
  completed: number;
  submitted: number;
  referredBack: number;
  approved: number;
  issued: number;
  cancelled: number;
}

export interface ReportTab {
  reportId: number;
  reportName: string;
}

export interface ReportRun {
  [key: string]: string | number | undefined;
}

export interface SectorItem {
  id: number;
  title: string;
}

export interface StartEndLatLng {
  visit: {
    visitID: number;
    visitStartTime: string;
    startLatLng: {
      latitude: string;
      longitude: string;
      createdAt: string;
    };
    endLatLng: {
      latitude: string;
      longitude: string;
      createdAt: string;
    };
  };
}

export interface StaffTrackingData {
  data: StaffTracking[];
}
