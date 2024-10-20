import { Divider } from "@chakra-ui/react";
import AssistanceItem from "./AssistanceItem";

const AssistancesList = () => {
  return (
    <>
      <div className="grid grid-cols-7 place-items-center mt-8">
        <p className="font-bold uppercase">Data intervento</p>
        <p className="font-bold uppercase">Società</p>
        <p className="font-bold uppercase">Targa veicolo</p>
        <p className="font-bold uppercase">Numero di dossier</p>
        <p className="font-bold uppercase">Accettato</p>
        <p className="font-bold uppercase">Importo</p>
        <p className="font-bold uppercase">Azioni</p>
      </div>
      <Divider className="py-1" />
      <AssistanceItem />
    </>
  );
};

export default AssistancesList;
