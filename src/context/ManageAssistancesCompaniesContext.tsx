import {
  deleteDoc,
  doc,
  addDoc,
  collection,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { FormikState } from "formik";
import { db } from "../firebase";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useData } from "./DataContext";
import { useCustomToast } from "../useCustomToast";

// Definisco l'interfaccia per un'assistenza (intervento)
export interface AssistanceDatas {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: number;
  nome_compagnia: string;
  id: string;
}

interface AssistanceInputForm {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: string;
  nome_compagnia: string;
}

// Definisco l'interfaccia per un'azienda
export interface Company {
  id: string;
  name: string;
}

interface HandleSubmitParams {
  assistanceDatas: AssistanceInputForm;
  resetForm: (nextState?: Partial<FormikState<AssistanceInputForm>>) => void;
}

// Definisco il tipo delle azioni possibili sul contesto
interface ManageAssistancesCompaniesContextType {
  // Assistenze (interventi)
  addAssistance: ({ assistanceDatas, resetForm }: HandleSubmitParams) => void;
  deleteAssistance: (id: string) => void;
  getAssistanceById: (id: string) => void;
  idForEditing: string;
  isEditing: boolean;
  setIdForEditing: () => void;
  updateAssistance: ({
    assistanceDatas,
    resetForm,
  }: HandleSubmitParams) => void;
  assistanceDataForModify: AssistanceInputForm | undefined;
  // Aziende
  companies: Company[];
  addCompany: (company: Company) => void;
  updateCompany: (updatedCompany: Company) => void;
  deleteCompany: (id: string) => void;
}

// Creo un contesto vuoto
const ManageAssistancesCompaniesContext = createContext<
  ManageAssistancesCompaniesContextType | undefined
>(undefined);

// Provider per il contesto
export const ManageAssistancesCompaniesProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [idForEditing, setIdForEditing] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [assistanceDataForModify, setAssistanceDataForModify] = useState<
    AssistanceInputForm | undefined
  >();

  const { getAssistancesList } = useData();
  const showToast = useCustomToast();

  // CRUD per assistenze (interventi)
  const addAssistance = async ({
    assistanceDatas,
    resetForm,
  }: HandleSubmitParams) => {
    const {
      targa,
      data_intervento,
      esito_intervento,
      numero_dossier,
      importo_intervento,
      nome_compagnia,
    } = assistanceDatas;

    const formattedImport = importo_intervento.replace(",", ".");
    const importoNumber = parseFloat(formattedImport.toString());

    if (isEditing) {
      await getAssistanceById(idForEditing);
      console.log(idForEditing);
      const assistanceRef = doc(db, "lista_interventi", idForEditing);
      await updateDoc(assistanceRef, {
        targa,
        data_intervento,
        esito_intervento,
        numero_dossier,
        importo_intervento: importoNumber,
        nome_compagnia,
      });
      getAssistancesList();
      setIsEditing(false);
    } else {
      try {
        await addDoc(collection(db, "lista_interventi"), {
          targa,
          data_intervento,
          esito_intervento,
          numero_dossier,
          importo_intervento: importoNumber,
          nome_compagnia,
        });
        showToast({
          description: "Dati salvati con successo.",
          status: "success",
          isClosable: true,
          colorScheme: "green",
        });
      } catch (error) {
        showToast({
          description: "Non è stato possibile salvare i dati, riprova.",
          status: "error",
          isClosable: true,
          colorScheme: "red",
        });
        console.error("Error adding document: ", error);
      }
    }

    getAssistancesList();

    resetForm({
      values: {
        targa: "",
        importo_intervento: "",
        data_intervento: "",
        numero_dossier: "",
        nome_compagnia: "",
        esito_intervento: false,
      },
    });
  };

  const getAssistanceById = async (assistanceId: string) => {
    setIdForEditing(assistanceId);
    setIsEditing(true);
    const assistanceRef = doc(db, "lista_interventi", assistanceId);
    const assistanceById = await getDoc(assistanceRef);
    setAssistanceDataForModify(assistanceById.data() as AssistanceInputForm);
  };

  const deleteAssistance = async (id: string) => {
    try {
      await deleteDoc(doc(db, "lista_interventi", id));
      showToast({
        description: "Intervento cancellato con successo",
        colorScheme: "green",
        isClosable: true,
        status: "success",
      });
      getAssistancesList();
    } catch (error) {
      showToast({
        description: "Intervento non cancellato",
        colorScheme: "red",
        isClosable: true,
        status: "error",
      });
      console.error(error);
    }
  };

  // CRUD per aziende

  return (
    <ManageAssistancesCompaniesContext.Provider
      value={{
        addAssistance,
        deleteAssistance,
        getAssistanceById,
        assistanceDataForModify,
        isEditing,
      }}
    >
      {children}
    </ManageAssistancesCompaniesContext.Provider>
  );
};

// Hook personalizzato per usare il contesto
export const useManageAssistancesCompaniesContext = () => {
  const context = useContext(ManageAssistancesCompaniesContext);
  if (!context) {
    throw new Error(
      "useManageAssistanceCompaniesContext must be used within a ManageAssistanceCompaniesProvider"
    );
  }
  return context;
};
