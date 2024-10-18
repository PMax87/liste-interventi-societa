import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ComapniesProvider } from "./context/CompanyContext.tsx";
import { AssistancesProvider } from "./context/ServicesContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <ComapniesProvider>
          <AssistancesProvider>
            <App />
          </AssistancesProvider>
        </ComapniesProvider>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
