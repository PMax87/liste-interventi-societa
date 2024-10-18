import { useEffect, useState } from "react";
import { Divider } from "@chakra-ui/react";
import { useCompanies } from "../context/CompanyContext";

interface AssistancesList {
  id: string;
  accettato: boolean;
  data: string;
  importo: string;
  societa: string;
}

const AssistancesList = () => {
  const { getCompaniesList, companiesList } = useCompanies();

  useEffect(() => {
    getCompaniesList();
  }, []);

  console.log(companiesList);

  return (
    <>
      <div className="grid grid-cols-6 place-items-center mt-8">
        <p className="font-bold uppercase text-lg">Data intervento</p>
        <p className="font-bold uppercase text-lg">Targa veicolo</p>
        <p className="font-bold uppercase text-lg">Numero di dossier</p>
        <p className="font-bold uppercase text-lg">Esisto stato</p>
        <p className="font-bold uppercase text-lg">Importo</p>
        <p className="font-bold uppercase text-lg">Azioni</p>
      </div>
      <Divider className="py-1" />
      {/* {assistancesList?.map((assistance) => {
        return (
          <div className="grid grid-cols-4">
            <h2>{assistance.societa}</h2>
            <h2>{assistance.importo}</h2>
          </div>
        );
      })} */}
    </>
  );
};

export default AssistancesList;
