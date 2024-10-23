import { createContext, useState, useContext, ReactNode } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { AssistanceDatas } from "../models/AssistanceDatas";
import { CompaniesListModel } from "../models/CompaniesModel";
import { format, lastDayOfMonth } from "date-fns";

interface DataContextType {
  // Assistances
  isLoadingAssistances: boolean;
  assistancesList: AssistanceDatas[] | undefined;
  getAssistancesList: () => Promise<void>;
  setAssistancesList: React.Dispatch<React.SetStateAction<AssistanceDatas[] | undefined>>;
  setIsLoadingAssistances: React.Dispatch<React.SetStateAction<boolean>>;

  // Companies
  isLoadingCompanies: boolean;
  companiesList: CompaniesListModel[] | undefined;
  getCompaniesList: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Assistances state
  const [isLoadingAssistances, setIsLoadingAssistances] = useState<boolean>(false);
  const [assistancesList, setAssistancesList] = useState<AssistanceDatas[] | undefined>();

  // Companies state
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);
  const [companiesList, setCompaniesList] = useState<CompaniesListModel[] | undefined>();

  // Filtri gli intervento in base al mese corrente
  const today = new Date();
  const firstDateOfMonth = format(today, "yyyy-MM-01");
  const lastDateOfMonth = format(lastDayOfMonth(today), "yyyy-MM-dd");

  // Fetch assistances list
  const getAssistancesList = async () => {
    setIsLoadingAssistances(true);
    try {
      const getAssistancesOrdered = query(
        collection(db, "lista_interventi"),
        orderBy("data_intervento", "desc"),
        where("data_intervento", ">=", firstDateOfMonth),
        where("data_intervento", "<=", lastDateOfMonth)
      );
      const querySnapshot = await getDocs(getAssistancesOrdered);
      const assistancesArray: AssistanceDatas[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AssistanceDatas)
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
      const companiesArray: CompaniesListModel[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as CompaniesListModel)
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
        setAssistancesList,
        setIsLoadingAssistances,

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
