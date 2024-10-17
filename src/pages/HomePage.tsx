import { Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const HomePage = () => {
  const { authUser } = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div>
      <p>{authUser?.userEmail}</p>
      <p>{authUser?.userName}</p>
      <Button onClick={handleLogout}>Esci</Button>
    </div>
  );
};

export default HomePage;
