import { createContext, useContext, ReactNode, useState } from "react";
import { collection, getDocs, where, query, QueryConstraint, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useData } from "./DataContext";
import { AssistanceDatas } from "../models/AssistanceDatas";

interface FilterContextType {
  filterData: (filtersFormValues: FilterValues) => void;
  resetAllFilters: (resetForm: () => void) => void;
}

interface FilterValues {
  start_date: string;
  end_date: string;
  nome_compagnia: string;
  esito_intervento: boolean | string;
  numero_dossier: string;
  targa: string;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const { setIsLoadingAssistances, setAssistancesList, getAssistancesList } = useData();

  const filterData = async (values: FilterValues) => {
    setIsLoadingAssistances(true);
    const { start_date, end_date, nome_compagnia, targa, numero_dossier } = values;

    let { esito_intervento } = values;

    const queryConstraints: QueryConstraint[] = [
      where("data_intervento", ">=", start_date),
      where("data_intervento", "<=", end_date),
      orderBy("data_intervento", "desc"),
    ];

    if (nome_compagnia) {
      queryConstraints.push(where("nome_compagnia", "==", nome_compagnia));
    }

    if (esito_intervento && esito_intervento !== "") {
      if (esito_intervento === "si") {
        esito_intervento = true;
      } else if (esito_intervento === "no") {
        esito_intervento = false;
      }
      queryConstraints.push(where("esito_intervento", "==", esito_intervento));
    }

    if (targa) {
      queryConstraints.push(where("targa", "==", targa));
    }

    if (numero_dossier) {
      queryConstraints.push(where("numero_dossier", "==", numero_dossier));
    }

    let q = query(collection(db, "lista_interventi"), ...queryConstraints);

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
  };

  const resetAllFilters = (resetForm: () => void) => {
    resetForm();
    getAssistancesList();
  };

  return (
    <FilterContext.Provider
      value={{
        filterData,
        resetAllFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
