import { Spinner, Center, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useData } from "../context/DataContext";
import { useManageAssistancesCompaniesContext } from "../context/ManageAssistancesCompaniesContext";
import { formatPriceEurCurrency } from "../utils/formatPrice";
import { AssistanceDatas } from "../models/AssistanceDatas";
import { formatDate } from "../utils/formatDate";
import { useFilter } from "../context/FilterContext";

const AssistanceItem = () => {
  const { assistancesList, isLoadingAssistances } = useData();
  const { deleteAssistance, getAssistanceById } =
    useManageAssistancesCompaniesContext();

  const {
    setTotalAcceptedAssistances,
    setTotalNonAcceptedAssista,
    setTotalAmount,
  } = useFilter();

  if (isLoadingAssistances) {
    return (
      <Center>
        <Spinner color="red.500" size={"xl"} marginTop={"40px"} />
      </Center>
    );
  }

  const handleModifyAssistance = (assistanceId: string) => {
    getAssistanceById(assistanceId);
    setTotalAcceptedAssistances(null);
    setTotalNonAcceptedAssista(null);
    setTotalAmount(null);
  };

  return (
    <div>
      {assistancesList && assistancesList.length > 0 ? (
        assistancesList.map((assistance: AssistanceDatas, index: number) => (
          <div
            key={assistance.id}
            className={`grid grid-cols-7 content-center items-center py-2 ${
              index % 2 === 0 ? "bg-slate-200" : "bg-white"
            }`}
          >
            <h2 className="text-center">
              {formatDate(assistance.data_intervento)}
            </h2>
            <h2 className="text-center capitalize">
              {assistance.nome_compagnia}
            </h2>
            <h2 className="text-center">{assistance.targa}</h2>
            <h2 className="text-center">{assistance.numero_dossier}</h2>
            <h2 className="text-center">
              {assistance.esito_intervento ? "Sì" : "No"}
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
                onClick={() => handleModifyAssistance(assistance.id)}
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
        ))
      ) : (
        <Center mt="50">
          <p className="font-bold text-3xl text-red-700">
            Nessun intervento disponibile
          </p>
        </Center>
      )}
    </div>
  );
};

export default AssistanceItem;
