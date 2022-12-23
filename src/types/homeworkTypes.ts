export interface Homeworks {
  _id: string;
  title: string;
  description: string;
  course: string;
  deadline: string;
  files?: string[];
  submissions?: string[];
}
