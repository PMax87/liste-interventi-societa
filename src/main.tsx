import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext.tsx";
import { DataProvider } from "./context/DataContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
