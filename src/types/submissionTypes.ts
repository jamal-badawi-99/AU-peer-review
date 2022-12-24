export interface Submissions {
  _id: string;
  student: string;
  assignment: string;
  course: string;
  files?: string[];
  note?: string;
  grades: Grades[];
  objectionStatus?: "none" | "resolved" | "pending";
}

interface Grades {
  gradedBy: string;
  grade: number;
  comment?: string;
}
