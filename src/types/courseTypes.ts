export interface Courses {
  _id: string;
  name: string;
  lecturerId: string;
  lecturerName: string;
  students: string[];
  homeworks?: string[];
}
