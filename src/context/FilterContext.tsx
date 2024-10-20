import { createContext, useContext, ReactNode } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase";
import { useData } from "./DataContext";
import { AssistanceDatas } from "../models/AssistanceDatas";

interface FilterContextType {
  filterByDataRange: () => void;
}

interface FilterValues {
  start_date: string;
  end_date: string;
  nome_compagnia?: string;
  esito_intervento?: string;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const { setIsLoadingAssistances, setAssistancesList, assistancesList } =
    useData();

  const filterByDataRange = async (values) => {
    setIsLoadingAssistances(true);
    const { start_date, end_date, nome_compagnia, esito_intervento, targa } =
      values;

    const queryConstraints: QueryConstraint[] = [
      where("data_intervento", ">=", "01/08/2024"),
      where("data_intervento", "<=", "31/10/2024"),
    ];

    if (nome_compagnia) {
      queryConstraints.push(where("nome_compagnia", "==", nome_compagnia));
    }

    if (esito_intervento) {
      queryConstraints.push(where("esito_intervento", "==", esito_intervento));
    }

    const q = query(collection(db, "lista_interventi"), ...queryConstraints);

    try {
      const querySnapshot = await getDocs(q);
      const assistancesArray = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AssistanceDatas)
      );
      setAssistancesList(assistancesArray);
    } catch (error) {
      console.error("Error fetching filtered data: ", error);
    } finally {
      setIsLoadingAssistances(false);
    }

    if (targa) {
      console.log("dentro");
      const newAssistanceList = assistancesList.filter((intervento) =>
        intervento.targa.includes(targa)
      );
      setAssistancesList(newAssistanceList);
    }
  };

  return (
    <FilterContext.Provider
      value={{
        filterByDataRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a DataProvider");
  }
  return context;
};
