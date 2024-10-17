import * as Yup from "yup";

export const loginFormvalidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Devi inserire un indirizzo email valido")
    .required("L'email è obbligatoria"),
  password: Yup.string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .required("La password è obbligatoria"),
});
