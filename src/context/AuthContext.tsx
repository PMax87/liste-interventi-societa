import { createContext, useState, useContext, ReactNode } from "react";

// Definisci il tipo per il contesto
interface AuthContextType {
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthUser {
  userEmail: string | null;
  userName: string | null;
}

// Crea il contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider che gestisce lo stato di autenticazione
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isAuthenticated,
        isLoadingAuth,
        setAuthUser,
        setIsAuthenticated,
        setIsLoadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizzato per usare il contesto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth deve essere utilizzato all'interno di un AuthProvider"
    );
  }
  return context;
};
