export type Language = 'kn' | 'en';

export interface NoticeItem {
  id: string;
  titleKn: string;
  titleEn: string;
  category: 'all' | 'exam' | 'gov' | 'scholarship' | 'events' | 'sdmc';
  dateStrKn: string;
  dateStrEn: string;
  day: string;
  monthKn: string;
  monthEn: string;
  summaryKn: string;
  summaryEn: string;
  fullContentKn: string;
  fullContentEn: string;
  refNo: string;
  pdfSize: string;
  isImportant?: boolean;
}

export interface MidDayMealDay {
  dayId: string;
  dayKn: string;
  dayEn: string;
  isToday?: boolean;
  mainMenuKn: string;
  mainMenuEn: string;
  supplementKn: string;
  supplementEn: string;
  calories: string;
  protein: string;
  specialNoteKn: string;
  specialNoteEn: string;
}

export interface WelfareScheme {
  id: string;
  titleKn: string;
  titleEn: string;
  descKn: string;
  descEn: string;
  beneficiariesKn: string;
  beneficiariesEn: string;
  icon: string;
  badgeKn: string;
  badgeEn: string;
  officialLink?: string;
  portalName?: string;
}

export interface ScheduleSlot {
  time: string;
  slotKn: string;
  slotEn: string;
  type: 'prayer' | 'class' | 'break' | 'lunch' | 'activity';
  durationKn: string;
  durationEn: string;
}

export interface SdmcMember {
  id: string;
  nameKn: string;
  nameEn: string;
  designationKn: string;
  designationEn: string;
  roleKn: string;
  roleEn: string;
  wardOrRepresent: string;
}

export interface FacultyMember {
  id: string;
  nameKn: string;
  nameEn: string;
  designationKn: string;
  designationEn: string;
  subjectKn: string;
  subjectEn: string;
  qualification: string;
  expYears: number;
}

export interface GalleryPhoto {
  id: string;
  titleKn: string;
  titleEn: string;
  category: 'campus' | 'academics' | 'sports' | 'cultural';
  image: string;
  captionKn: string;
  captionEn: string;
}

export interface ServiceApplication {
  appNo: string;
  type: string;
  studentName: string;
  fatherName: string;
  grade: string;
  satsNo: string;
  mobile: string;
  details: string;
  appliedDate: string;
  status: 'Received' | 'In Verification' | 'Approved';
}

export interface SubjectGrade {
  code: string;
  subjectKn: string;
  subjectEn: string;
  fa1: number;
  fa2: number;
  sa1: number;
  fa3: number;
  fa4: number;
  sa2: number;
  totalObtained: number;
  totalMax: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  teacherRemarksKn: string;
  teacherRemarksEn: string;
}

export interface MonthlyAttendance {
  monthKn: string;
  monthEn: string;
  workingDays: number;
  presentDays: number;
  percentage: number;
}

export interface StudentProgressRecord {
  satsNo: string;
  regMobile: string;
  dob: string;
  studentNameKn: string;
  studentNameEn: string;
  fatherNameKn: string;
  fatherNameEn: string;
  motherNameKn: string;
  motherNameEn: string;
  grade: string;
  section: string;
  rollNo: string;
  mediumKn: string;
  mediumEn: string;
  isDemoRecord: boolean;
  totalWorkingDays: number;
  totalPresentDays: number;
  overallAttendancePct: number;
  scholarshipStatusKn: string;
  scholarshipStatusEn: string;
  subjects: SubjectGrade[];
  monthlyAttendance: MonthlyAttendance[];
  coCurricular: {
    peSportsKn: string;
    peSportsEn: string;
    artsCraftKn: string;
    artsCraftEn: string;
    scoutsDisciplineKn: string;
    scoutsDisciplineEn: string;
    cleanlinessKn: string;
    cleanlinessEn: string;
  };
  classTeacherRemarksKn: string;
  classTeacherRemarksEn: string;
  headmasterRemarksKn: string;
  headmasterRemarksEn: string;
}

