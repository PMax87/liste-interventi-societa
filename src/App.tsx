import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useAuth } from "./context/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";

function App() {
  const {
    isAuthenticated,
    isLoadingAuth,
    setAuthUser,
    setIsAuthenticated,
    setIsLoadingAuth,
  } = useAuth();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setAuthUser({
          userEmail: authUser.email,
          userName: authUser.displayName,
        });
        setIsAuthenticated(true);
      } else {
        setAuthUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });
  }, []);

  return (
    <Router>
      {isLoadingAuth ? (
        <Center height="100vh">
          <Spinner color="red.500" size={"xl"} />
        </Center>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Sidebar />
                <HomePage />
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
