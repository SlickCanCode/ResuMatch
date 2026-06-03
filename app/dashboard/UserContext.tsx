"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  userName: string;
  email: string;
}

interface UserContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used inside UserProvider");
  }

  return context;
}