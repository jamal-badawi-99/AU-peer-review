export interface Courses {
  _id: string;
  title: string;
  lecturerId: string;
  lecturerName: string;
  students: string[];
  homeworks?: string[];
}
