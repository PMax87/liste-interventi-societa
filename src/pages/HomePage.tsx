import { Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import AssistancesList from "../components/AssistancesList";
import { AssistanceInputForm } from "../components";
import TotalAssistancesRow from "../components/TotalAssistancesRow";

const HomePage = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <div className="p-8 sm:ml-64">
      <AssistanceInputForm />
      <TotalAssistancesRow />
      <AssistancesList />
    </div>
  );
};

export default HomePage;
