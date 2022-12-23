export interface Submissions {
  _id: string;
  student: string;
  homework: string;
  files?: string[];
  grade?: number;
  comment?: string;
  gradedBy?: string[];
  gradedOthers?: string[];
}
