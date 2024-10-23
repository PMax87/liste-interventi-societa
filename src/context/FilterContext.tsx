import { createContext, useContext, ReactNode, useState } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  QueryConstraint,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useData } from "./DataContext";
import { AssistanceDatas } from "../models/AssistanceDatas";

interface FilterContextType {
  filterData: (filtersFormValues: FilterValues) => void;
  resetAllFilters: (resetForm: () => void) => void;
  totalAcceptedAssistances: number | null;
  totalNonAcceptedAssistances: number | null;
  totalAmount: number | null;
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
  const { setIsLoadingAssistances, setAssistancesList, getAssistancesList } =
    useData();
  const [totalAcceptedAssistances, setTotalAcceptedAssistances] = useState<
    number | null
  >(null);
  const [totalNonAcceptedAssistances, setTotalNonAcceptedAssista] = useState<
    number | null
  >(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const filterData = async (values: FilterValues) => {
    setIsLoadingAssistances(true);
    const { start_date, end_date, nome_compagnia, targa, numero_dossier } =
      values;

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

      const acceptedCount = assistancesArray.filter(
        (item) => item.esito_intervento === true
      ).length;

      const nonAcceptedCount = assistancesArray.filter(
        (item) => item.esito_intervento === false
      ).length;

      const calcTotalAmount = assistancesArray.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.importo_intervento,
        0
      );

      setTotalAcceptedAssistances(acceptedCount);
      setTotalNonAcceptedAssista(nonAcceptedCount);
      setTotalAmount(calcTotalAmount);
    } catch (error) {
      console.error("Error fetching filtered data: ", error);
    } finally {
      setIsLoadingAssistances(false);
    }
  };

  const resetAllFilters = (resetForm: () => void) => {
    resetForm();
    getAssistancesList();
    setTotalAcceptedAssistances(null);
    setTotalNonAcceptedAssista(null);
    setTotalAmount(null);
  };

  return (
    <FilterContext.Provider
      value={{
        filterData,
        resetAllFilters,
        totalAcceptedAssistances,
        totalNonAcceptedAssistances,
        totalAmount,
        setTotalAcceptedAssistances,
        setTotalNonAcceptedAssista,
        setTotalAmount,
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
