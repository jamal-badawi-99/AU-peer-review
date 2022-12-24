import { IconType } from "react-icons";
import { BsBook, BsPeople } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdPassword } from "react-icons/md";

export interface MenuTab {
  title: string;
  path: string;
  icon: IconType;
}

export const STUDENT_LAYOUT_ROUTES: MenuTab[] = [
  {
    title: "Courses",
    path: "/student-courses",
    icon: BsBook,
  },
  {
    title: "Change Password",
    path: "/change-password",
    icon: MdPassword,
  },
];
export const LECTURER_LAYOUT_ROUTES: MenuTab[] = [
  {
    title: "Courses",
    path: "/lecturer-courses",
    icon: BsBook,
  },
  {
    title: "Change Password",
    path: "/change-password",
    icon: MdPassword,
  },
];

export const ADMIN_LAYOUT_ROUTES: MenuTab[] = [
  {
    title: "Lecturers",
    path: "/admin-lecturers",
    icon: FaChalkboardTeacher,
  },
  {
    title: "Students",
    path: "/admin-students",
    icon: BsPeople,
  },
  {
    title: "Courses",
    path: "/admin-courses",
    icon: BsBook,
  },
  {
    title: "Change Password",
    path: "/change-password",
    icon: MdPassword,
  },
];
