export interface Assignments {
  _id: string;
  title: string;
  description: string;
  course: string;
  deadline: Date;
  files?: string[];
  submissions?: string[];
}
