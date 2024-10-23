import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import CustomInput from "./CustomInput";
import { useData } from "../context/DataContext";
import { CustomButton, CustomSelect } from ".";
import { useState } from "react";
import { formatPriceEurCurrency } from "../utils/formatPrice";

interface CalculateAssistanceCostProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  setTotalAmount: React.Dispatch<React.SetStateAction<number>>;
  setFieldValue: (field: string, value: number) => void;
}

interface calculateCostFormInitialValues {
  nome_compagnia: string;
  km_totali: number;
  peso_veicolo: string;
  tipologia_intervento: string;
}

const CalculateAssistanceCost: React.FC<CalculateAssistanceCostProps> = ({
  isOpen,
  onClose,
  totalAmount,
  setTotalAmount,
  setFieldValue,
}) => {
  const { companiesList } = useData();
  const [costoOltre25KmMapfre, setCostoOltre25KmMapfre] = useState(0);

  const pesi_veicolo_mapfre = [
    { id: 1, peso_veicolo: "Da 0 a 2.5 Ton" },
    { id: 2, peso_veicolo: "Da 2.6 a 3.5 Ton" },
  ];
  const pesi_veicolo_hlpy = [
    { id: 1, peso_veicolo: "Da 0 a 2.6 Ton" },
    { id: 2, peso_veicolo: "Da 2.7 a 3.5 Ton" },
  ];
  const tipologia_intervento = [
    { id: 1, tipo_intervento: "traino" },
    { id: 2, tipo_intervento: "trasporto" },
  ];

  const calculateCostFormInitialValues: calculateCostFormInitialValues = {
    nome_compagnia: "",
    km_totali: 0,
    peso_veicolo: "",
    tipologia_intervento: "",
  };

  const calculateCostByCompany = (
    formValues: calculateCostFormInitialValues
  ) => {
    const { nome_compagnia, km_totali, peso_veicolo, tipologia_intervento } =
      formValues;
    let importoTotale: number | string = 0;
    let kmOltre25: number | string = 0;
    if (nome_compagnia === "mapfre") {
      if (km_totali <= 25) {
        importoTotale = 45;
      } else {
        kmOltre25 = km_totali - 25;
        importoTotale = (kmOltre25 * 0.82 + 45).toFixed(2);
        parseFloat(importoTotale);
      }
    }
    if (nome_compagnia === "hlpy") {
      if (km_totali <= 25) {
        importoTotale = 53;
      } else {
        kmOltre25 = km_totali - 25;
        importoTotale = kmOltre25 * 1 + 53;
      }
    }
    setTotalAmount(importoTotale);
  };

  const manageSubmit = (filedToUpdate: string, totalAmount: number) => {
    setFieldValue(filedToUpdate, totalAmount);
    setTotalAmount(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Calcola importo Intervento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={calculateCostFormInitialValues}
            onSubmit={() => manageSubmit("importo_intervento", totalAmount)}
          >
            {(formikProps) => (
              <Form className="flex flex-col gap-3">
                <CustomSelect
                  options={companiesList}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nome_compagnia}
                  placeholder="Seleziona una società"
                  formLabel="Lista società"
                  name="nome_compagnia"
                />
                <CustomSelect
                  options={
                    formikProps.values.nome_compagnia === "mapfre"
                      ? pesi_veicolo_mapfre
                      : pesi_veicolo_hlpy
                  }
                  placeholder="Seleziona un peso veicolo"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.peso_veicolo}
                  formLabel="Peso veicolo"
                  name="peso_veicolo"
                />
                <CustomSelect
                  options={tipologia_intervento}
                  placeholder="Seleziona una tipo intervento"
                  formLabel="Tipo di intervento"
                  name="tipologia_intervento"
                  getOptionLabel={(option) => option.tipo_intervento}
                  getOptionValue={(option) => option.id}
                />
                <CustomInput
                  name="km_totali"
                  placeholder="Km totali"
                  formLabel="Km Totali"
                  type="text"
                />
                <CustomButton
                  buttonText="Calcola importo"
                  type="button"
                  buttonColor="green"
                  isDisabled={false}
                  onClick={() => calculateCostByCompany(formikProps.values)}
                />
                <p>Importo calcolato: {formatPriceEurCurrency(totalAmount)}</p>
                <CustomButton
                  buttonText="Usa importo"
                  type="button"
                  buttonColor="blue"
                  isDisabled={false}
                  onClick={() =>
                    manageSubmit("importo_intervento", totalAmount)
                  }
                />
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CalculateAssistanceCost;
