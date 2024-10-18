import { Formik, Form, FormikState } from "formik";
import CustomInput from "./CustomInput";
import {
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useCompanies } from "../context/CompanyContext";
import assistanceInputValidationSchema from "../validationSchema/assistanceFormValidationSchema";
import { CustomButton } from ".";
import { useCustomToast } from "../useCustomToast";

interface AssistanceInputForm {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: string;
  nome_compagnia: string;
}

interface HandleSubmitParams {
  values: AssistanceInputForm;
  resetForm: (nextState?: Partial<FormikState<AssistanceInputForm>>) => void;
}

const AssistanceInputForm = () => {
  const initialAssistanceInputValues: AssistanceInputForm = {
    targa: "",
    data_intervento: "",
    numero_dossier: "",
    esito_intervento: false,
    importo_intervento: "",
    nome_compagnia: "",
  };

  const { companiesList } = useCompanies();
  const showToast = useCustomToast();

  const onHandleSubmit = async ({ values, resetForm }: HandleSubmitParams) => {
    const {
      targa,
      data_intervento,
      esito_intervento,
      numero_dossier,
      importo_intervento,
      nome_compagnia,
    } = values;

    const importoNumber = parseFloat(importo_intervento.toString());

    try {
      await addDoc(collection(db, "lista_interventi"), {
        targa,
        data_intervento,
        esito_intervento,
        numero_dossier,
        importo_intervento: importoNumber,
        nome_compagnia,
      });
      showToast({
        description: "Dati salvati con successo.",
        status: "success",
        isClosable: true,
        colorScheme: "green",
      });

      resetForm({
        values: {
          targa: "",
          importo_intervento: "",
          data_intervento: "",
          numero_dossier: "",
          nome_compagnia: "",
          esito_intervento: false,
        },
      });
    } catch (error) {
      showToast({
        description: "Non è stato possibile salvare i dati, riprova.",
        status: "error",
        isClosable: true,
        colorScheme: "red",
      });
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialAssistanceInputValues}
        validationSchema={assistanceInputValidationSchema}
        onSubmit={(values, { resetForm }) =>
          onHandleSubmit({ values, resetForm })
        }
      >
        {(props) => (
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
                  props.errors.nome_compagnia && props.touched.nome_compagnia
                )}
              >
                <FormLabel htmlFor="accettato" fontWeight="bold">
                  Lista società
                </FormLabel>
                <Select
                  name="nome_compagnia"
                  placeholder="Seleziona una società"
                  onChange={props.handleChange}
                  value={props.values.nome_compagnia}
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
                  {props.errors.nome_compagnia}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="accettato" fontWeight="bold">
                  Accettato
                </FormLabel>
                <Checkbox
                  name="esito_intervento"
                  onChange={props.handleChange}
                  isChecked={
                    props.values.esito_intervento === false ? false : true
                  }
                />
              </FormControl>
            </div>
            <div className="mt-5 text-center">
              <CustomButton
                buttonText="Invia i dati"
                buttonColor="blue"
                isDisabled={!props.isValid}
                type="submit"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AssistanceInputForm;
