import * as Yup from "yup";

export const assistanceInputValidationSchema = Yup.object().shape({
  targa: Yup.string()
    .required("La targa è obbligatoria")
    .matches(
      /^[A-Z0-9]+$/,
      "La targa deve contenere solo lettere maiuscole e numeri"
    ),

  data_intervento: Yup.string()
    .required("La data dell'intervento è obbligatoria")
    .typeError("Data non valida"),

  numero_dossier: Yup.string()
    .required("Il numero di dossier è obbligatorio")
    .matches(/^\d+$/, "Il numero dossier deve essere composto solo da cifre"),

  importo_intervento: Yup.string()
    .required("L'importo dell'intervento è obbligatorio")
    .matches(
      /^\d+([,.]\d{1,2})?$/,
      "L'importo deve essere un numero valido e può avere al massimo due decimali"
    ),

  nome_compagnia: Yup.string().required(
    "La compagnia assicurativa è obbligatoria"
  ),
});

export default assistanceInputValidationSchema;
