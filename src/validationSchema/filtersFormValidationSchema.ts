import * as Yup from "yup";

export const filtersFormValidationSchema = Yup.object().shape({
  start_date: Yup.date()
    .required("La data di inizio è obbligatoria")
    .typeError("Inserisci una data valida"),
  end_date: Yup.date()
    .required("La data di fine è obbligatoria")
    .typeError("Inserisci una data valida")
    .min(
      Yup.ref("start_date"),
      "La data di fine non può essere precedente alla data di inizio"
    ),
  targa: Yup.string(),
  numero_dossier: Yup.string(),
  nome_compagnia: Yup.string(),
  esito_intervento: Yup.string(),
});

export default filtersFormValidationSchema;
