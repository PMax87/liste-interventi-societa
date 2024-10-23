import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import CustomInput from "./CustomInput";
import { useData } from "../context/DataContext";

interface CalculateAssistanceCostProps {
  isOpen: boolean;
  onClose: () => void;
}

interface calculateCostFormInitialValues {
  nome_compagnia: string;
  km_totali: number;
  peso_veicolo: string;
  tipologia_intervento: string;
}

const CalculateAssistanceCost: React.FC<CalculateAssistanceCostProps> = ({ isOpen, onClose }) => {
  const { companiesList } = useData();

  const pesi_veicolo_mapfre = ["Da 0 a 2.5 Ton", "Da 2.6 a 3.5 Ton"];
  const pesi_veicolo_hlpy = ["Da 0 a 2.6 Ton", "Da 2.7 a 3.5 Ton"];
  const tipologia_intervento = ["Traino", "Trasporto"];

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
    console.log(importoTotale);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Calcola importo Intervento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik initialValues={calculateCostFormInitialValues} onSubmit={(formValues) => calculateCostByCompany(formValues)}>
            {(formikProps) => (
              <Form>
                <FormControl isInvalid={Boolean(formikProps.errors.nome_compagnia && formikProps.touched.nome_compagnia)}>
                  <FormLabel htmlFor="lista_Societa" fontWeight="bold">
                    Lista società
                  </FormLabel>
                  <Select
                    name="nome_compagnia"
                    placeholder="Seleziona una società"
                    onChange={formikProps.handleChange}
                    value={formikProps.values.nome_compagnia}
                  >
                    {companiesList &&
                      companiesList.map((companyName) => {
                        return (
                          <option value={companyName.nome_compagnia} className="capitalize" key={companyName.id}>
                            {companyName.nome_compagnia}
                          </option>
                        );
                      })}
                  </Select>
                  <FormErrorMessage>{formikProps.errors.nome_compagnia}</FormErrorMessage>
                </FormControl>
                <Select name="peso_veicolo" placeholder="seleziona un peso" onChange={formikProps.handleChange}>
                  {formikProps.values.nome_compagnia === "mapfre"
                    ? pesi_veicolo_mapfre.map((peso, id) => {
                        return <option key={id}>{peso}</option>;
                      })
                    : pesi_veicolo_hlpy.map((peso, id) => {
                        return <option key={id}>{peso}</option>;
                      })}
                </Select>
                <Select name="tipologia_intervento" placeholder="seleziona un peso" onChange={formikProps.handleChange}>
                  {tipologia_intervento.map((tipoIntervento, id) => {
                    return <option key={id}>{tipoIntervento}</option>;
                  })}
                </Select>
                <CustomInput name="km_totali" placeholder="Km totali" formLabel="Km Totali" type="text" />
                <Button variant="ghost" type="submit">
                  Secondary Action
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" type="submit">
            Secondary Action
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CalculateAssistanceCost;
