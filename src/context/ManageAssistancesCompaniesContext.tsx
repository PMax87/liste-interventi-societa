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
import { AssistanceInputsForm } from "../models/AssistanceInputsForm";

export interface Company {
  id: string;
  name: string;
}

interface HandleSubmitParams {
  assistanceDatas: AssistanceInputsForm;
  resetForm: (nextState?: Partial<FormikState<AssistanceInputsForm>>) => void;
}

// Definisco il tipo delle azioni possibili sul contesto
interface ManageAssistancesCompaniesContextType {
  // Assistenze (interventi)
  handleAssistance: ({
    assistanceDatas,
    resetForm,
  }: HandleSubmitParams) => void;
  deleteAssistance: (id: string) => void;
  getAssistanceById: (id: string) => void;
  isEditing: boolean;
  assistanceDataForModify: AssistanceInputsForm | undefined;
  // Aziende
  //   companies: Company[];
  //   addCompany: (company: Company) => void;
  //   updateCompany: (updatedCompany: Company) => void;
  //   deleteCompany: (id: string) => void;
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
    AssistanceInputsForm | undefined
  >();

  const { getAssistancesList } = useData();
  const showToast = useCustomToast();

  const handleAssistance = async ({
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

    let importoNumber;

    // Converti `importo_intervento` a stringa prima di usare `includes()`
    const importoStr = importo_intervento.toString();

    if (importoStr.includes(",")) {
      const formattedImport = importoStr.replace(",", ".");
      importoNumber = parseFloat(formattedImport);
    } else {
      importoNumber = parseFloat(importoStr);
    }

    if (isEditing) {
      await updateExistingAssistance({
        targa,
        data_intervento,
        esito_intervento,
        numero_dossier,
        importo_intervento: importoNumber,
        nome_compagnia,
      });
    } else {
      await addNewAssistance({
        targa,
        data_intervento,
        esito_intervento,
        numero_dossier,
        importo_intervento: importoNumber,
        nome_compagnia,
      });
    }

    getAssistancesList();
    resetForm();
  };

  const addNewAssistance = async ({
    targa,
    data_intervento,
    esito_intervento,
    numero_dossier,
    importo_intervento,
    nome_compagnia,
  }: AssistanceInputsForm) => {
    try {
      await addDoc(collection(db, "lista_interventi"), {
        targa,
        data_intervento,
        esito_intervento,
        numero_dossier,
        importo_intervento,
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
  };

  const updateExistingAssistance = async ({
    targa,
    data_intervento,
    esito_intervento,
    numero_dossier,
    importo_intervento,
    nome_compagnia,
  }: AssistanceInputsForm) => {
    try {
      await getAssistanceById(idForEditing);
      const assistanceRef = doc(db, "lista_interventi", idForEditing);
      await updateDoc(assistanceRef, {
        targa,
        data_intervento,
        esito_intervento,
        numero_dossier,
        importo_intervento,
        nome_compagnia,
      });
      showToast({
        description: "Dati modificati con successo.",
        status: "success",
        isClosable: true,
        colorScheme: "green",
      });
      setIsEditing(false);
    } catch (error) {
      showToast({
        description: "Non è stato possibile salvare i dati, riprova.",
        status: "error",
        isClosable: true,
        colorScheme: "red",
      });
      console.error("Error adding document: ", error);
    }
  };

  const getAssistanceById = async (assistanceId: string) => {
    try {
      setIdForEditing(assistanceId);
      setIsEditing(true);
      const assistanceRef = doc(db, "lista_interventi", assistanceId);
      const assistanceById = await getDoc(assistanceRef);
      setAssistanceDataForModify(assistanceById.data() as AssistanceInputsForm);
    } catch (error) {
      showToast({
        description: "Errore nel recupero dei dati",
        colorScheme: "red",
        isClosable: false,
        status: "error",
      });
      console.error(error);
    }
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
        handleAssistance,
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
