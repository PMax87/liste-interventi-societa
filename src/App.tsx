import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useAuth } from "./context/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

function App() {
  const {
    setIsAuthenticated,
    isAuthenticated,
    setAuthUser,
    isLoadingAuth,
    setIsLoadingAuth,
  } = useAuth();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
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
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
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
