import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import CustomInput from "./CustomInput";
import { CustomButton, CustomSelect } from ".";
import { formatPriceEurCurrency } from "../utils/formatPrice";
import { VatAmountFromNet } from "../utils/calculateVatAmount";
import { useState } from "react";

interface CalculateAssistanceCostProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmountWithVat: number;
  totalAmountWitouthVat: number;
  setTotalAmountWithoutVat: React.Dispatch<React.SetStateAction<number>>;
  setTotalAmountWithVat: React.Dispatch<React.SetStateAction<number>>;
  setFieldValue: (field: string, value: number) => void;
}

interface calculateCostFormInitialValues {
  nome_compagnia: string;
  costo_fisso_intervento: string;
  km_oltre_forfait: string;
  tipologia_intervento: string;
  costo_km_oltre_forfait: string;
}

const CalculateAssistanceCost: React.FC<CalculateAssistanceCostProps> = ({
  isOpen,
  onClose,
  totalAmountWithVat,
  setTotalAmountWithVat,
  setFieldValue,
  totalAmountWitouthVat,
  setTotalAmountWithoutVat,
}) => {
  const [isKmOverForfait, setIsKmOverForfait] = useState<boolean>(false);

  const tipologia_intervento = [
    { id: 1, tipo_intervento: "traino" },
    { id: 2, tipo_intervento: "trasporto" },
  ];

  const calculateCostFormInitialValues: calculateCostFormInitialValues = {
    nome_compagnia: "",
    costo_fisso_intervento: "",
    tipologia_intervento: "",
    km_oltre_forfait: "",
    costo_km_oltre_forfait: "",
  };

  const calculateCostByCompany = (formValues: calculateCostFormInitialValues) => {
    const { costo_fisso_intervento, km_oltre_forfait, costo_km_oltre_forfait } = formValues;

    const newFixedCost = parseInt(costo_fisso_intervento);
    const newExtraKm = parseFloat(km_oltre_forfait);
    const newExtraKmCost = parseFloat(costo_km_oltre_forfait);

    let total = 0;

    if (newExtraKm > 0 && newExtraKmCost) {
      let totalKmCost = newExtraKm * newExtraKmCost;
      total = newFixedCost + totalKmCost;
    } else {
      total = newFixedCost;
    }

    const vatPrice = VatAmountFromNet(total);
    setTotalAmountWithoutVat(total);
    setTotalAmountWithVat(Math.round(vatPrice * 100) / 100);
  };

  const manageSubmit = (filedToUpdate: string, totalAmount: number) => {
    setFieldValue(filedToUpdate, totalAmount);
    setTotalAmountWithVat(0);
    setIsKmOverForfait(false);
    onClose();
  };

  const handleCostPerKmOverForfait = () => {
    setIsKmOverForfait(!isKmOverForfait);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Calcola importo Intervento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik initialValues={calculateCostFormInitialValues} onSubmit={() => manageSubmit("importo_intervento", totalAmountWithVat)}>
            {(formikProps) => (
              <Form className="flex flex-col gap-3">
                <CustomSelect
                  options={tipologia_intervento}
                  placeholder="Seleziona una tipo intervento"
                  formLabel="Tipo di intervento"
                  name="tipologia_intervento"
                  getOptionLabel={(option) => option.tipo_intervento}
                  getOptionValue={(option) => option.id}
                />
                {formikProps.values.tipologia_intervento === "traino" ? (
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <CustomInput name="costo_fisso_intervento" placeholder="Inserisci fisso intervento" formLabel="Fisso intervento (senza iva)" type="text" />
                    <CustomButton type="button" buttonText="Km oltre il forfait?" buttonColor="green" onClick={() => handleCostPerKmOverForfait()} />
                  </div>
                ) : (
                  ""
                )}
                {isKmOverForfait && (
                  <div className="grid grid-cols-2 gap-2">
                    <CustomInput name="km_oltre_forfait" placeholder="Km totali" formLabel="Km Totali oltre forfait" type="text" />
                    <CustomInput name="costo_km_oltre_forfait" placeholder="Inserisici costo al km" formLabel="Costo al km senza iva" type="text" />
                  </div>
                )}
                <CustomButton
                  buttonText="Calcola importo"
                  type="button"
                  buttonColor="green"
                  isDisabled={false}
                  onClick={() => calculateCostByCompany(formikProps.values)}
                />
                <div className="font-bold text-lg">
                  <p>Importo senza iva: {formatPriceEurCurrency(totalAmountWitouthVat)}</p>
                  <p>Importo con iva: {formatPriceEurCurrency(totalAmountWithVat)}</p>
                </div>
                <CustomButton
                  buttonText="Usa importo"
                  type="button"
                  buttonColor="blue"
                  isDisabled={false}
                  onClick={() => manageSubmit("importo_intervento", totalAmountWithVat)}
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
