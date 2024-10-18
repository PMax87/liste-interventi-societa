import { useEffect } from "react";
import { Divider } from "@chakra-ui/react";
import { useAssistances } from "../context/ServicesContext";

interface AssistancesList {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: string;
  nome_compagnia: string;
}

const AssistancesList = () => {
  const { getAssistancesList, assistancesList } = useAssistances();

  useEffect(() => {
    getAssistancesList();
  }, []);

  return (
    <>
      <div className="grid grid-cols-7 place-items-center mt-8">
        <p className="font-bold uppercase text-lg">Data intervento</p>
        <p className="font-bold uppercase text-lg">Società</p>
        <p className="font-bold uppercase text-lg">Targa veicolo</p>
        <p className="font-bold uppercase text-lg">Numero di dossier</p>
        <p className="font-bold uppercase text-lg">Accettato</p>
        <p className="font-bold uppercase text-lg">Importo</p>
        <p className="font-bold uppercase text-lg">Azioni</p>
      </div>
      <Divider className="py-1" />
      {assistancesList &&
        assistancesList.map((assistance: AssistancesList) => {
          return (
            <div className="grid grid-cols-7 items-center">
              <h2>{assistance.data_intervento}</h2>
              <h2>{assistance.nome_compagnia}</h2>
              <h2>{assistance.targa}</h2>
              <h2>{assistance.numero_dossier}</h2>
              <h2>{assistance.esito_intervento === true ? "Sì" : "No"}</h2>
              <h2>{assistance.importo_intervento}</h2>
            </div>
          );
        })}
    </>
  );
};

export default AssistancesList;
