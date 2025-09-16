import { createContext, useState, ReactNode, useEffect } from "react";
import { User } from "../api/serviceCategoryApi";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  // Fonction pour mettre à jour user et localStorage en même temps
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Optionnel : synchroniser avec localStorage si elle change ailleurs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user") {
        setUserState(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
