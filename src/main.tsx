import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ComapniesProvider } from "./context/CompanyContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <ComapniesProvider>
          <App />
        </ComapniesProvider>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
