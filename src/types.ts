export interface Attendee {
  id: string;
  name: string;
  gender: string; // 'ប្រុស' | 'ស្រី'
  role: string;
  organization: string;
  phone: string;
  signatureType: 'text' | 'image';
  signatureData: string;
  remarks: string;
}

export interface MeetingProcess {
  text: string;
  images: string[];
}

export interface ActionItem {
  id: string;
  task: string;
  responsiblePerson: string;
  deadline: string;
  expectedOutput: string;
  status?: string; // 'កំពុងអនុវត្ត' | 'រួចរាល់' | 'គ្រោងទុក'
}

export interface ReferenceDocument {
  id: string;
  title: string;
  fileType: 'image' | 'pdf' | 'doc' | 'other';
  fileData?: string; // base64 or object URL
  fileName?: string;
  fileSize?: string;
  note?: string;
}

export interface ActionTableHeaders {
  title?: string;
  col1?: string;
  col2?: string;
  col3?: string;
  col4?: string;
  col5?: string;
  col6?: string;
}

export interface MeetingReport {
  meetingId: string;
  district: string;
  schoolName: string;
  topic: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:00" or "8:00 AM"
  location: string;
  leaderName: string;
  leaderRole: string;
  recorderName: string;
  recorderRole: string;
  introText: string;
  participantsText: string;
  agendas: string[];
  processes: MeetingProcess[];
  actionTableTitle?: string;
  actionTableHeaders?: ActionTableHeaders;
  actionItems?: ActionItem[];
  referenceDocuments?: ReferenceDocument[];
  executiveSummary: string;
  conclusionText: string;
  checkerName: string;
  preparerName: string;
  attendanceDateLocation: string;
  attendees: Attendee[];
  updatedAt?: string;
}

export interface MeetingTemplateMeta {
  id: string;
  meetingNumber: number;
  label: string;
  title: string;
  shortDescription: string;
  quarter: string;
  recommendedMonth: string;
}
