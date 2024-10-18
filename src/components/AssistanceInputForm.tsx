import { Formik, Form, FormikState } from "formik";
import CustomInput from "./CustomInput";
import {
  Checkbox,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  useToast,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useCompanies } from "../context/CompanyContext";
import assistanceInputValidationSchema from "../validationSchema/assistanceFormValidationSchema";
import { CustomButton } from ".";

interface AssistanceInputForm {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: number;
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
    importo_intervento: 0,
    nome_compagnia: "",
  };

  const { companiesList } = useCompanies();
  const toast = useToast();

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
      // Aggiungi il documento a Firestore
      await addDoc(collection(db, "lista_interventi"), {
        targa,
        data_intervento,
        esito_intervento,
        numero_dossier,
        importo_intervento: importoNumber,
        nome_compagnia,
      });
      toast({
        title: "Dati salvati con successo.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      resetForm({
        values: {
          targa: "",
          importo_intervento: 0,
          data_intervento: "",
          numero_dossier: "",
          nome_compagnia: "",
          esito_intervento: false,
        },
      });
    } catch (error) {
      toast({
        title: "Errore durante il salvataggio",
        description: "Non è stato possibile salvare i dati, riprova.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
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
              <FormControl>
                <FormLabel htmlFor="importo" fontWeight="bold">
                  Importo
                </FormLabel>
                <NumberInput
                  name="importo_intervento"
                  value={props.values.importo_intervento || ""}
                >
                  <NumberInputField
                    onChange={props.handleChange}
                    placeholder="Inserisci l'importo"
                  />
                </NumberInput>
              </FormControl>
              <FormControl>
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
