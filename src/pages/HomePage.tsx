import { Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
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
