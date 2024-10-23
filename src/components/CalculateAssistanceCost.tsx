import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import CustomInput from "./CustomInput";
import { useData } from "../context/DataContext";
import { CustomSelect } from ".";
import { useState } from "react";

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

const CalculateAssistanceCost: React.FC<CalculateAssistanceCostProps> = ({ isOpen, onClose, totalAmount, setTotalAmount, setFieldValue }) => {
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

  const calculateCostByCompany = (formValues: calculateCostFormInitialValues) => {
    const { nome_compagnia, km_totali, peso_veicolo, tipologia_intervento } = formValues;
    let importoTotale = 0;
    let kmOltre25 = 0;
    if (nome_compagnia === "mapfre") {
      if (km_totali <= 25) {
        importoTotale = 45;
      } else {
        kmOltre25 = km_totali - 25;
        importoTotale = parseFloat((kmOltre25 * 0.82).toFixed(2)) + 45;
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

  const manageSubmit = (campo, valore) => {
    setFieldValue(campo, valore);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Calcola importo Intervento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik initialValues={calculateCostFormInitialValues} onSubmit={() => manageSubmit("importo_intervento", totalAmount)}>
            {(formikProps) => (
              <Form>
                <CustomSelect
                  options={companiesList}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nome_compagnia}
                  placeholder="Seleziona una società"
                  formLabel="Seleziona una società"
                  name="nome_compagnia"
                />
                <CustomSelect
                  options={formikProps.values.nome_compagnia === "mapfre" ? pesi_veicolo_mapfre : pesi_veicolo_hlpy}
                  placeholder="Seleziona un peso veicolo"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.peso_veicolo}
                  formLabel="Peso veicolo"
                  name="peso_veicolo"
                />
                <CustomSelect
                  options={tipologia_intervento}
                  placeholder="Seleziona una tipo intervento"
                  formLabel="Seleziona una tipo intervento"
                  name="tipologia_intervento"
                  getOptionLabel={(option) => option.tipo_intervento}
                  getOptionValue={(option) => option.id}
                />
                <CustomInput name="km_totali" placeholder="Km totali" formLabel="Km Totali" type="text" />
                <Button variant="ghost" type="button" onClick={() => calculateCostByCompany(formikProps.values)}>
                  Calcola
                </Button>
                <p>Importo calcolato: {totalAmount}</p>
                <Button variant="ghost" type="submit">
                  Usa importo
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CalculateAssistanceCost;
