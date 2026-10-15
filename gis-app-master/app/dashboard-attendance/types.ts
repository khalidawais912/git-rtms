export interface DashboardAttendance {
  count: {
    totalEmployee: number;
    present: number;
    leave: number;
    visit: number;
    late: number;
    leftEarly: number;
    absent: number;
    others: number;
  };
}

export interface AttendanceList {
  attandanceId: number;
  userId: number;
  employeeName: string;
  employeePicture: string;
  department: string;
  employeeDesignation: string;
  punchInStatus: string;
  punchInTime: string;
  punchOutStatus: string;
  punchOutTime: string;
  date: string;
  isCheckOut: boolean;
}

export interface AttendaceDetail {
  attendanceList: AttendanceList[];
}

export interface StaffRecord {
  userName: string;
  userDesignation: string;
  department: string;
  today: string;
  todayCheckInStatus: string;
  todayCheckInTime: string;
  todayCheckOutStatus: string;
  todayCheckOutTime: string;
  totalPresents: number;
  totalOthers: number;
  totalLeave: number;
  totalVisit: number;
  totalAbsents: number;
  totalLateComers: number;
  totalLeftEarly: number;
  dailyAttandance: AttendanceList[];
}
