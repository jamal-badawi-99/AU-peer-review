export interface Users {
  _id: string;
  fullName: string;
  courses?: string[];
  number: string;
  email: string;
  userType: UserTypeName;
}

export type UserTypeName = "admin" | "lecturer" | "student";
