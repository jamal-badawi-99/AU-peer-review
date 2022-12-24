import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ADMIN_LAYOUT_ROUTES,
  LECTURER_LAYOUT_ROUTES,
  MenuTab,
  STUDENT_LAYOUT_ROUTES,
} from "../components/Layout/menuTabs";
import NavMenu from "../components/Layout/NavMenu";
import Loading from "../components/Loading";
import { useUser } from "./UserContext";

export default function AuthGuard({ children }: any) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const { pathname } = useLocation();
  const userInfo = useUser();
  const [tabs, setTabs] = useState<MenuTab[] | undefined>();
  useEffect(() => {
    if (userInfo?.userType === "admin") {
      setTabs(ADMIN_LAYOUT_ROUTES);
    } else if (userInfo?.userType === "lecturer") {
      setTabs(LECTURER_LAYOUT_ROUTES);
    } else if (userInfo?.userType === "student") {
      setTabs(STUDENT_LAYOUT_ROUTES);
    }
  }, [userInfo]);

  // const checkUserType = useCallback(() => {
  //   const STUDENT_ROUTES = [
  //     ...STUDENT_LAYOUT_ROUTES.map((tab) => {
  //       return tab.path;
  //     }),
  //     "/",
  //   ];
  //   const ADMIN_ROUTES = [
  //     ...ADMIN_LAYOUT_ROUTES.map((tab) => {
  //       return tab.path;
  //     }),
  //     "/",
  //   ];
  //   const LECTURER_ROUTES = [
  //     ...LECTURER_LAYOUT_ROUTES.map((tab) => {
  //       return tab.path;
  //     }),
  //     "/",
  //   ];

  //   const NO_AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

  //   if (user?.userType === "student" && STUDENT_ROUTES.includes(pathname)) {
  //     return false;
  //   } else if (user?.userType === "admin" && ADMIN_ROUTES.includes(pathname)) {
  //     return false;
  //   } else if (
  //     user?.userType === "lecturer" &&
  //     LECTURER_ROUTES.includes(pathname)
  //   ) {
  //     return false;
  //   } else if (NO_AUTH_ROUTES.includes(pathname)) {
  //     return true;
  //   } else {
  //     return true;
  //   }
  // }, [pathname, user?.userType]);

  useEffect(() => {
    const NO_AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        if (NO_AUTH_ROUTES.includes(pathname)) {
          navigate("/");
        }
        if (
          userInfo?.userType === "student" &&
          (pathname.startsWith("/admin") || pathname.startsWith("/lecturer"))
        ) {
          navigate("/");
        }
        if (
          userInfo?.userType === "admin" &&
          (pathname.startsWith("/student") || pathname.startsWith("/lecturer"))
        ) {
          navigate("/");
        }
        if (
          userInfo?.userType === "lecturer" &&
          (pathname.startsWith("/student") || pathname.startsWith("/admin"))
        ) {
          navigate("/");
        }

        setLoading(false);
      } else {
        if (NO_AUTH_ROUTES.includes(pathname)) {
          return;
        }
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate("/login");
        }, 500);
      }
    });
  }, [auth, navigate, pathname, userInfo?.userType]);

  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <Loading />
      </div>
    );
  if (!userInfo) return null;
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <NavMenu tabs={tabs} />
      <div style={{ flex: 7, boxSizing: "border-box" }}>{children}</div>
    </div>
  );
}
