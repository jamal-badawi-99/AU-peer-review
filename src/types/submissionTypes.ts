export interface Submissions {
  _id: string;
  student: string;
  assignment: string;
  course: string;
  files?: string[];
  note?: string;
  grades: Grades[];
  objection?:{
    status?: "none" | "resolved" | "pending";
    grade?: number;
    comment?: string;
  }
}

interface Grades {
  gradedBy: string;
  grade: number;
  comment?: string;
}
