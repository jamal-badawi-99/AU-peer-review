export interface Submissions {
  _id: string;
  student: string;
  assignment: string;
  course: string;
  files?: string[];
  note?: string;
  grades: Grades[];
  studentsGraded?: string[];
  objectionStatus?: "none" | "resolved" | "pending";
}

interface Grades {
  gradedBy: string;
  grade: number;
  comment?: string;
}
