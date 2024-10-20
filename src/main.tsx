import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext.tsx";
import { DataProvider } from "./context/DataContext.tsx";
import { ManageAssistancesCompaniesProvider } from "./context/ManageAssistancesCompaniesContext.tsx";
import { FilterProvider } from "./context/FilterContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <DataProvider>
          <ManageAssistancesCompaniesProvider>
            <FilterProvider>
              <App />
            </FilterProvider>
          </ManageAssistancesCompaniesProvider>
        </DataProvider>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
