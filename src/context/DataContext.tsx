import { createContext, useState, useContext, ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface AssistancesList {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: number;
  nome_compagnia: string;
  id: string;
}

interface CompaniesList {
  id: string;
  nome_compagnia: string;
}

interface DataContextType {
  // Assistances
  isLoadingAssistances: boolean;
  assistancesList: AssistancesList[] | undefined;
  getAssistancesList: () => Promise<void>;

  // Companies
  isLoadingCompanies: boolean;
  companiesList: CompaniesList[] | undefined;
  getCompaniesList: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Assistances state
  const [isLoadingAssistances, setIsLoadingAssistances] =
    useState<boolean>(false);
  const [assistancesList, setAssistancesList] = useState<
    AssistancesList[] | undefined
  >();

  // Companies state
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);
  const [companiesList, setCompaniesList] = useState<
    CompaniesList[] | undefined
  >();

  // Fetch assistances list
  const getAssistancesList = async () => {
    setIsLoadingAssistances(true);
    const querySnapshot = await getDocs(collection(db, "lista_interventi"));
    try {
      setIsLoadingAssistances(true);
      const assistancesArray: AssistancesList[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AssistancesList)
      );
      setAssistancesList(assistancesArray);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAssistances(false);
    }
  };

  // Fetch companies list
  const getCompaniesList = async () => {
    const querySnapshot = await getDocs(collection(db, "nomi_societa"));
    try {
      setIsLoadingCompanies(true);
      const companiesArray: CompaniesList[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as CompaniesList)
      );
      setCompaniesList(companiesArray);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        // Assistances
        isLoadingAssistances,
        assistancesList,
        getAssistancesList,

        // Companies
        isLoadingCompanies,
        companiesList,
        getCompaniesList,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
