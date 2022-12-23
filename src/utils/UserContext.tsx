// src/CurrentUserContext.js
import React, { useEffect } from "react";
import { auth, db } from "../firebase";
import { Users } from "../types/userTypes";

export const UserContext = React.createContext({});

export const UserContextProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = React.useState<Users | null>(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .onSnapshot((doc) => {
            const data = { ...doc.data(), _id: doc.id } as Users;
            setCurrentUser(data);
          });
      } else {
        setCurrentUser(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <UserContext.Provider value={currentUser!}>{children}</UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext) as Users;
