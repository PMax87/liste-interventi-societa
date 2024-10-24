import { Form, FormikProps } from "formik";
import { AssistanceInputsForm } from "../models/AssistanceInputsForm";
import CustomInput from "./CustomInput";
import { FormControl, FormLabel, Checkbox, useDisclosure } from "@chakra-ui/react";
import CustomButton from "./CustomButton";
import { useData } from "../context/DataContext";
import { useManageAssistancesCompaniesContext } from "../context/ManageAssistancesCompaniesContext";
import CalculateAssistanceCost from "./CalculateAssistanceCost";
import { useState } from "react";
import { CustomSelect } from ".";

interface AssistanceFormLogicProps {
  formikProps: FormikProps<AssistanceInputsForm>;
}

const AssistanceFormLogic: React.FC<AssistanceFormLogicProps> = ({ formikProps }) => {
  const { companiesList } = useData();
  const { isEditing } = useManageAssistancesCompaniesContext();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [totalAmountWithVat, setTotalAmountWithVat] = useState<number>(0);
  const [totalAmountWitouthVat, setTotalAmountWithoutVat] = useState<number>(0);

  return (
    <Form>
      <div className="grid grid-cols-3 gap-5 content-center">
        <CustomInput type="date" placeholder="Data Intervento" formLabel="Data Intervento" name="data_intervento" />
        <CustomInput placeholder="inserisci la targa" formLabel="Targa Veicolo" type="text" name="targa" />

        <CustomInput placeholder="Inserisci numero dossier" formLabel="Numero Dossier" type="text" name="numero_dossier" />
      </div>
      <div className="grid grid-cols-3 gap-5 content-center mt-3">
        <div>
          <CustomInput placeholder="Inserisci importo intervento" formLabel="Importo Intervento" type="text" name="importo_intervento" />
          <p onClick={onOpen} className="text-red-500 font-semibold text-sm mt-1 inline cursor-pointer">
            Calcola importo
          </p>
          <CalculateAssistanceCost
            isOpen={isOpen}
            onClose={onClose}
            totalAmountWithVat={totalAmountWithVat}
            setTotalAmountWithVat={setTotalAmountWithVat}
            setFieldValue={formikProps.setFieldValue}
            setTotalAmountWithoutVat={setTotalAmountWithoutVat}
            totalAmountWitouthVat={totalAmountWitouthVat}
          />
        </div>
        <CustomSelect
          name="nome_compagnia"
          formLabel="Lista società"
          placeholder="Seleziona una società"
          options={companiesList}
          getOptionLabel={(option) => option.nome_compagnia}
          getOptionValue={(option) => option.id}
        />
        <FormControl>
          <FormLabel htmlFor="accettato" fontWeight="bold">
            Accettato
          </FormLabel>
          <Checkbox name="esito_intervento" onChange={formikProps.handleChange} isChecked={formikProps.values.esito_intervento === false ? false : true} />
        </FormControl>
      </div>
      <div className="mt-5 text-center">
        <CustomButton
          buttonText={isEditing ? "Modifica i dati" : "Invia i dati"}
          buttonColor={isEditing ? "green" : "blue"}
          isDisabled={!formikProps.isValid}
          type="submit"
        />
      </div>
    </Form>
  );
};

export default AssistanceFormLogic;
