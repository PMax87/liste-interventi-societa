import { Form, FormikProps } from "formik";
import { AssistanceInputsForm } from "../models/AssistanceInputsForm";
import CustomInput from "./CustomInput";
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  Checkbox,
} from "@chakra-ui/react";
import CustomButton from "./CustomButton";
import { useData } from "../context/DataContext";
import { useManageAssistancesCompaniesContext } from "../context/ManageAssistancesCompaniesContext";

interface AssistanceFormLogicProps {
  formikProps: FormikProps<AssistanceInputsForm>;
}

const AssistanceFormLogic: React.FC<AssistanceFormLogicProps> = ({
  formikProps,
}) => {
  const { companiesList } = useData();
  const { isEditing } = useManageAssistancesCompaniesContext();

  return (
    <Form>
      <div className="grid grid-cols-3 gap-5 content-center">
        <CustomInput
          type="date"
          placeholder="Data Intervento"
          formLabel="Data Intervento"
          name="data_intervento"
        />
        <CustomInput
          placeholder="inserisci la targa"
          formLabel="Targa Veicolo"
          type="text"
          name="targa"
        />

        <CustomInput
          placeholder="Inserisci numero dossier"
          formLabel="Numero Dossier"
          type="text"
          name="numero_dossier"
        />
      </div>
      <div className="grid grid-cols-3 gap-5 content-center mt-3">
        <CustomInput
          placeholder="Inserisci importo intervento"
          formLabel="Importo Intervento"
          type="text"
          name="importo_intervento"
        />
        <FormControl
          isInvalid={Boolean(
            formikProps.errors.nome_compagnia &&
              formikProps.touched.nome_compagnia
          )}
        >
          <FormLabel htmlFor="accettato" fontWeight="bold">
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
                  <option
                    value={companyName.nome_compagnia}
                    className="capitalize"
                    key={companyName.id}
                  >
                    {companyName.nome_compagnia}
                  </option>
                );
              })}
          </Select>
          <FormErrorMessage>
            {formikProps.errors.nome_compagnia}
          </FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="accettato" fontWeight="bold">
            Accettato
          </FormLabel>
          <Checkbox
            name="esito_intervento"
            onChange={formikProps.handleChange}
            isChecked={
              formikProps.values.esito_intervento === false ? false : true
            }
          />
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
