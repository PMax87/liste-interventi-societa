import { Formik, Form } from "formik";
import CustomInput from "./CustomInput";
import {
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import assistanceInputValidationSchema from "../validationSchema/assistanceFormValidationSchema";
import { CustomButton } from ".";
import { useEffect } from "react";
import { useData } from "../context/DataContext";
import { useManageAssistancesCompaniesContext } from "../context/ManageAssistancesCompaniesContext";

interface AssistanceInputForm {
  targa: string;
  data_intervento: string;
  numero_dossier: string;
  esito_intervento: boolean;
  importo_intervento: string;
  nome_compagnia: string;
}

const AssistanceInputForm = () => {
  const { assistanceDataForModify, isEditing } =
    useManageAssistancesCompaniesContext();

  let initialAssistanceInputValues: AssistanceInputForm = {
    targa: "",
    data_intervento: "",
    numero_dossier: "",
    esito_intervento: false,
    importo_intervento: "",
    nome_compagnia: "",
  };

  if (isEditing && assistanceDataForModify) {
    initialAssistanceInputValues = {
      targa: assistanceDataForModify.targa,
      data_intervento: assistanceDataForModify.data_intervento,
      numero_dossier: assistanceDataForModify.numero_dossier,
      esito_intervento: assistanceDataForModify.esito_intervento,
      importo_intervento: assistanceDataForModify.importo_intervento,
      nome_compagnia: assistanceDataForModify.nome_compagnia,
    };
  }

  const { companiesList, getCompaniesList } = useData();
  const { addAssistance } = useManageAssistancesCompaniesContext();

  useEffect(() => {
    getCompaniesList();
  }, []);

  return (
    <div>
      <Formik
        initialValues={initialAssistanceInputValues}
        validationSchema={assistanceInputValidationSchema}
        enableReinitialize
        onSubmit={(assistanceDatas, { resetForm }) =>
          addAssistance({ assistanceDatas, resetForm })
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
                buttonText={isEditing ? "Modifica i dati" : "Invia i dati"}
                buttonColor={isEditing ? "green" : "blue"}
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
