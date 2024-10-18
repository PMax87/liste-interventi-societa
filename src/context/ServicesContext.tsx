import { createContext, useState, useContext, ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface AssistancesList {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: string;
  nome_compagnia: string;
  id: string;
}

interface AssistancesContextType {}

const AssistancesContext = createContext<AssistancesContextType | undefined>(
  undefined
);

export const AssistancesProvider = ({ children }: { children: ReactNode }) => {
  const [isLoadingAssistances, setIsLoadingAssistances] =
    useState<boolean>(false);
  const [assistancesList, setAssistancesList] = useState<
    AssistancesList[] | undefined
  >();

  const getAssistancesList = async () => {
    const querySnaphsot = await getDocs(collection(db, "lista_interventi"));
    try {
      setIsLoadingAssistances(true);
      const companiesListArray: AssistancesList[] = querySnaphsot.docs.map(
        (assistanceData) =>
          ({
            id: assistanceData.id,
            ...assistanceData.data(),
          } as AssistancesList)
      );
      setAssistancesList(companiesListArray);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAssistances(false);
    }
  };

  return (
    <AssistancesContext.Provider
      value={{
        getAssistancesList,
        assistancesList,
      }}
    >
      {children}
    </AssistancesContext.Provider>
  );
};

export const useAssistances = () => {
  const context = useContext(AssistancesContext);
  if (context === undefined) {
    throw new Error(
      "useAuth deve essere utilizzato all'interno di un AuthProvider"
    );
  }
  return context;
};
