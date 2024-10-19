import { Formik } from "formik";
import assistanceInputValidationSchema from "../validationSchema/assistanceFormValidationSchema";
import { AssistanceFormLogic } from ".";
import { useEffect } from "react";
import { useData } from "../context/DataContext";
import { useManageAssistancesCompaniesContext } from "../context/ManageAssistancesCompaniesContext";
import { AssistanceInputsForm } from "../models/AssistanceInputsForm";

const AssistanceInputForm = () => {
  const { assistanceDataForModify, isEditing } =
    useManageAssistancesCompaniesContext();

  let initialAssistanceInputValues: AssistanceInputsForm = {
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

  const { getCompaniesList } = useData();
  const { handleAssistance } = useManageAssistancesCompaniesContext();

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
          handleAssistance({ assistanceDatas, resetForm })
        }
      >
        {(formikProps) => <AssistanceFormLogic formikProps={formikProps} />}
      </Formik>
    </div>
  );
};

export default AssistanceInputForm;
