import { useEffect } from "react";
import { Center, Divider, IconButton, Spinner } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useData } from "../context/DataContext";
import { formatPriceEurCurrency } from "../utils/formatPrice";
import { useManageAssistancesCompaniesContext } from "../context/ManageAssistancesCompaniesContext";
import { AssistanceDatas } from "../models/AssistanceDatas";

const AssistancesList = () => {
  const { getAssistancesList, assistancesList, isLoadingAssistances } =
    useData();

  const { deleteAssistance, getAssistanceById } =
    useManageAssistancesCompaniesContext();

  useEffect(() => {
    getAssistancesList();
  }, []);

  if (isLoadingAssistances) {
    console.log(isLoadingAssistances);
    return (
      <Center>
        <Center marginTop={"40px"}>
          <Spinner color="red.500" size={"xl"} />
        </Center>
      </Center>
    );
  }

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
        assistancesList.map((assistance: AssistanceDatas, index: number) => {
          return (
            <div
              key={assistance.id}
              className={`grid grid-cols-7 content-center items-center py-2 ${
                index % 2 === 0 ? "bg-slate-200" : "bg-white"
              }`}
            >
              <h2 className="text-center">{assistance.data_intervento}</h2>
              <h2 className="text-center capitalize">
                {assistance.nome_compagnia}
              </h2>
              <h2 className="text-center">{assistance.targa}</h2>
              <h2 className="text-center">{assistance.numero_dossier}</h2>
              <h2 className="text-center">
                {assistance.esito_intervento === true ? "Sì" : "No"}
              </h2>
              <h2 className="text-center">
                {formatPriceEurCurrency(assistance.importo_intervento)}
              </h2>
              <div className="flex justify-center gap-1">
                <IconButton
                  color={"white"}
                  icon={<EditIcon />}
                  aria-label="Modifica intervento"
                  colorScheme={"green"}
                  onClick={() => getAssistanceById(assistance.id)}
                />
                <IconButton
                  color={"white"}
                  icon={<DeleteIcon />}
                  aria-label="Cancella intervento"
                  colorScheme={"red"}
                  onClick={() => deleteAssistance(assistance.id)}
                />
              </div>
            </div>
          );
        })}
    </>
  );
};

export default AssistancesList;
