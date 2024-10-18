import { createContext, useState, useContext, ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface CompaniesList {
  id: string;
  nome_compagnia: string;
}

interface CompaniesContextType {
  isLoadingCompanies: boolean;
  isErrorLoadingCompanies: boolean;
  setCompaniesList: React.Dispatch<
    React.SetStateAction<CompaniesList[] | undefined>
  >;
  companiesList: CompaniesList[] | undefined;
  getCompaniesList: () => Promise<void>;
  setIsLoadingCompanies: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(
  undefined
);

export const ComapniesProvider = ({ children }: { children: ReactNode }) => {
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);
  const [companiesList, setCompaniesList] = useState<
    CompaniesList[] | undefined
  >();

  const getCompaniesList = async () => {
    const querySnaphsot = await getDocs(collection(db, "nomi_societa"));
    try {
      setIsLoadingCompanies(true);
      const companiesListArray: CompaniesList[] = querySnaphsot.docs.map(
        (assistanceData) =>
          ({
            id: assistanceData.id,
            ...assistanceData.data(),
          } as CompaniesList)
      );
      setCompaniesList(companiesListArray);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  return (
    <CompaniesContext.Provider
      value={{
        setIsLoadingCompanies,
        isLoadingCompanies,
        getCompaniesList,
        companiesList,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  );
};

export const useCompanies = () => {
  const context = useContext(CompaniesContext);
  if (context === undefined) {
    throw new Error(
      "useAuth deve essere utilizzato all'interno di un AuthProvider"
    );
  }
  return context;
};
