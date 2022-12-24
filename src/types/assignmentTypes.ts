export interface Assignments {
  _id: string;
  title: string;
  description: string;
  course: string;
  deadline: Date;
  amount: number;
  files?: string[];
  submissions?: string[];
  passingGrade: number;
  maxGrade: number;
  whoGrades?: { [key: string]: string[] };
  whoGraded?: { [key: string]: string[] };
}
